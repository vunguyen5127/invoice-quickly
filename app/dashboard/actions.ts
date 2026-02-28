import { supabase } from "@/utils/supabase/client";

export async function getUserCompanies() {
  if (!supabase) return [];
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return [];

  // Get companies and sum of their invoices if possible, or just raw companies for now
  const { data, error } = await supabase
    .from("companies")
    .select(`
      *,
      invoices (id, total_amount)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching companies:", error);
    return [];
  }

  return data;
}

export async function createCompany(companyData: { name: string; email: string; address: string }) {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  const { data, error } = await supabase
    .from("companies")
    .insert([{
      user_id: session.user.id,
      name: companyData.name,
      email: companyData.email,
      address: companyData.address
    }])
    .select()
    .single();

  if (error) {
    console.error("Error creating company:", error);
    return null;
  }
  return data;
}

export async function updateCompany(companyId: string, companyData: { name: string; email: string; address: string }) {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  const { data, error } = await supabase
    .from("companies")
    .update({
      name: companyData.name,
      email: companyData.email,
      address: companyData.address
    })
    .eq("id", companyId)
    .eq("user_id", session.user.id) // Ensure user owns the company
    .select()
    .single();

  if (error) {
    console.error("Error updating company:", error);
    return null;
  }
  return data;
}

export async function deleteCompany(id: string) {
  if (!supabase) return false;
  
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

export async function getCompanyInvoices(companyId: string) {
  if (!supabase) return [];
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return [];

  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching company invoices:", error);
    return [];
  }

  return data;
}

export async function getCompanyById(companyId: string) {
  if (!supabase) return null;
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
export async function deleteInvoice(id: string) {
  if (!supabase) return false;
  
  const { error } = await supabase
    .from("invoices")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting invoice:", error);
    return false;
  }
  return true;
}
