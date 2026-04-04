"use server";

import { InvoiceState } from "@/types/invoice";
import { getServerSupabase } from "@/utils/supabase/client";

export async function getInvoiceById(token: string, id: string): Promise<(InvoiceState & { _companyId?: string; _status?: string; _dueDate?: string }) | null> {
  const supabase = getServerSupabase(token);
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("invoices")
    .select("data, company_id, status, due_date")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("Error fetching invoice:", error);
    return null;
  }

  if (data.data) {
    const invoiceState = data.data as unknown as InvoiceState;
    invoiceState.id = id;
    return { ...invoiceState, _companyId: data.company_id, _status: data.status || 'draft', _dueDate: data.due_date };
  }
  
  return null;
}

export async function saveInvoiceToSupabase(token: string, invoice: InvoiceState, companyId?: string) {
  const supabase = getServerSupabase(token);

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("You must be logged in to save an invoice.");
  }

  // ── Entitlement guard: check monthly invoice limit ──
  const { getUserEntitlements, getMonthlyInvoiceCount } = await import("@/utils/entitlements");
  const entitlements = await getUserEntitlements(token);
  if (entitlements.maxInvoicesPerMonth !== null) {
    const monthlyCount = await getMonthlyInvoiceCount(token, user.id);
    if (monthlyCount >= entitlements.maxInvoicesPerMonth) {
      throw new Error("INVOICE_LIMIT_REACHED");
    }
  }

  const { subTotal, taxAmount, total } = calculateTotals(invoice);

  const { data, error } = await supabase
    .from('invoices')
    .insert([
      {
        user_id: user.id,
        company_id: companyId || null,
        invoice_number: invoice.details.invoiceNumber,
        client_name: invoice.client.name,
        seller_info: invoice.company,
        client_info: invoice.client,
        items: invoice.items,
        subtotal: subTotal,
        tax: taxAmount,
        total_amount: total,
        currency: invoice.currency,
        data: invoice,
        status: 'draft',
        due_date: invoice.details.dueDate || null,
        is_recurring: invoice.isRecurring ?? false,
        recurring_interval: invoice.isRecurring ? (invoice.recurringInterval ?? null) : null,
        next_invoice_date: invoice.isRecurring ? (invoice.nextInvoiceDate ?? null) : null,
      }
    ])
    .select()

  if (error) {
    console.error("Error saving invoice:", error);
    throw error;
  }

  return data;
}

function calculateTotals(invoice: InvoiceState) {
  const subTotal = invoice.items.reduce((acc, item) => acc + (item.quantity * item.rate), 0);
  const discountAmount = invoice.discountType === 'percentage' 
    ? subTotal * (invoice.discount / 100) 
    : invoice.discount;
  const afterDiscount = Math.max(0, subTotal - discountAmount);
  const taxAmount = afterDiscount * (invoice.taxRate / 100);
  const total = afterDiscount + taxAmount;
  
  return { subTotal, taxAmount, total };
}

export async function updateInvoiceInSupabase(token: string, invoiceId: string, invoice: InvoiceState) {
  const supabase = getServerSupabase(token);

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("You must be logged in to update an invoice.");
  }

  const { subTotal, taxAmount, total } = calculateTotals(invoice);

  const { data, error } = await supabase
    .from('invoices')
    .update({
      invoice_number: invoice.details.invoiceNumber,
      client_name: invoice.client.name,
      seller_info: invoice.company,
      client_info: invoice.client,
      items: invoice.items,
      subtotal: subTotal,
      tax: taxAmount,
      total_amount: total,
      currency: invoice.currency,
      data: invoice,
      due_date: invoice.details.dueDate || null,
      is_recurring: invoice.isRecurring ?? false,
      recurring_interval: invoice.isRecurring ? (invoice.recurringInterval ?? null) : null,
      next_invoice_date: invoice.isRecurring ? (invoice.nextInvoiceDate ?? null) : null,
    })
    .eq('id', invoiceId)
    .eq('user_id', user.id)  // ✅ ownership guard added
    .select();

  if (error) {
    console.error("Error updating invoice:", error);
    throw error;
  }

  return data;
}
