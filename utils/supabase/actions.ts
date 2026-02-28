import { supabase } from "./client";
import { InvoiceState } from "@/types/invoice";

export async function saveInvoiceToSupabase(invoice: InvoiceState, companyId?: string) {
  if (!supabase) {
    throw new Error("Supabase is not configured. Missing environment variables.");
  }

  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    throw new Error("You must be logged in to save an invoice.");
  }

  const { subTotal, taxAmount, total } = calculateTotals(invoice);

  const { data, error } = await supabase
    .from('invoices')
    .insert([
      {
        user_id: session.user.id,
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
