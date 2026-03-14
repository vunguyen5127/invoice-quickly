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

export async function getUserCompanies(token: string) {
  const supabase = getServerSupabase(token);
  
  // Fetch companies for the user
  const { data: companies, error: compError } = await supabase
    .from("companies")
    .select("id, name, email, logo_url, created_at")
    .order("created_at", { ascending: false });

  if (compError) {
    console.error("Error fetching companies:", compError);
    return [];
  }

  if (!companies || companies.length === 0) return [];

  // Fetch only the company_id for all non-deleted invoices belonging to these companies
  // This is much faster than joining full invoice rows
  const companyIds = companies.map(c => c.id);
  const { data: invoices, error: invError } = await supabase
    .from("invoices")
    .select("company_id")
    .in("company_id", companyIds)
    .is("deleted_at", null);

  if (invError) {
    console.error("Error fetching invoice counts:", invError);
    // Continue with companies but zero counts
    return companies.map(c => ({ ...c, invoices: [] }));
  }

  // Group counts by company_id
  const countMap = (invoices || []).reduce((acc: Record<string, number>, curr) => {
    acc[curr.company_id] = (acc[curr.company_id] || 0) + 1;
    return acc;
  }, {});

  // Return companies with a mocked invoices array length for compatibility
  return companies.map(c => ({
    ...c,
    invoices: new Array(countMap[c.id] || 0).fill(null)
  }));
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

export async function getCompanyInvoices(token: string, companyId: string) {
  const supabase = getServerSupabase(token);
  // RLS handles authorization based on the Bearer token
  const { data, error } = await supabase
    .from("invoices")
    .select("id, invoice_number, client_name, created_at, total_amount, currency")
    .eq("company_id", companyId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching company invoices:", error);
    return [];
  }

  return data;
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


