import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { sendInvoiceReminderEmail } from "@/utils/email-service";
import { getCurrencySymbol } from "@/types/invoice";
import type { RecurringInterval } from "@/types/invoice";

import config from "@/utils/config";

export const dynamic = "force-dynamic";

/**
 * Daily cron job that:
 * 1. Keeps Supabase alive (prevents hibernation)
 * 2. Checks for overdue & upcoming-due invoices
 * 3. Sends reminder emails to invoice owners
 */
export async function GET(request: Request) {
  const now = new Date().toISOString();
  console.log(`[cron/invoice-check] Triggered at: ${now}`);

  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    console.warn("[cron/invoice-check] Missing Authorization header");
    return new NextResponse("Unauthorized: Missing auth header", { status: 401 });
  }

  if (authHeader !== `Bearer ${config.cron.secret}`) {
    console.error("[cron/invoice-check] Invalid Authorization header. Expected Bearer with secret.");
    // For debugging in Vercel logs (safe because it only logs presence/length)
    console.log(`[cron/invoice-check] Secret check: config.cron.secret defined? ${!!config.cron.secret}, length: ${config.cron.secret?.length || 0}`);
    return new NextResponse("Unauthorized: Secret mismatch", { status: 401 });
  }

  const { url: supabaseUrl, serviceRole: supabaseServiceRoleKey } = config.supabase;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return new NextResponse("Supabase configuration missing", { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  try {
    // 1. Keep-alive: ping login logs (preserves original functionality)
    const { count: totalLogs } = await supabase
      .from("user_login_logs")
      .select("id", { count: "exact", head: true });

    console.log(`[cron/invoice-check] Supabase alive. Total login logs: ${totalLogs}`);

    // 2. Find invoices that are overdue or due within 3 days
    const today = new Date().toISOString().split("T")[0];
    const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    // Fetch unpaid invoices with due dates that are overdue or upcoming
    const { data: invoices, error: invError } = await supabase
      .from("invoices")
      .select("id, invoice_number, client_name, total_amount, currency, due_date, status, user_id")
      .is("deleted_at", null)
      .not("status", "eq", "paid")
      .not("due_date", "is", null)
      .lte("due_date", threeDaysFromNow);

    if (invError) {
      console.error("[cron/invoice-check] Error fetching invoices:", invError);
      return NextResponse.json({ success: false, error: invError.message }, { status: 500 });
    }

    if (!invoices || invoices.length === 0) {
      console.log("[cron/invoice-check] No overdue or upcoming invoices found.");
      return NextResponse.json({
        success: true,
        message: "No reminders needed",
        keepAlive: true,
        totalLogs,
      });
    }

    console.log(`[cron/invoice-check] Found ${invoices.length} invoices needing attention.`);

    // 3. Group invoices by user_id
    const userInvoices = new Map<string, typeof invoices>();
    for (const inv of invoices) {
      const existing = userInvoices.get(inv.user_id) || [];
      existing.push(inv);
      userInvoices.set(inv.user_id, existing);
    }

    // 4. Fetch user emails for all affected users
    const userIds = Array.from(userInvoices.keys());
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, email, full_name")
      .in("id", userIds);

    if (usersError || !users) {
      console.error("[cron/invoice-check] Error fetching users:", usersError);
      return NextResponse.json({ success: false, error: "Failed to fetch users" }, { status: 500 });
    }

    // 4b. Filter to Pro users only (canUseAutoReminders = true for Pro)
    const { data: proSubs } = await supabase
      .from("subscriptions")
      .select("user_id")
      .in("user_id", userIds)
      .eq("plan", "pro")
      .in("status", ["active", "canceled"]); // canceled still has Pro until period end

    const proUserIds = new Set((proSubs || []).map((s) => s.user_id));

    // 5. Send reminder emails (Pro only)
    let emailsSent = 0;
    let emailsFailed = 0;

    for (const user of users) {
      // Skip Free users — canUseAutoReminders is false for them
      if (!proUserIds.has(user.id)) continue;

      const userInvs = userInvoices.get(user.id) || [];

      const overdueInvoices = userInvs
        .filter((inv) => inv.due_date < today)
        .map((inv) => ({
          invoiceId: inv.id,
          invoiceNumber: inv.invoice_number,
          clientName: inv.client_name || "Unknown",
          amount: Number(inv.total_amount).toFixed(2),
          currency: getCurrencySymbol(inv.currency || "USD"),
          dueDate: inv.due_date,
        }));

      const upcomingInvoices = userInvs
        .filter((inv) => inv.due_date >= today && inv.due_date <= threeDaysFromNow)
        .map((inv) => ({
          invoiceId: inv.id,
          invoiceNumber: inv.invoice_number,
          clientName: inv.client_name || "Unknown",
          amount: Number(inv.total_amount).toFixed(2),
          currency: getCurrencySymbol(inv.currency || "USD"),
          dueDate: inv.due_date,
        }));

      if (overdueInvoices.length === 0 && upcomingInvoices.length === 0) continue;

      const result = await sendInvoiceReminderEmail({
        email: user.email,
        name: user.full_name || undefined,
        overdueInvoices,
        upcomingInvoices,
      });

      if (result.success) {
        emailsSent++;
      } else {
        emailsFailed++;
      }
    }

    console.log(`[cron/invoice-check] Done. Emails sent: ${emailsSent}, failed: ${emailsFailed}`);

    // ─────────────────────────────────────────────────────────────
    // 6. Auto-generate recurring invoices for Pro users
    // ─────────────────────────────────────────────────────────────
    const { data: recurringInvoices } = await supabase
      .from("invoices")
      .select("id, invoice_number, data, company_id, user_id, currency, total_amount, client_name, recurring_interval, next_invoice_date")
      .eq("is_recurring", true)
      .lte("next_invoice_date", today)
      .is("deleted_at", null);

    let invoicesCreated = 0;

    if (recurringInvoices && recurringInvoices.length > 0) {
      // Query Pro users specifically for recurring — independent of email reminder proUserIds
      // (proUserIds above only contains users with upcoming invoices, which may be empty)
      const recurringUserIds = [...new Set(recurringInvoices.map(r => r.user_id))];
      const { data: recurringProSubs } = await supabase
        .from("subscriptions")
        .select("user_id")
        .in("user_id", recurringUserIds)
        .eq("plan", "pro")
        .in("status", ["active", "canceled"]);
      const recurringProUserIds = new Set((recurringProSubs || []).map(s => s.user_id));
      for (const rec of recurringInvoices) {
        // Only for Pro users (uses dedicated recurringProUserIds, not email-reminder proUserIds)
        if (!recurringProUserIds.has(rec.user_id)) continue;

        // Calculate next occurrence (helper defined once, used for both newNextDate and dueDateNew)
        const advanceDate = (current: string, interval: RecurringInterval): string => {
          const d = new Date(current);
          switch (interval) {
            case 'weekly':    d.setDate(d.getDate() + 7); break;
            case 'monthly':   d.setMonth(d.getMonth() + 1); break;
            case 'quarterly': d.setMonth(d.getMonth() + 3); break;
            case 'yearly':    d.setFullYear(d.getFullYear() + 1); break;
          }
          return d.toISOString().split('T')[0];
        };

        const interval = (rec.recurring_interval || 'monthly') as RecurringInterval;
        const newNextDate = advanceDate(rec.next_invoice_date || today, interval);

        // Build new invoice data: clone, update dates and number
        const baseData = rec.data || {};
        const issueDateNew = today;
        const dueDateNew = advanceDate(today, interval);

        // Generate new invoice number by bumping the last numeric segment.
        // e.g. INV-001 → INV-002 | INV-2026-003 → INV-2026-004
        // If no trailing digits (e.g. INVOICE-ABC), use INV-YYYY-001 format.
        const numMatch = rec.invoice_number?.match(/^(.*-)(\d+)$/);
        let newInvoiceNumber: string;
        if (numMatch) {
          const prefix = numMatch[1];
          const nextNum = String(parseInt(numMatch[2]) + 1).padStart(numMatch[2].length, '0');
          newInvoiceNumber = `${prefix}${nextNum}`;
        } else {
          // Fallback to standard year-based format
          const currentYear = new Date().getFullYear();
          newInvoiceNumber = `INV-${currentYear}-001`;
        }

        const newInvoiceData = {
          ...baseData,
          details: {
            ...(baseData.details || {}),
            invoiceNumber: newInvoiceNumber,
            issueDate: issueDateNew,
            dueDate: dueDateNew,
          },
          // Do NOT carry recurring flag on the cloned child invoice
          isRecurring: false,
          recurringInterval: undefined,
          nextInvoiceDate: undefined,
        };

        // Recalculate totals from cloned data
        const cloneItems = baseData.items || [];
        const subTotalNew = cloneItems.reduce(
          (acc: number, item: any) => acc + (item.quantity * item.rate), 0
        );
        const discountAmt = baseData.discountType === 'percentage'
          ? subTotalNew * ((baseData.discount || 0) / 100)
          : (baseData.discount || 0);
        const afterDiscount = Math.max(0, subTotalNew - discountAmt);
        const taxAmtNew = baseData.taxType === 'percentage'
          ? afterDiscount * ((baseData.taxRate || 0) / 100)
          : (baseData.taxRate || 0);
        const totalNew = afterDiscount + taxAmtNew + (baseData.shipping || 0);

        // Insert new invoice — copy all structured fields from parent
        const { error: insertError } = await supabase
          .from("invoices")
          .insert([{
            user_id: rec.user_id,
            company_id: rec.company_id,
            invoice_number: newInvoiceNumber,
            client_name: rec.client_name,
            seller_info: baseData.company || null,
            client_info: baseData.client || null,
            items: cloneItems,
            subtotal: subTotalNew,
            tax: taxAmtNew,
            currency: rec.currency,
            total_amount: totalNew,
            status: 'draft',
            due_date: dueDateNew,
            data: newInvoiceData,
            is_recurring: false,
          }]);

        if (insertError) {
          console.error(`[cron] Failed to create recurring invoice for ${rec.id}:`, insertError);
          continue;
        }

        // Update next_invoice_date on the original recurring invoice
        await supabase
          .from("invoices")
          .update({ next_invoice_date: newNextDate })
          .eq("id", rec.id);

        invoicesCreated++;
      }
      console.log(`[cron/invoice-check] Recurring: ${invoicesCreated} invoices auto-created.`);
    }

    return NextResponse.json({
      success: true,
      keepAlive: true,
      totalLogs,
      invoicesFound: invoices.length,
      usersNotified: emailsSent,
      emailsFailed,
      recurringCreated: invoicesCreated,
    });
  } catch (error: any) {
    console.error("[cron/invoice-check] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
