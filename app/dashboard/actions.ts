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

export async function getUserCompanies(token: string, page = 1, pageSize = 12) {
  const supabase = getServerSupabase(token);
  
  // Calculate range
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // 1. Fetch exact total count and companies for the current page
  // We omit nested relations here to avoid slow count queries across table joins
  const { data: companiesData, error: companiesError, count } = await supabase
    .from("companies")
    .select(`
      id, 
      name, 
      email, 
      address,
      phone,
      logo_url, 
      signature_url,
      signer_name,
      default_currency,
      default_notes,
      default_terms,
      show_notes,
      show_terms,
      default_tax,
      default_discount,
      created_at
    `, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (companiesError) {
    console.error("Error fetching companies:", companiesError);
    return { data: [], totalCount: 0 };
  }

  const companiesList = companiesData || [];
  
  if (companiesList.length === 0) {
    return { data: [], totalCount: count || 0 };
  }

  // 2. Fetch invoice counts only for the companies on the current page
  const companyIds = companiesList.map(c => c.id);
  const { data: countsData, error: countsError } = await supabase
    .from("companies")
    .select(`
      id,
      invoices:invoices(count)
    `)
    .in("id", companyIds)
    .is("invoices.deleted_at", null);

  if (countsError) {
    console.error("Error fetching invoice counts:", countsError);
    // Proceed without counts if it fails
  }

  // Create a map for quick lookup
  const countsMap = new Map();
  if (countsData) {
    countsData.forEach(c => {
      countsMap.set(c.id, (c.invoices as any)?.[0]?.count || 0);
    });
  }

  // Transform the response to match the expected format (invoices as a mocked array)
  const data = companiesList.map(c => ({
    ...c,
    invoices: new Array(countsMap.get(c.id) || 0).fill(null)
  }));

  return { data, totalCount: count || 0 };
}

export async function createCompany(token: string, companyData: { name: string; email: string; address: string; phone?: string; logo?: string; signatureUrl?: string; signerName?: string; defaultCurrency?: string; defaultNotes?: string; defaultTerms?: string; showNotes?: boolean; showTerms?: boolean; defaultTax?: number; defaultDiscount?: number }) {
  const supabase = getServerSupabase(token);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // ── Entitlement guard: check company limit ──
  const { getUserEntitlements, getUserCompanyCount } = await import("@/utils/entitlements");
  const entitlements = await getUserEntitlements(token);
  if (entitlements.maxCompanies !== null) {
    const companyCount = await getUserCompanyCount(token);
    if (companyCount >= entitlements.maxCompanies) {
      return { error: "COMPANY_LIMIT_REACHED" };
    }
  }

  const { data, error } = await supabase
    .from("companies")
    .insert([{
      user_id: user.id,
      name: companyData.name,
      email: companyData.email,
      address: companyData.address,
      phone: companyData.phone,
      logo_url: companyData.logo,
      signature_url: companyData.signatureUrl,
      signer_name: companyData.signerName,
      default_currency: companyData.defaultCurrency || 'USD',
      default_notes: companyData.defaultNotes || '',
      default_terms: companyData.defaultTerms || '',
      show_notes: companyData.showNotes ?? true,
      show_terms: companyData.showTerms ?? true,
      default_tax: companyData.defaultTax || 0,
      default_discount: companyData.defaultDiscount || 0,
    }])
    .select()
    .single();

  if (error) {
    console.error("Error creating company:", error);
    return null;
  }
  return data;
}

export async function updateCompany(token: string, companyId: string, companyData: { name: string; email: string; address: string; phone?: string; logo?: string; signatureUrl?: string; signerName?: string; defaultCurrency?: string; defaultNotes?: string; defaultTerms?: string; showNotes?: boolean; showTerms?: boolean; defaultTax?: number; defaultDiscount?: number }) {
  const supabase = getServerSupabase(token);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("companies")
    .update({
      name: companyData.name,
      email: companyData.email,
      address: companyData.address,
      phone: companyData.phone,
      logo_url: companyData.logo,
      signature_url: companyData.signatureUrl,
      signer_name: companyData.signerName,
      default_currency: companyData.defaultCurrency,
      default_notes: companyData.defaultNotes,
      default_terms: companyData.defaultTerms,
      show_notes: companyData.showNotes,
      show_terms: companyData.showTerms,
      default_tax: companyData.defaultTax,
      default_discount: companyData.defaultDiscount,
    })
    .eq("id", companyId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating company:", error);
    return null;
  }
  return data;
}

export async function deleteCompany(token: string, id: string) {
  const supabase = getServerSupabase(token);
  
  // RLS will ensure user owns the company. Invoices should cascade delete if set up in DB, 
  // or we might need to delete them first depending on DB constraints.
  const { error } = await supabase
    .from("companies")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting company:", error);
    return false;
  }
  return true;
}

export async function getCompanyInvoices(
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
  
  // Calculate range
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Build queries
  let query = supabase
    .from("invoices")
    .select("id, invoice_number, client_name, created_at, total_amount, currency, status, due_date, is_recurring, recurring_interval", { count: "exact" })
    .eq("company_id", companyId)
    .is("deleted_at", null);

  // Apply filters
  if (status && status !== "all") {
    if (status === "overdue") {
      const today = new Date().toISOString().split('T')[0];
      query = query.neq("status", "paid").lt("due_date", today);
    } else {
      query = query.eq("status", status);
    }
  }

  if (search.trim()) {
    query = query.or(`invoice_number.ilike.%${search}%,client_name.ilike.%${search}%`);
  }

  // Execute query
  const { data, count, error } = await query
    .order(sortField, { ascending: sortDir === "asc" })
    .range(from, to);

  if (error) {
    console.error("Error fetching company invoices:", error);
    return { data: [], totalCount: 0 };
  }

  return { 
    data: data || [], 
    totalCount: count || 0 
  };
}

export async function getAllCompanyInvoices(token: string, companyId: string) {
  const supabase = getServerSupabase(token);
  
  // First get the exact total count
  const { count, error: countError } = await supabase
    .from("invoices")
    .select("id", { count: "exact", head: true })
    .eq("company_id", companyId)
    .is("deleted_at", null);

  if (countError) {
    console.error("Error fetching all company invoices count:", countError);
    return [];
  }

  const total = count || 0;
  if (total === 0) return [];

  // Supabase/PostgREST typically limits single requests to 1000 rows.
  // We'll fetch concurrently in chunks of 1000 to maximize performance.
  const pageSize = 1000;
  const numPages = Math.ceil(total / pageSize);
  const fetchPromises = [];

  for (let i = 0; i < numPages; i++) {
    const from = i * pageSize;
    const to = from + pageSize - 1;
    
    fetchPromises.push(
      supabase
        .from("invoices")
        .select("invoice_number, client_name, created_at, due_date, total_amount, currency, status, tax_rate, tax_amount, discount, discount_amount, subtotal, shipping")
        .eq("company_id", companyId)
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .range(from, to)
    );
  }

  const results = await Promise.all(fetchPromises);
  
  const allInvoices: any[] = [];
  for (const { data, error } of results) {
    if (error) {
      console.error("Error fetching chunk of invoices:", error);
    } else if (data) {
      allInvoices.push(...data);
    }
  }

  return allInvoices;
}

export async function getCompanyById(token: string, companyId: string) {
  const supabase = getServerSupabase(token);
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("id", companyId)
    .single();

  if (error) {
    console.error("Error fetching company:", error);
    return null;
  }
  return data;
}

// Keeping the old one just in case 
export async function deleteInvoice(token: string, id: string) {
  const supabase = getServerSupabase(token);
  
  const { error } = await supabase
    .from("invoices")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("Error deleting invoice:", error);
    return false;
  }
  return true;
}

export async function getNextInvoiceNumber(token: string, companyId: string): Promise<string> {
  const supabase = getServerSupabase(token);
  const currentYear = new Date().getFullYear();

  const { data, error } = await supabase
    .from("invoices")
    .select("invoice_number")
    .eq("company_id", companyId)
    .is("deleted_at", null);

  if (error || !data || data.length === 0) {
    return `INV-${currentYear}-001`;
  }

  // Find the highest index across all invoice numbers for the current year
  let maxIndex = 0;
  for (const row of data) {
    const match = row.invoice_number?.match(/INV-(\d{4})-(\d+)/);
    if (match) {
      const year = parseInt(match[1]);
      const index = parseInt(match[2]);
      if (year === currentYear && index > maxIndex) {
        maxIndex = index;
      }
    }
  }

  const nextIndex = (maxIndex + 1).toString().padStart(3, "0");
  return `INV-${currentYear}-${nextIndex}`;
}

export async function bulkDeleteInvoices(token: string, ids: string[]) {
  const supabase = getServerSupabase(token);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthenticated' };

  const { error } = await supabase
    .from('invoices')
    .delete()
    .in('id', ids)
    .eq('user_id', user.id);

  if (error) {
    console.error('[bulkDeleteInvoices] error:', error);
    return { success: false, error: error.message };
  }
  return { success: true };
}

export async function bulkUpdateInvoiceStatus(token: string, ids: string[], newStatus: string) {
  const supabase = getServerSupabase(token);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthenticated' };

  // Optional guard: prevent un‑paying a paid invoice
  const { data: invoices, error: fetchError } = await supabase
    .from('invoices')
    .select('id, status')
    .in('id', ids)
    .eq('user_id', user.id);
  if (fetchError) {
    console.error('[bulkUpdateInvoiceStatus] fetch error:', fetchError);
    return { success: false, error: fetchError.message };
  }
  const updatableIds = invoices?.filter(inv => !(inv.status === 'paid' && newStatus !== 'paid')).map(inv => inv.id) || [];

  if (updatableIds.length === 0) {
    return { success: true, skipped: true };
  }

  const { error: updateError } = await supabase
    .from('invoices')
    .update({ status: newStatus })
    .in('id', updatableIds)
    .eq('user_id', user.id);

  if (updateError) {
    console.error('[bulkUpdateInvoiceStatus] update error:', updateError);
    return { success: false, error: updateError.message };
  }
  return { success: true, updatedIds: updatableIds };
}

export async function getDashboardStats(token: string, options: { companyId?: string, period?: 'day' | 'week' | 'month' | 'year' } = {}) {
  const { companyId, period = 'year' } = options;
  const supabase = getServerSupabase(token);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { totalOutstanding: 0, overdueCount: 0, paidThisMonth: 0, totalInvoices: 0, chartData: [] };

  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];

  // Optimization: Fetch aggregate stats directly from DB
  let statsQuery = supabase
    .from("invoices")
    .select("total_amount, status, due_date, created_at", { count: "exact" })
    .eq("user_id", user.id)
    .is("deleted_at", null);

  if (companyId) {
    statsQuery = statsQuery.eq("company_id", companyId);
  }

  const { data: invoices, count, error } = await statsQuery;

  if (error || !invoices) {
    console.error("Error fetching dashboard stats:", error);
    return { totalOutstanding: 0, overdueCount: 0, paidThisMonth: 0, totalInvoices: 0, chartData: [] };
  }

  let totalOutstanding = 0;
  let overdueCount = 0;
  let paidThisMonth = 0;

  // 1. Prepare Chart Data Structure based on period
  const chartMap = new Map();
  
  if (period === 'day') {
    // Last 24 hours (hourly)
    for (let i = 23; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 60 * 60 * 1000);
      const key = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}-${d.getHours()}`;
      chartMap.set(key, { label: `${d.getHours()}:00`, revenue: 0, overdue: 0 });
    }
  } else if (period === 'week') {
    // Last 7 days (daily)
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
      chartMap.set(key, { label: d.toLocaleString('default', { weekday: 'short' }), revenue: 0, overdue: 0 });
    }
  } else if (period === 'month') {
    // Last 30 days (daily)
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
      chartMap.set(key, { label: `${d.getDate()}/${d.getMonth()+1}`, revenue: 0, overdue: 0 });
    }
  } else {
    // Last 12 months (monthly)
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
      chartMap.set(key, { label: d.toLocaleString('default', { month: 'short' }), revenue: 0, overdue: 0 });
    }
  }

  // 2. Populate data
  for (const inv of invoices) {
    const amount = Number(inv.total_amount) || 0;
    const isPaid = inv.status === 'paid';
    const isOverdue = !isPaid && inv.due_date && inv.due_date < today;

    if (!isPaid) {
      totalOutstanding += amount;
    }
    if (isOverdue) {
      overdueCount++;
    }
    if (isPaid && inv.created_at && inv.created_at >= firstOfMonth) {
      paidThisMonth += amount;
    }

    // Chart Data logic
    if (inv.created_at) {
       const cd = new Date(inv.created_at);
       let mKey = "";
       if (period === 'day') mKey = `${cd.getFullYear()}-${cd.getMonth()+1}-${cd.getDate()}-${cd.getHours()}`;
       else if (period === 'year') mKey = `${cd.getFullYear()}-${(cd.getMonth() + 1).toString().padStart(2, '0')}`;
       else mKey = `${cd.getFullYear()}-${cd.getMonth()+1}-${cd.getDate()}`;

       if (chartMap.has(mKey)) {
          const mData = chartMap.get(mKey);
          if (isPaid) mData.revenue += amount;
          if (isOverdue) mData.overdue += amount;
       }
    }
  }

  return {
    totalOutstanding: Math.round(totalOutstanding * 100) / 100,
    overdueCount,
    paidThisMonth: Math.round(paidThisMonth * 100) / 100,
    totalInvoices: count || 0,
    chartData: Array.from(chartMap.values()).map(d => ({
       ...d,
       revenue: Math.round(d.revenue * 100) / 100,
       overdue: Math.round(d.overdue * 100) / 100,
    }))
  };
}

