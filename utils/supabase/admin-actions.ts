"use server";

import config from "@/utils/config";
import { sendTestEmail } from "@/utils/email-service";
import { getServiceSupabase } from "@/utils/supabase/client";

export async function triggerInvoiceCheckCron() {
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

export async function triggerTestEmail(email: string) {
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

export async function getPaymentLogs(page = 1, pageSize = 50) {
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
