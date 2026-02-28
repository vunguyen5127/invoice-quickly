import { supabase } from "@/utils/supabase/client";
import { InvoiceState } from "@/types/invoice";

export async function getInvoiceById(id: string): Promise<InvoiceState | null> {
  if (!supabase) return null;
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  const { data, error } = await supabase
    .from("invoices")
    .select("data")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("Error fetching invoice:", error);
    return null;
  }

  // Handle parsing to InvoiceState based on the upcoming DB schema logic
  if (data.data) {
    return data.data as InvoiceState;
  }
  
  return null;
}
