"use server";

import config from "@/utils/config";
import { sendTestEmail } from "@/utils/email-service";
import { getServerSupabase, getServiceSupabase } from "@/utils/supabase/client";

/**
 * Server-side admin guard — verifies the JWT token belongs to an admin email.
 * Returns true only if the authenticated user is in config.adminEmails.
 * This is the server-side enforcement layer; AdminGuard (client) is just UX.
 */
async function isAdminToken(token: string): Promise<boolean> {
  if (!token) return false;
  try {
    const supabase = getServerSupabase(token);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return false;
    return (config.adminEmails as readonly string[]).includes(user.email);
  } catch {
    return false;
  }
}

export async function triggerInvoiceCheckCron(token: string) {
  if (!(await isAdminToken(token))) {
    console.warn("[admin/actions] triggerInvoiceCheckCron: unauthorized attempt");
    return { success: false, error: "Unauthorized" };
  }

  const siteUrl = config.siteUrl;
  const cronSecret = config.cron.secret;

  if (!cronSecret) {
    return { success: false, error: "CRON_SECRET not configured on server" };
  }

  try {
    const response = await fetch(`${siteUrl}/api/cron/invoice-check`, {
      method: "GET",
      headers: { Authorization: `Bearer ${cronSecret}` },
      cache: "no-store",
    });
    const data = await response.json();
    if (!response.ok) {
      return { success: false, error: data.error || `HTTP error! status: ${response.status}`, details: data };
    }
    return { success: true, data };
  } catch (error: any) {
    console.error("[admin/actions] Cron trigger failed:", error);
    return { success: false, error: error.message || "Failed to trigger cron" };
  }
}

export async function triggerTestEmail(token: string, email: string) {
  if (!(await isAdminToken(token))) {
    console.warn("[admin/actions] triggerTestEmail: unauthorized attempt");
    return { success: false, error: "Unauthorized" };
  }

  if (!email || !email.includes("@")) {
    return { success: false, error: "Invalid email address" };
  }
  try {
    const result = await sendTestEmail(email);
    return result;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getPaymentLogs(token: string, page = 1, pageSize = 50) {
  // Server-side admin guard — prevents non-admins from fetching logs
  // even if the client-side AdminGuard is bypassed (e.g. JS disabled).
  if (!(await isAdminToken(token))) {
    console.warn("[admin/actions] getPaymentLogs: unauthorized attempt");
    return { logs: [], total: 0 };
  }

  try {
    const supabase = getServiceSupabase();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, count, error } = await supabase
      .from("payment_logs")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;
    return { logs: data ?? [], total: count ?? 0 };
  } catch (err: any) {
    console.error("[admin/actions] getPaymentLogs failed:", err);
    return { logs: [], total: 0 };
  }
}

export async function getLoginLogs(token: string, page = 1, pageSize = 50) {
  // Must run server-side — service role key is not available in the browser.
  // login-logger.ts has no "use server", so getLoginLogs lives here instead.
  if (!(await isAdminToken(token))) {
    console.warn("[admin/actions] getLoginLogs: unauthorized attempt");
    return { logs: [], total: 0 };
  }

  try {
    const supabase = getServiceSupabase();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, count, error } = await supabase
      .from("user_login_logs")
      .select("*", { count: "exact" })
      .order("logged_in_at", { ascending: false })
      .range(from, to);

    if (error) throw error;
    return { logs: data ?? [], total: count ?? 0 };
  } catch (err: any) {
    console.error("[admin/actions] getLoginLogs failed:", err);
    return { logs: [], total: 0 };
  }
}

