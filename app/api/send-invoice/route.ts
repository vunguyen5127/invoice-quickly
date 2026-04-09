import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/utils/supabase/client";
import { sendInvoiceToClient } from "@/utils/email-service";
import config from "@/utils/config";
import { getCurrencySymbol } from "@/types/invoice";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getServerSupabase(token);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { invoiceId, subject, message } = body;

    if (!invoiceId || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Fetch invoice with ownership guard
    const { data: invoice, error: fetchError } = await supabase
      .from("invoices")
      .select("id, data, status, due_date, invoice_number, total_amount, currency, company_id")
      .eq("id", invoiceId)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const invoiceData = invoice.data as any;
    
    // Extract client email: try client.email first, then scan client.name for email pattern
    let clientEmail = invoiceData?.client?.email || "";
    if (!clientEmail) {
      const parts = (invoiceData?.client?.name || "").split(/,|\n/);
      const emailPart = parts.find((p: string) => /\S+@\S+\.\S+/.test(p.trim()));
      clientEmail = emailPart?.trim() || "";
    }

    if (!clientEmail) {
      return NextResponse.json({ error: "Client email is required" }, { status: 400 });
    }

    // Get company name for the From header
    const companyName = (invoiceData?.company?.name || "").split(/,|\n/)[0].trim() || "Business";
    let companyEmail = invoiceData?.company?.email || "";
    if (!companyEmail) {
      const compParts = (invoiceData?.company?.name || "").split(/,|\n/);
      const compEmailPart = compParts.find((p: string) => /\S+@\S+\.\S+/.test(p.trim()));
      companyEmail = compEmailPart?.trim() || "";
    }

    // Build the share URL
    const shareUrl = `${config.siteUrl}/share/${invoiceId}`;

    // Calculate total for display
    const currencySymbol = getCurrencySymbol(invoice.currency || "USD");
    const totalAmount = Number(invoice.total_amount || 0).toFixed(2);

    // Send the email
    const result = await sendInvoiceToClient({
      clientEmail,
      companyName,
      companyEmail,
      invoiceNumber: invoice.invoice_number || invoiceData?.details?.invoiceNumber || "N/A",
      totalAmount,
      currency: currencySymbol,
      dueDate: invoice.due_date || undefined,
      shareUrl,
      subject,
      message,
    });

    if (!result.success) {
      console.error("[send-invoice] Email send failed:", result.error);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    // Update invoice status to 'sent' (only if currently draft)
    if (invoice.status === "draft") {
      await supabase
        .from("invoices")
        .update({ status: "sent" })
        .eq("id", invoiceId)
        .eq("user_id", user.id);
    }

    return NextResponse.json({ success: true, messageId: result.messageId });
  } catch (error) {
    console.error("[send-invoice] Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
