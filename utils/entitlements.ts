"use server";

import {
  Entitlements,
  FREE_ENTITLEMENTS,
  PRO_ENTITLEMENTS,
  Subscription,
  SubscriptionStatus,
} from "@/types/subscription";
import { getServerSupabase } from "@/utils/supabase/client";

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

  const { count: invoiceCount, error: invError } = await supabase
    .from("invoices")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", startOfMonth);

  if (invError) {
    console.error("Error counting monthly invoices:", invError);
  }

  const { count: quoteCount, error: quoteError } = await supabase
    .from("quotes")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", startOfMonth);

  if (quoteError) {
    console.error("Error counting monthly quotes:", quoteError);
  }

  return (invoiceCount || 0) + (quoteCount || 0);
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

/**
 * Server action: count how many clients the user has saved.
 */
export async function getUserClientCount(token: string): Promise<number> {
  const supabase = getServerSupabase(token);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const { count, error } = await supabase
    .from("clients")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (error) {
    console.error("Error counting clients:", error);
    return 0;
  }

  return count || 0;
}

/**
 * Server action: count how many items the user has saved.
 */
export async function getUserItemCount(token: string): Promise<number> {
  const supabase = getServerSupabase(token);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const { count, error } = await supabase
    .from("items")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (error) {
    console.error("Error counting items:", error);
    return 0;
  }

  return count || 0;
}
