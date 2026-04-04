"use server";

import config from "@/utils/config";
import { createClient } from "@supabase/supabase-js";

export async function getPublicInvoiceById(id: string) {
  // Use anon client so Supabase RLS applies.
  // The RLS policy "Public can view invoice by ID" only allows non-draft,
  // non-deleted invoices — draft invoices are NOT exposed via share links.
  const { url, anonKey } = config.supabase;
  if (!url || !anonKey) throw new Error("Missing Supabase env");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient(url, anonKey) as any;

  const { data, error } = await supabase
    .from("invoices")
    .select("data")
    .eq("id", id)
    .neq("status", "draft")    // explicit guard: never expose draft invoices
    .is("deleted_at", null)    // do not expose soft-deleted invoices
    .single();

  if (error || !data) {
    return null;
  }

  if (data.data) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.data as any;
  }

  return null;
}
