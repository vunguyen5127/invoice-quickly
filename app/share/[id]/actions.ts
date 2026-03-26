"use server";

import { createClient } from "@supabase/supabase-js";

export async function getPublicInvoiceById(id: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !serviceRoleKey) {
    console.error("Missing SUPABASE_SERVICE_ROLE_KEY for public invoice action");
    return null;
  }

  const supabase = createClient(url, serviceRoleKey);

  const { data, error } = await supabase
    .from("invoices")
    .select("data")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("Error fetching public invoice:", error);
    return null;
  }

  if (data.data) {
    return data.data as any; // The full invoice state
  }

  return null;
}
