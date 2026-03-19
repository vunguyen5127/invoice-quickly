"use client";

import React, { useEffect, useState } from "react";
import { getDashboardStats } from "../actions";
import { DollarSign, AlertTriangle, CheckCircle2, FileText, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

export default function AnalyticsPage() {
  const { t } = useLanguage();
  const { session, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [stats, setStats] = useState({ totalOutstanding: 0, overdueCount: 0, paidThisMonth: 0, totalInvoices: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!session) {
      router.push("/login?redirect=/dashboard/analytics");
      return;
    }

    const loadData = async () => {
      try {
        const dashStats = await getDashboardStats(session.access_token);
        setStats(dashStats);
      } catch (error) {
        console.error("Failed to load stats", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [session, authLoading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-8 py-8 max-w-7xl">
      <div className="mb-8 flex items-center gap-4">
        <Link 
          href="/dashboard"
          className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Analytics</h1>
          <p className="text-zinc-500 mt-1">Overview of your invoicing data</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[5px] p-6 flex flex-col gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">{t.totalOutstanding || "Total Outstanding"}</p>
            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 break-words">${stats.totalOutstanding.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[5px] p-6 flex flex-col gap-4">
          <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">{t.overdueInvoices || "Overdue"}</p>
            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{stats.overdueCount}</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[5px] p-6 flex flex-col gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">{t.paidThisMonth || "Paid This Month"}</p>
            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 break-words">${stats.paidThisMonth.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[5px] p-6 flex flex-col gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">{t.totalInvoices || "Total Invoices"}</p>
            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{stats.totalInvoices}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
