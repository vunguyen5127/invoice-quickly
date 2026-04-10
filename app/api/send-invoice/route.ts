import { getCurrencySymbol } from "@/types/invoice";
import config from "@/utils/config";
import { sendInvoiceToClient } from "@/utils/email-service";
import { getServerSupabase } from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

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
    const { invoiceId, to: toOverride, cc, subject, message } = body;

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
    
    // Use overridden `to` from modal if provided, otherwise fall back to invoice client email
    const clientEmail = toOverride?.trim() || (() => {
      let email = invoiceData?.client?.email || "";
      if (!email) {
        const parts = (invoiceData?.client?.name || "").split(/,|\n/);
        const emailPart = parts.find((p: string) => /\S+@\S+\.\S+/.test(p.trim()));
        email = emailPart?.trim() || "";
      }
      return email;
    })();

    if (!clientEmail) {
      return NextResponse.json({ error: "Client email is required" }, { status: 400 });
    }

    // Get company name for the From header
    const companyName = (invoiceData?.company?.name || "").split(/,|\n/)[0].trim() || "Business";
    const companyEmail = invoiceData?.company?.email || "";

    // Build the share URL
    const shareUrl = `${config.siteUrl}/share/${invoiceId}`;

    // Calculate total for display
    const currencySymbol = getCurrencySymbol(invoice.currency || "USD");
    const totalAmount = Number(invoice.total_amount || 0).toFixed(2);

    // Send the email
    const result = await sendInvoiceToClient({
      clientEmail,
      cc: cc?.trim() || undefined,
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
