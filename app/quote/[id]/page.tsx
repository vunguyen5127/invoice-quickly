"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { InvoiceForm } from "@/components/invoice-form";
import { initialQuoteState, QuoteState } from "@/types/quote";
import { createQuote, updateQuote, getQuote, convertQuoteToInvoice } from "@/app/dashboard/quotes/actions";
import { supabase } from "@/utils/supabase/client";
import { Save, Share, ArrowRight, Loader2, ChevronRight } from "lucide-react";
import { InvoicePreview } from "@/components/invoice-preview";
import Link from "next/link";
import { InvoiceEditSkeleton } from "@/components/invoice-edit-skeleton";

export default function QuoteEditor({ params }: { params: { id: string } }) {
  const router = useRouter();
  const isNew = params.id === "new";
  const [quote, setQuote] = useState<any>(initialQuoteState);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [converting, setConverting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsMounted(true));
    });
    if (!isNew) {
      fetchQuote();
    } else {
      // Auto-fill company if passed via query params (using searchParams hook normally, 
      // but keeping it simple for now)
      const urlParams = new URLSearchParams(window.location.search);
      const companyId = urlParams.get('company');
      if (companyId) {
         // Logic to prefill would run in InvoiceForm itself
      }
    }
  }, [params.id]);

  const fetchQuote = async () => {
    if (!supabase) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const data = await getQuote(session.access_token, params.id);
      if (data && data.data) {
        setQuote({ ...data.data, id: data.id, status: data.status, invoice_id: data.invoice_id });
      }
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    if (!supabase) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Calculate totals
    const subtotal = quote.items.reduce((sum: number, item: any) => sum + (item.quantity * item.rate), 0);
    const discountAmount = quote.discountType === 'percentage' ? subtotal * (quote.discount / 100) : quote.discount;
    const amountAfterDiscount = subtotal - discountAmount;
    const taxAmount = quote.taxType === 'percentage' ? amountAfterDiscount * (quote.taxRate / 100) : quote.taxRate;
    const totalAmount = amountAfterDiscount + taxAmount + (quote.shipping || 0);

    const payload = {
      ...quote,
      subtotal,
      totalAmount,
    };

    let res;
    if (isNew) {
      res = await createQuote(session.access_token, payload);
    } else {
      res = await updateQuote(session.access_token, params.id, payload);
    }

    setSaving(false);
    if (res.success && isNew) {
      router.push(`/quote/${res.id}`);
    }
  };

  const handleConvertToInvoice = async () => {
    if (!quote.id) return;
    setConverting(true);
    if (!supabase) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const res = await convertQuoteToInvoice(session.access_token, quote.id);
      if (res.success && res.invoiceId) {
        router.push(`/invoice/${res.invoiceId}`);
      } else if (res.invoiceId) {
        router.push(`/invoice/${res.invoiceId}`); // was already invoiced
      }
    }
    setConverting(false);
  };

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/share/quote/${params.id}`;
      
      if (navigator.share) {
        await navigator.share({
          title: `Quote #${quote?.details?.quoteNumber || ''}`,
          text: 'Here is my quote.',
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard! You can now send it to your client.");
      }
    } catch (err) {
      console.error("Error sharing", err);
    }
  };

  if (loading) return <InvoiceEditSkeleton />;

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 pb-20">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        
        {/* Breadcrumb / Header toolbar */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 mb-8 flex flex-col xl:flex-row items-center justify-between gap-4 shadow-sm sticky top-4 z-40">
           <nav className="flex items-center gap-1.5 text-sm font-medium w-full xl:w-auto">
             <Link href="/dashboard/quotes" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
               Quotes
             </Link>
             <ChevronRight className="w-4 h-4 text-zinc-400" />
             <span className="text-zinc-900 dark:text-white">
               {isNew ? 'New Quote' : `Quote ${quote.details?.quoteNumber || ''}`}
             </span>
             {!isNew && (
               <span className={`ml-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  quote.status === 'accepted' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                  quote.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                  quote.status === 'invoiced' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                  'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
               }`}>
                 {quote.status || 'Draft'}
               </span>
             )}
           </nav>

           <div className="flex items-center gap-2 lg:gap-3 w-full xl:w-auto justify-end">
              {!isNew && quote.status === 'accepted' && (
                <button
                  onClick={handleConvertToInvoice}
                  disabled={converting}
                  className="flex-1 sm:flex-none px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {converting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                  Convert to Invoice
                </button>
              )}
              
              {!isNew && (
                <button
                  onClick={handleShare}
                  className="px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white text-sm font-bold rounded-xl flex items-center gap-2 shadow-sm"
                >
                  <Share className="w-4 h-4" /> Share
                </button>
              )}
              
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 sm:flex-none px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Saving...' : 'Save Quote'}
              </button>
           </div>
        </div>

        {quote.status === 'invoiced' && (
          <div className="mb-8 p-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800/30 rounded-2xl flex items-center justify-between">
            <p className="text-sm font-bold text-purple-800 dark:text-purple-300">
              🎉 This quote was successfully converted to an invoice.
            </p>
            <button onClick={() => router.push(`/invoice/${quote.invoice_id}`)} className="text-sm font-bold text-purple-600 dark:text-purple-400 hover:underline">
               View Invoice →
            </button>
          </div>
        )}

        <div className="flex flex-col xl:flex-row xl:items-start gap-8 pb-32 xl:pb-20">
          
          {/* Left Column: Form */}
          <div
            className="w-full flex-1 flex flex-col gap-6 overflow-hidden"
            style={{
              width: isMounted ? '100%' : '0%',
              opacity: isMounted ? 1 : 0,
              transition: 'width 600ms cubic-bezier(0.4, 0, 0.2, 1), opacity 400ms ease',
            }}
          >
            <div className="flex items-center justify-between h-10">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-none">Editor</h2>
            </div>
            <div className="bg-white dark:bg-zinc-900/50 rounded-[5px] shadow-sm border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 lg:p-8 mt-[3px]">
              <InvoiceForm 
                invoice={quote} 
                setInvoice={setQuote}
                docType="quote"
              />
            </div>
          </div>
          
          {/* Right Column: Preview */}
          <div
            className="w-full flex-1 xl:sticky xl:top-24 overflow-hidden"
            style={{
              width: isMounted ? '100%' : '0%',
              opacity: isMounted ? 1 : 0,
              transition: 'width 600ms cubic-bezier(0.4, 0, 0.2, 1) 100ms, opacity 400ms ease 150ms',
            }}
          >
            <div className="h-10 flex items-center mb-6">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-none">Live Preview</h2>
            </div>
            <div className="rounded-[5px] overflow-hidden mt-1 shadow-xl ring-1 ring-black/5 dark:ring-white/10">
              <InvoicePreview invoice={quote} isLoggedIn={true} docType="quote" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
