"use server";

import { getUserCompanies } from "./dashboard-actions";
import { getItems, getSavedClients } from "./items-actions";
import { getUserEntitlements } from "@/utils/entitlements";

export async function getGlobalAppData(token: string) {
  try {
    const [compsRes, itemsRes, clientsRes, ents] = await Promise.all([
      getUserCompanies(token, 1, 50),
      getItems(token, { pageSize: 50 }).catch(() => ({ data: [], totalCount: 0 })),
      getSavedClients(token, { pageSize: 50 }).catch(() => ({ data: [], totalCount: 0 })),
      getUserEntitlements(token).catch(() => null),
    ]);

    return {
      companies: compsRes?.data || [],
      companiesTotalCount: compsRes?.totalCount || 0,
      items: itemsRes?.data || [],
      clients: clientsRes?.data || [],
      entitlements: ents,
    };
  } catch (error) {
    console.error("Error fetching global app data:", error);
    return {
      companies: [],
      companiesTotalCount: 0,
      items: [],
      clients: [],
      entitlements: null,
    };
  }
}
