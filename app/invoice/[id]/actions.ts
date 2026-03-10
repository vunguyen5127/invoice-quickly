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

export async function getInvoiceById(token: string, id: string): Promise<(InvoiceState & { _companyId?: string }) | null> {
  const supabase = getServerSupabase(token);
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("invoices")
    .select("data, company_id")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("Error fetching invoice:", error);
    return null;
  }

  if (data.data) {
    const invoiceState = data.data as unknown as InvoiceState;
    invoiceState.id = id;
    return { ...invoiceState, _companyId: data.company_id };
  }
  
  return null;
}
