"use client";

import React, { useEffect, useState, use } from "react";
import { getPublicQuote, acceptQuote, rejectQuote } from "@/utils/supabase/quotes-actions";
import { InvoicePreview } from "@/components/invoice-preview";
import { generatePDF } from "@/utils/generate-pdf";
import { Download, Loader2, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { InvoiceViewSkeleton } from "@/components/invoice-view-skeleton";
import { toast } from "sonner";

export default function ShareQuotePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [resolvedParams.id]);

  const fetchData = async () => {
    try {
      const data = await getPublicQuote(resolvedParams.id);
      if (data) {
        setQuote(data);
      }
    } catch (err) {
      console.error("Error fetching quote:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!quote) return;
    setIsGenerating(true);
    await generatePDF("invoice-capture-area", `Quote-${quote.quote_number}`);
    setIsGenerating(false);
  };

  const handleAccept = async () => {
    setIsActionLoading(true);
    const res = await acceptQuote(resolvedParams.id);
    if (res.success) {
      setQuote({ ...quote, status: 'accepted' });
    } else {
      toast.error("Failed to accept quote. Please try again.");
    }
    setIsActionLoading(false);
  };

  const handleReject = async () => {
    setIsActionLoading(true);
    const res = await rejectQuote(resolvedParams.id);
    if (res.success) {
      setQuote({ ...quote, status: 'rejected' });
    } else {
      toast.error("Failed to reject quote. Please try again.");
    }
    setIsActionLoading(false);
  };

  if (loading) {
    return <InvoiceViewSkeleton />;
  }

  if (!quote) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-xl">
        <h1 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">Quote Not Found</h1>
        <p className="text-zinc-500 mb-8">This quote either doesn't exist or has been deleted.</p>
        <Link 
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
        >
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-4 sm:px-8 py-8 max-w-5xl">
        
        {/* Banner if already actioned */}
        {quote.status === 'accepted' && (
           <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <p className="font-bold text-sm">This quote has been accepted. Thank you!</p>
           </div>
        )}
        {quote.status === 'rejected' && (
           <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl flex items-center gap-3">
              <XCircle className="w-5 h-5 text-red-600" />
              <p className="font-bold text-sm">This quote has been rejected.</p>
           </div>
        )}
        {quote.status === 'invoiced' && (
           <div className="mb-6 bg-purple-50 border border-purple-200 text-purple-800 px-4 py-3 rounded-xl flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-purple-600" />
              <p className="font-bold text-sm">This quote has been converted to an invoice.</p>
           </div>
        )}

        {/* Header / Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Quote #{quote.quote_number}
            </h1>
            <p className="text-sm text-zinc-500">From {quote.seller_info?.name?.split(',')[0]}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            
            {/* Action Buttons for Draft/Sent quotes */}
            {!['accepted', 'rejected', 'invoiced'].includes(quote.status) && (
              <div className="flex gap-2 w-full sm:w-auto">
                 <button
                    onClick={handleReject}
                    disabled={isActionLoading}
                    className="flex-1 sm:flex-none px-6 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 font-bold rounded-lg transition-colors disabled:opacity-50"
                 >
                    Reject
                 </button>
                 <button
                    onClick={handleAccept}
                    disabled={isActionLoading}
                    className="flex-1 sm:flex-none px-6 py-2.5 bg-emerald-500 text-white hover:bg-emerald-600 font-bold rounded-lg transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] disabled:opacity-50"
                 >
                    {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Accept Quote"}
                 </button>
              </div>
            )}

            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-white font-bold transition-all disabled:opacity-75"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Invoice Container */}
        <div className="rounded-2xl overflow-hidden shadow-sm border border-zinc-200 dark:border-zinc-800">
           <InvoicePreview invoice={quote.data || quote} docType="quote" />
        </div>
        
        {/* Promotional Footer */}
        <div className="text-center mt-12 mb-8">
          <p className="text-sm text-zinc-500 mb-3">Powered by</p>
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-lg tracking-tight hover:opacity-80 transition-opacity">
            <span className="text-blue-600">Invoice</span>
            <span className="text-zinc-900 dark:text-white">Quickly</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
