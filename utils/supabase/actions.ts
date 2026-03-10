"use server";

import { createClient } from "@supabase/supabase-js";
import { InvoiceState } from "@/types/invoice";

function getServerSupabase(token: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Missing Supabase environment variables");
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      global: { headers: { Authorization: `Bearer ${token}` } }
    }
  );
}

export async function saveInvoiceToSupabase(token: string, invoice: InvoiceState, companyId?: string) {
  const supabase = getServerSupabase(token);

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("You must be logged in to save an invoice.");
  }

  const { subTotal, taxAmount, total } = calculateTotals(invoice);

  const { data, error } = await supabase
    .from('invoices')
    .insert([
      {
        user_id: user.id,
        company_id: companyId || null,
        invoice_number: invoice.details.invoiceNumber,
        client_name: invoice.client.name, // Keeping this for the dashboard list
        seller_info: invoice.company,
        client_info: invoice.client,
        items: invoice.items,
        subtotal: subTotal,
        tax: taxAmount,
        total_amount: total,
        currency: invoice.currency,
        data: invoice // Storing full state to easily re-hydrate the viewer
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
    })
    .eq('id', invoiceId)
    .select();

  if (error) {
    console.error("Error updating invoice:", error);
    throw error;
  }

  return data;
}
