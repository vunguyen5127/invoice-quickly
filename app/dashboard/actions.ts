"use server";

import { createClient } from "@supabase/supabase-js";

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
      logo_url, 
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
  } = {}
) {
  const supabase = getServerSupabase(token);
  const { page = 1, pageSize = 10, search = "", sortField = "created_at", sortDir = "desc" } = options;
  
  // Calculate range
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Build the base exact query for both count and data
  let queryBase = supabase
    .from("invoices")
    .select("id, invoice_number, client_name, created_at, total_amount, currency")
    .eq("company_id", companyId)
    .is("deleted_at", null);

  // Apply search filtering if provided
  if (search.trim()) {
    queryBase = queryBase.or(`invoice_number.ilike.%${search}%,client_name.ilike.%${search}%`);
  }

  // 1. Fire the count query
  const countPromise = supabase
    .from("invoices")
    .select("id", { count: "exact", head: true })
    .eq("company_id", companyId)
    .is("deleted_at", null)
    .then(async (res) => {
       if (search.trim()) {
         return await supabase
          .from("invoices")
          .select("id", { count: "exact", head: true })
          .eq("company_id", companyId)
          .is("deleted_at", null)
          .or(`invoice_number.ilike.%${search}%,client_name.ilike.%${search}%`);
       }
       return res;
    });

  // 2. Fire the data query
  const dataPromise = queryBase
    .order(sortField, { ascending: sortDir === "asc" })
    .range(from, to);

  // Await both simultaneously
  const [countResult, dataResult] = await Promise.all([countPromise, dataPromise]);

  if (dataResult.error) {
    console.error("Error fetching company invoices:", dataResult.error);
    return { data: [], totalCount: 0 };
  }

  return { 
    data: dataResult.data || [], 
    totalCount: countResult.count || 0 
  };
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


