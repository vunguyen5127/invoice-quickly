"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getGlobalAppData } from "@/utils/supabase/app-data-actions";
import { SavedItem } from "@/types/item";
import { SavedClient } from "@/types/client";
import { useAuth } from "./auth-context";

interface DataContextType {
  companies: any[];
  companiesTotalCount: number;
  items: SavedItem[];
  clients: SavedClient[];
  entitlements: any | null;
  loadingData: boolean;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { session, loading: authLoading } = useAuth();
  const [companies, setCompanies] = useState<any[]>([]);
  const [companiesTotalCount, setCompaniesTotalCount] = useState<number>(0);
  const [items, setItems] = useState<SavedItem[]>([]);
  const [clients, setClients] = useState<SavedClient[]>([]);
  const [entitlements, setEntitlements] = useState<any | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  const loadData = useCallback(async () => {
    if (!session?.access_token) {
      setCompanies([]);
      setCompaniesTotalCount(0);
      setItems([]);
      setClients([]);
      setEntitlements(null);
      setLoadingData(false);
      return;
    }

    try {
      const appData = await getGlobalAppData(session.access_token);

      setCompanies(appData.companies);
      setCompaniesTotalCount(appData.companiesTotalCount);
      setItems(appData.items);
      setClients(appData.clients);
      setEntitlements(appData.entitlements);
    } catch (error) {
      console.error("[DataProvider] Error fetching user data:", error);
    } finally {
      setLoadingData(false);
    }
  }, [session?.access_token]);

  useEffect(() => {
    if (!authLoading) {
      loadData();
    }
  }, [authLoading, loadData]);

  return (
    <DataContext.Provider value={{ companies, companiesTotalCount, items, clients, entitlements, loadingData, refreshData: loadData }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
