"use server";

import { createClient } from "@supabase/supabase-js";
import {
  Entitlements,
  FREE_ENTITLEMENTS,
  PRO_ENTITLEMENTS,
  Subscription,
  SubscriptionStatus,
} from "@/types/subscription";

function getServerSupabase(token: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Missing Supabase environment variables");
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );
}

/**
 * Convert a subscription record into entitlements.
 * (Not exported — "use server" files can only export async functions)
 */
function getEntitlementsFromSubscription(sub: Subscription | null): Entitlements {
  if (!sub) return FREE_ENTITLEMENTS;

  const isPro = sub.plan === 'pro' && (sub.status === 'active' || sub.status === 'canceled');
  // canceled users keep pro until period ends
  if (isPro) {
    return { ...PRO_ENTITLEMENTS, status: sub.status as SubscriptionStatus };
  }
  return FREE_ENTITLEMENTS;
}

/**
 * Server action: fetch the current user's entitlements.
 */
export async function getUserEntitlements(token: string): Promise<Entitlements> {
  const supabase = getServerSupabase(token);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return FREE_ENTITLEMENTS;

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return getEntitlementsFromSubscription(sub as Subscription | null);
}

/**
 * Server action: count how many invoices the user created this month for a given company.
 */
export async function getMonthlyInvoiceCount(token: string, userId: string): Promise<number> {
  const supabase = getServerSupabase(token);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const { count, error } = await supabase
    .from("invoices")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", startOfMonth)
    .is("deleted_at", null);

  if (error) {
    console.error("Error counting monthly invoices:", error);
    return 0;
  }

  return count || 0;
}

/**
 * Server action: count how many companies the user owns.
 */
export async function getUserCompanyCount(token: string): Promise<number> {
  const supabase = getServerSupabase(token);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const { count, error } = await supabase
    .from("companies")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (error) {
    console.error("Error counting companies:", error);
    return 0;
  }

  return count || 0;
}
