import { supabase } from "@/utils/supabase/client";
import { InvoiceState } from "@/types/invoice";

export async function getInvoiceById(id: string): Promise<(InvoiceState & { _companyId?: string }) | null> {
  if (!supabase) return null;
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

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
    const invoiceState = data.data as InvoiceState;
    invoiceState.id = id;
    return { ...invoiceState, _companyId: data.company_id };
  }
  
  return null;
}
