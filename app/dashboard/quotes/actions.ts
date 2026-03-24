"use server";

import { createClient } from "@supabase/supabase-js";
import config from "@/utils/config";

function getServerSupabase(token: string) {
  const { url, anonKey } = config.supabase;
  if (!url || !anonKey) {
    throw new Error("Missing Supabase environment variables");
  }
  return createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } }
  });
}

export async function getCompanyQuotes(
  token: string, 
  companyId: string, 
  options: { 
    page?: number; 
    pageSize?: number; 
    search?: string; 
    sortField?: string; 
    sortDir?: "asc" | "desc";
    status?: string;
  } = {}
) {
  const supabase = getServerSupabase(token);
  const { 
    page = 1, 
    pageSize = 10, 
    search = "", 
    sortField = "created_at", 
    sortDir = "desc",
    status = "all"
  } = options;
  
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("quotes")
    .select("id, quote_number, client_name, created_at, total_amount, currency, status, due_date", { count: "exact" })
    .eq("company_id", companyId)
    .is("deleted_at", null);

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  if (search.trim()) {
    query = query.or(`quote_number.ilike.%${search}%,client_name.ilike.%${search}%`);
  }

  const { data, count, error } = await query
    .order(sortField, { ascending: sortDir === "asc" })
    .range(from, to);

  if (error) {
    console.error("Error fetching company quotes:", error);
    return { data: [], totalCount: 0 };
  }

  console.log(`[DEBUG] getCompanyQuotes for company ${companyId}`, `Found ${count} quotes`, data);

  return { data: data || [], totalCount: count || 0 };
}

export async function createQuote(token: string, quoteData: any) {
  const supabase = getServerSupabase(token);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthenticated' };

  // Generate next quote number if not provided
  let quoteNumber = quoteData.details?.quoteNumber;
  if (!quoteNumber) {
    quoteNumber = await getNextQuoteNumber(token, quoteData.companyId);
  }

  const payload = {
    user_id: user.id,
    company_id: quoteData.companyId,
    quote_number: quoteNumber,
    client_name: quoteData.client?.name || "Unknown Client",
    seller_info: quoteData.company,
    client_info: quoteData.client,
    items: quoteData.items,
    subtotal: quoteData.subtotal || 0,
    tax: quoteData.taxRate || 0,
    total_amount: quoteData.totalAmount || 0,
    currency: quoteData.currency || "USD",
    data: quoteData,
    status: quoteData.status || "draft",
    due_date: quoteData.details?.dueDate || null
  };

  const { data, error } = await supabase
    .from("quotes")
    .insert([payload])
    .select("id")
    .single();

  if (error) {
    console.error("Error creating quote IN DB:", error, payload);
    return { success: false, error: error.message };
  }
  console.log("[DEBUG] Successfully created quote IN DB:", data.id, "Payload company_id:", payload.company_id);

  return { success: true, id: data.id };
}

export async function updateQuote(token: string, quoteId: string, quoteData: any) {
  const supabase = getServerSupabase(token);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthenticated' };

  const payload = {
    quote_number: quoteData.details?.quoteNumber || quoteData.quoteNumber,
    client_name: quoteData.client?.name || "Unknown Client",
    seller_info: quoteData.company,
    client_info: quoteData.client,
    items: quoteData.items,
    subtotal: quoteData.subtotal || 0,
    tax: quoteData.taxRate || 0,
    total_amount: quoteData.totalAmount || 0,
    currency: quoteData.currency || "USD",
    data: quoteData,
    status: quoteData.status || "draft",
    due_date: quoteData.details?.dueDate || null
  };

  const { data, error } = await supabase
    .from("quotes")
    .update(payload)
    .eq("id", quoteId)
    .eq("user_id", user.id)
    .select("id")
    .single();

  if (error) {
    console.error("Error updating quote:", error);
    return { success: false, error: error.message };
  }

  return { success: true, id: data.id };
}

export async function deleteQuote(token: string, id: string) {
  const supabase = getServerSupabase(token);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthenticated' };
  
  const { error } = await supabase
    .from("quotes")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting quote:", error);
    return { success: false, error: error.message };
  }
  return { success: true };
}

export async function bulkDeleteQuotes(token: string, ids: string[]) {
  const supabase = getServerSupabase(token);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthenticated' };

  const { error } = await supabase
    .from('quotes')
    .delete()
    .in('id', ids)
    .eq('user_id', user.id);

  if (error) {
    console.error('[bulkDeleteQuotes] error:', error);
    return { success: false, error: error.message };
  }
  return { success: true };
}

export async function bulkUpdateQuoteStatus(token: string, ids: string[], newStatus: string) {
  const supabase = getServerSupabase(token);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthenticated' };

  // Optional guard: prevent modifying if it's already 'invoiced'
  const { data: quotes, error: fetchError } = await supabase
    .from('quotes')
    .select('id, status')
    .in('id', ids)
    .eq('user_id', user.id);
    
  if (fetchError) return { success: false, error: fetchError.message };
  
  const updatableIds = quotes?.filter(q => !(q.status === 'invoiced' && newStatus !== 'invoiced')).map(q => q.id) || [];

  if (updatableIds.length === 0) return { success: true, skipped: true };

  const { error: updateError } = await supabase
    .from('quotes')
    .update({ status: newStatus })
    .in('id', updatableIds)
    .eq('user_id', user.id);

  if (updateError) return { success: false, error: updateError.message };
  return { success: true, updatedIds: updatableIds };
}

export async function getNextQuoteNumber(token: string, companyId: string): Promise<string> {
  const supabase = getServerSupabase(token);
  const currentYear = new Date().getFullYear();

  const { data, error } = await supabase
    .from("quotes")
    .select("quote_number")
    .eq("company_id", companyId)
    .is("deleted_at", null);

  if (error || !data || data.length === 0) {
    return `EST-${currentYear}-001`; // Or QUOTE-
  }

  let maxIndex = 0;
  for (const row of data) {
    const match = row.quote_number?.match(/EST-(\d{4})-(\d+)/) || row.quote_number?.match(/QUOTE-(\d{4})-(\d+)/);
    if (match) {
      const year = parseInt(match[1]);
      const index = parseInt(match[2]);
      if (year === currentYear && index > maxIndex) {
        maxIndex = index;
      }
    }
  }

  const nextIndex = (maxIndex + 1).toString().padStart(3, "0");
  return `EST-${currentYear}-${nextIndex}`;
}

export async function convertQuoteToInvoice(token: string, quoteId: string) {
  const supabase = getServerSupabase(token);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthenticated' };

  // 1. Fetch the quote
  const { data: quote, error: quoteError } = await supabase
    .from("quotes")
    .select("*")
    .eq("id", quoteId)
    .eq("user_id", user.id)
    .single();

  if (quoteError || !quote) {
    return { success: false, error: "Quote not found or unreadable" };
  }

  if (quote.status === 'invoiced') {
     return { success: false, error: "Quote has already been invoiced", invoiceId: quote.invoice_id };
  }

  // 2. We need the new invoice number
  // Since we access invoice table, we should use getNextInvoiceNumber from dashboard/actions
  // Instead of importing, we redefine safely or call a unified util
  const currentYear = new Date().getFullYear();
  let nextInvoiceNumber = `INV-${currentYear}-001`;
  
  const { data: invData } = await supabase
    .from("invoices")
    .select("invoice_number")
    .eq("company_id", quote.company_id)
    .is("deleted_at", null);
    
  if (invData && invData.length > 0) {
    let maxIndex = 0;
    for (const row of invData) {
      const match = row.invoice_number?.match(/INV-(\d{4})-(\d+)/);
      if (match) {
        const year = parseInt(match[1]);
        const index = parseInt(match[2]);
        if (year === currentYear && index > maxIndex) maxIndex = index;
      }
    }
    const nextIndex = (maxIndex + 1).toString().padStart(3, "0");
    nextInvoiceNumber = `INV-${currentYear}-${nextIndex}`;
  }

  // 3. Transform Quote JSON to Invoice JSON
  const invoiceData = { ...quote.data };
  if (invoiceData.details) {
    invoiceData.details.quoteNumber = undefined;
    invoiceData.details.invoiceNumber = nextInvoiceNumber;
    // Set issue date to today
    invoiceData.details.issueDate = new Date().toISOString().split('T')[0];
    // Keep or recalculate due date
    invoiceData.details.dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  }
  invoiceData.id = undefined; // clear old quote id

  // 4. Create new Invoice
  const invoicePayload = {
    user_id: user.id,
    company_id: quote.company_id,
    invoice_number: nextInvoiceNumber,
    client_name: quote.client_name,
    seller_info: quote.seller_info,
    client_info: quote.client_info,
    items: quote.items,
    subtotal: quote.subtotal,
    tax: quote.tax,
    total_amount: quote.total_amount,
    currency: quote.currency,
    data: invoiceData,
    status: 'draft',
    due_date: invoiceData.details?.dueDate || null
  };

  const { data: newInvoice, error: createError } = await supabase
    .from("invoices")
    .insert([invoicePayload])
    .select("id")
    .single();

  if (createError) {
    return { success: false, error: "Failed to create invoice from quote" };
  }

  // 5. Link Quote to Invoice and mark it "invoiced"
  const { error: updateError } = await supabase
    .from("quotes")
    .update({ 
      status: 'invoiced',
      invoice_id: newInvoice.id
    })
    .eq("id", quoteId)
    .eq("user_id", user.id);

  if (updateError) {
    // Note: invoice is created but quote didn't link - edge case failure
    console.error("Failed to link quote to invoice", updateError);
  }

  return { success: true, invoiceId: newInvoice.id };
}

export async function getQuote(token: string, quoteId: string) {
  const supabase = getServerSupabase(token);
  const { data: { user } } = await supabase.auth.getUser();

  // If user is authenticated, we can optionally check ownership, but let's just use the query.
  // We can fetch via public logic if needed, but this is dashboard action.
  const query = supabase
    .from("quotes")
    .select("*")
    .eq("id", quoteId);
    
  if (user) {
    query.eq("user_id", user.id);
  }

  const { data, error } = await query.single();

  if (error || !data) {
    return null;
  }

  return data;
}

// For public /share/quote/[id]
export async function getPublicQuote(id: string) {
  const { url, anonKey } = config.supabase;
  if (!url || !anonKey) throw new Error("Missing Supabase env");
  
  const supabase = createClient(url, anonKey);
  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data;
}

export async function acceptQuote(quoteId: string) {
  const { url, anonKey } = config.supabase;
  const supabase = createClient(url, anonKey);
  
  // Update without auth, relying on UUID being hard to guess. Real app might need a secret token.
  // Actually, wait, RLS blocks this if we don't use server role. Let's use service_role for public status updates
  // Or since RLS for quotes updates requires auth.uid() = user_id, public users cannot update!
  // We must bypass RLS using a service role key.
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY for public quote action");
  }
  const adminSupabase = createClient(url, serviceRoleKey);

  const { data, error } = await adminSupabase
    .from("quotes")
    .update({ status: 'accepted' })
    .eq("id", quoteId)
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function rejectQuote(quoteId: string) {
  const { url, anonKey } = config.supabase;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  
  const adminSupabase = createClient(url, serviceRoleKey);

  const { data, error } = await adminSupabase
    .from("quotes")
    .update({ status: 'rejected' })
    .eq("id", quoteId)
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true };
}
