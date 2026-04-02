import { NextResponse } from 'next/server';
import { sendInvoiceReminderEmail } from '@/utils/email-service';
import { getServiceSupabase } from '@/utils/supabase/client';
import config from '@/utils/config';
import { getCurrencySymbol } from '@/types/invoice';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const email = url.searchParams.get('email') || "vunguyencapital@gmail.com";
  
  const supabase = getServiceSupabase();
  if (!supabase) {
    return NextResponse.json({ success: false, error: 'Database configuration missing' }, { status: 500 });
  }

  // 1. Get user by email
  const { data: users, error: userError } = await supabase
    .from('users')
    .select('id, full_name, email')
    .eq('email', email)
    .limit(1);

  if (userError || !users || users.length === 0) {
    return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
  }

  const user = users[0];

  // 2. Fetch active invoices for this user
  const today = new Date().toISOString().split("T")[0];
  const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const { data: invoices, error: invError } = await supabase
    .from('invoices')
    .select('id, invoice_number, client_name, total_amount, currency, due_date, status')
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .not('status', 'eq', 'paid')
    .not('due_date', 'is', null)
    .lte('due_date', threeDaysFromNow); // Overdue or due within 3 days

  if (invError) {
    return NextResponse.json({ success: false, error: invError.message }, { status: 500 });
  }

  // 3. Separate overdue and upcoming (force mock splits for testing both tables!)
  const overdueInvoices: any[] = [];
  const upcomingInvoices: any[] = [];

  invoices.forEach((inv: any, index: number) => {
    const formatted = {
      invoiceId: inv.id,
      invoiceNumber: inv.invoice_number,
      clientName: inv.client_name || "Unknown",
      amount: Number(inv.total_amount).toFixed(2),
      currency: getCurrencySymbol(inv.currency || "USD"),
      dueDate: inv.due_date,
    };
    
    // For test purposes, arbitrarily put the first item in overdue, others in upcoming
    if (index === 0) {
      formatted.dueDate = '2026-03-24'; // Fake an overdue date
      overdueInvoices.push(formatted);
    } else {
      formatted.dueDate = '2026-03-30'; // Fake an upcoming date
      upcomingInvoices.push(formatted);
    }
  });

  if (overdueInvoices.length === 0 && upcomingInvoices.length === 0) {
    return NextResponse.json({ success: true, message: `No actionable invoices found for ${email} in the DB right now.` });
  }

  // 4. Send email
  const result = await sendInvoiceReminderEmail({
    email: user.email,
    name: user.full_name || undefined,
    overdueInvoices,
    upcomingInvoices
  });

  return NextResponse.json({ success: true, result, invoicesSent: overdueInvoices.length + upcomingInvoices.length });
}
