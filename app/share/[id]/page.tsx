"use client";

import React, { useEffect, useState } from "react";
import { getPublicInvoiceById } from "./actions";
import { InvoicePreview } from "@/components/invoice-preview";
import { generatePDF } from "@/utils/generate-pdf";
import { InvoiceState } from "@/types/invoice";
import { Download, Loader2 } from "lucide-react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export default function ShareInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const [invoice, setInvoice] = useState<InvoiceState | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { id } = await params;
        const data = await getPublicInvoiceById(id);
        
        if (data) {
          setInvoice(data);
        }
      } catch (err) {
        console.error("Error fetching invoice:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params]);

  const handleDownload = async () => {
    if (!invoice) return;
    setIsGenerating(true);
    await generatePDF("invoice-capture-area", `Invoice-${invoice.details.invoiceNumber}`);
    setIsGenerating(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-xl">
        <h1 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">Invoice Not Found</h1>
        <p className="text-zinc-500 mb-8">This invoice either doesn't exist or has been deleted.</p>
        <Link 
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
        >
          Create Your Own Invoice
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Simplified Header / Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Invoice #{invoice.details.invoiceNumber}
            </h1>
            <p className="text-sm text-zinc-500">From {invoice.company.name}</p>
          </div>

          <div className="flex w-full sm:w-auto">
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors disabled:opacity-75 shadow-sm"
            >
              <Download className="w-4 h-4" /> <span>{isGenerating ? "Generating..." : "Download PDF"}</span>
            </button>
          </div>
        </div>

        {/* Invoice Container */}
        <div className="w-full overflow-x-auto rounded-2xl shadow-xl ring-1 ring-zinc-900/5 dark:ring-white/10 dark:shadow-none bg-zinc-200/50 dark:bg-zinc-900/80 p-2 sm:p-8 flex justify-center">
          <div className="transform origin-top transition-transform scale-[0.6] sm:scale-75 md:scale-90 lg:scale-100">
            {/* We pass a forced dummy language translation to preview safely if needed, but it should inherit from context */}
            <InvoicePreview invoice={invoice} />
          </div>
        </div>
        
        {/* Promotional Footer */}
        <div className="text-center mt-12 mb-8">
          <p className="text-sm text-zinc-500 mb-3">Powered by</p>
          <Link href="/" className="inline-flex items-center gap-2 font-black text-xl tracking-tighter hover:opacity-80 transition-opacity">
            <span className="text-blue-600">Invoice</span>
            <span className="text-zinc-900 dark:text-white">Quickly</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
