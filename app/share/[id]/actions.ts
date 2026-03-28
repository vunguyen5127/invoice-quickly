"use server";

import { getServiceSupabase } from "@/utils/supabase/client";

export async function getPublicInvoiceById(id: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = getServiceSupabase() as any;

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
