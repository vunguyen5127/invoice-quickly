import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { sendInvoiceReminderEmail } from "@/utils/email-service";
import { getCurrencySymbol } from "@/types/invoice";

/**
 * Daily cron job that:
 * 1. Keeps Supabase alive (prevents hibernation)
 * 2. Checks for overdue & upcoming-due invoices
 * 3. Sends reminder emails to invoice owners
 */
export async function GET(request: Request) {
  console.log("[cron/invoice-check] triggered at:", new Date().toISOString());

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

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

    // 5. Send reminder emails
    let emailsSent = 0;
    let emailsFailed = 0;

    for (const user of users) {
      const userInvs = userInvoices.get(user.id) || [];

      const overdueInvoices = userInvs
        .filter((inv) => inv.due_date < today)
        .map((inv) => ({
          invoiceNumber: inv.invoice_number,
          clientName: inv.client_name || "Unknown",
          amount: Number(inv.total_amount).toFixed(2),
          currency: getCurrencySymbol(inv.currency || "USD"),
          dueDate: inv.due_date,
        }));

      const upcomingInvoices = userInvs
        .filter((inv) => inv.due_date >= today && inv.due_date <= threeDaysFromNow)
        .map((inv) => ({
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

    return NextResponse.json({
      success: true,
      keepAlive: true,
      totalLogs,
      invoicesFound: invoices.length,
      usersNotified: emailsSent,
      emailsFailed,
    });
  } catch (error: any) {
    console.error("[cron/invoice-check] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
