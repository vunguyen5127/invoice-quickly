"use client";

import React, { useState, useEffect, use, useRef } from "react";
import { useRouter } from "next/navigation";
import { InvoiceForm } from "@/components/invoice-form";
import { initialQuoteState, QuoteState } from "@/types/quote";
import { createQuote, updateQuote, getQuote, convertQuoteToInvoice, getNextQuoteNumber } from "@/utils/supabase/quotes-actions";
import { supabase } from "@/utils/supabase/client";
import { Save, Share, ArrowRight, Loader2, ChevronRight } from "lucide-react";
import { InvoicePreview } from "@/components/invoice-preview";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuthButton } from "@/components/auth-button";
import { InvoiceEditSkeleton } from "@/components/invoice-edit-skeleton";
import { UpgradeModal } from "@/components/upgrade-modal";
import { useData } from "@/contexts/data-context";
import { toast } from "sonner";

export default function QuoteEditor({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === "new";
  const [quote, setQuote] = useState<any>(initialQuoteState);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [converting, setConverting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [upgradeTrigger, setUpgradeTrigger] = useState<"company_limit" | "invoice_limit" | "recurring" | "no_ads" | "csv_export" | "general">("general");
  
  const { companies: myCompanies, loadingData } = useData();
  const initRef = useRef(false);

  useEffect(() => {
    if (loadingData) return;
    if (initRef.current) return;
    initRef.current = true;

    const initQuote = async () => {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!isNew) {
        if (session) {
          const data = await getQuote(session.access_token, resolvedParams.id);
          if (data && data.data) {
            setQuote({ ...data.data, id: data.id, status: data.status, invoice_id: data.invoice_id });
            if (data.company_id) setCompanyId(data.company_id);
          }
        }
      } else {
        const urlParams = new URLSearchParams(window.location.search);
        let targetCompId = urlParams.get('company');

        let draftQuote = initialQuoteState;
        
        if (session) {
          try {
            const comps = myCompanies || [];
            
            if (!targetCompId && comps.length === 1) {
               targetCompId = comps[0].id;
            }

            if (targetCompId && comps.length > 0) {
               const autoCompany = comps.find((c: any) => c.id === targetCompId);
               if (autoCompany) {
                 setCompanyId(autoCompany.id);

                 let companyData = { name: "", email: "", address: "", phone: "", logo: "" };
                 const tmpDetails = [];
                 if (autoCompany.name) tmpDetails.push(autoCompany.name);
                 if (autoCompany.address) tmpDetails.push(autoCompany.address);
                 if (autoCompany.email) tmpDetails.push(autoCompany.email);
                 if (autoCompany.phone) tmpDetails.push(autoCompany.phone);
                 
                 companyData = {
                   ...companyData,
                   name: tmpDetails.join(", "),
                   logo: autoCompany.logo_url || "",
                 };

                 const taxRate = autoCompany.default_tax !== null && autoCompany.default_tax !== undefined ? autoCompany.default_tax : 0;
                 const discount = autoCompany.default_discount !== null && autoCompany.default_discount !== undefined ? autoCompany.default_discount : 0;

                 draftQuote = {
                   ...draftQuote,
                   company: companyData,
                   signatureName: autoCompany.signer_name || "",
                   signature: autoCompany.signature_url || "",
                   currency: autoCompany.default_currency || initialQuoteState.currency,
                   notes: autoCompany.default_notes || initialQuoteState.notes,
                   terms: autoCompany.default_terms || initialQuoteState.terms,
                   taxRate,
                   discount
                 };

                 // Async fetch next number non-blockingly
                 getNextQuoteNumber(session.access_token, autoCompany.id).then((num: string) => {
                    setQuote((prev: any) => ({
                      ...prev,
                      details: { ...prev.details, quoteNumber: num }
                    }));
                 }).catch(console.error);
               }
            }
          } catch(e) {
            console.error("Failed to prepopulate quote company", e);
          }
        }
        setQuote(draftQuote);
      }
      
      setLoading(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsMounted(true));
      });
    };

    initQuote();
  }, [resolvedParams.id, isNew, loadingData, myCompanies]);

  const handleSave = async () => {
    if (!companyId) {
      toast.error("Vui lòng chọn Công ty ở form bên dưới trước khi lưu Báo giá!");
      return;
    }

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
      companyId: companyId
    };

    let res;
    if (isNew) {
      res = await createQuote(session.access_token, payload);
    } else {
      res = await updateQuote(session.access_token, resolvedParams.id, payload);
    }

    setSaving(false);
    if (!res.success) {
      if (res.error === "INVOICE_LIMIT_REACHED") {
        setUpgradeTrigger("invoice_limit");
        setIsUpgradeModalOpen(true);
        return;
      }
      toast.error("Error saving quote: " + (res.error || "Unknown error"));
      console.error(res);
      return;
    }

    if (isNew) {
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
        router.push(`/invoice/${res.invoiceId}/edit`);
      } else if (res.error === "CONVERT_QUOTE_LIMIT_REACHED") {
        toast.error("The '1-Click Convert to Invoice' feature is only available on the Pro plan. Please upgrade to use this feature.");
      } else if (res.invoiceId) {
        router.push(`/invoice/${res.invoiceId}/edit`); // was already invoiced
      } else {
        toast.error(res.error || "Failed to convert quote");
      }
    }
    setConverting(false);
  };

  const handleShare = async () => {
    try {
      // If it is a new quote that was just saved and we are now on QuoteEditor, we can use quote.id
      // but if the URL is updated, resolvedParams.id is the actual ID.
      const shareUrl = `${window.location.origin}/share/quote/${quote.id || resolvedParams.id}`;
      
      if (navigator.share) {
        await navigator.share({
          title: `Quote #${quote?.details?.quoteNumber || ''}`,
          text: 'Here is my quote.',
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard! You can now send it to your client.");
      }
    } catch (err) {
      console.error("Error sharing", err);
    }
  };

  if (loading) return <InvoiceEditSkeleton />;

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 pb-20">
      
      {/* Custom sticky site header identical to other editors */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl">
        <div className="container flex h-14 items-center justify-between px-4 sm:px-8 max-w-[1600px] mx-auto">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg tracking-tight text-zinc-900 dark:text-zinc-100 transition-opacity hover:opacity-80">
            <Image src="/logo.svg" alt="Invoice-Quickly Logo" width={28} height={28} className="h-7 w-7 object-contain" />
            <span className="inline-block">Invoice-Quickly</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 mr-2">
              {!isNew && quote.status === 'accepted' && (
                <button
                  onClick={handleConvertToInvoice}
                  disabled={converting}
                  className="flex items-center gap-2 px-4 h-10 rounded-xl font-semibold text-sm shadow-sm bg-purple-600 text-white hover:opacity-90 transition-all disabled:opacity-75"
                >
                  {converting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                  <span className="hidden lg:inline">Convert to Invoice</span>
                </button>
              )}
              
              {!isNew && (
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 h-10 rounded-xl font-semibold text-sm shadow-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:opacity-90 transition-all"
                >
                  <Share className="w-4 h-4" /> <span className="hidden lg:inline">Share</span>
                </button>
              )}
              
              <button 
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 h-10 rounded-xl font-semibold text-sm shadow-sm bg-blue-600 text-white hover:opacity-90 transition-all disabled:opacity-75 shadow-blue-600/20"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
                <span className="hidden lg:inline">{saving ? 'Saving...' : 'Save Quote'}</span>
              </button>
            </div>
            <ThemeToggle />
            <AuthButton />
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-1.5 text-sm mb-6">
          <Link href="/dashboard/quotes" className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors shrink-0">
            Quotes
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-600 shrink-0" />
          <span className="text-zinc-700 dark:text-zinc-200 font-medium truncate max-w-[120px] sm:max-w-[160px]">
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

        {quote.status === 'invoiced' && (
          <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800/30 rounded-2xl flex items-center justify-between">
            <p className="text-sm font-bold text-purple-800 dark:text-purple-300">
              🎉 This quote was successfully converted to an invoice.
            </p>
            <button onClick={() => router.push(`/invoice/${quote.invoice_id}/edit`)} className="text-sm font-bold text-purple-600 dark:text-purple-400 hover:underline">
               Edit Invoice →
            </button>
          </div>
        )}

        <div className="flex flex-col xl:flex-row xl:items-start gap-8 pb-32 xl:pb-20">
          
          {/* Left Column: Form */}
          <div className="w-full flex-1 flex flex-col gap-6 overflow-hidden animate-in fade-in duration-700">
            <div className="flex items-center justify-between h-10">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-none">Editor</h2>
            </div>
            <div className="bg-white dark:bg-zinc-900/50 rounded-[5px] shadow-sm border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 lg:p-8 mt-[3px]">
              <InvoiceForm 
                invoice={quote} 
                setInvoice={setQuote}
                docType="quote"
                defaultCompanyId={companyId || undefined}
                onCompanySelect={(id) => setCompanyId(id)}
              />
            </div>
          </div>
          
          {/* Right Column: Preview */}
          <div className="w-full flex-1 xl:sticky xl:top-24 overflow-hidden animate-in fade-in duration-700 delay-150 fill-mode-both">
            <div className="h-10 flex items-center mb-6">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-none">Live Preview</h2>
            </div>
            <div className="rounded-[5px] overflow-hidden mt-1 shadow-xl ring-1 ring-black/5 dark:ring-white/10">
              <InvoicePreview invoice={quote} isLoggedIn={true} docType="quote" />
            </div>
          </div>
        </div>

        {/* Mobile bottom bar */}
        <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 p-3 px-4 flex gap-2 z-50 pb-safe shadow-[0_-2px_16px_rgba(0,0,0,0.06)]">
          {!isNew && quote.status === 'accepted' && (
            <button
              onClick={handleConvertToInvoice}
              disabled={converting}
              className="flex-1 flex items-center justify-center gap-1.5 px-2 py-3 rounded-xl font-bold text-xs bg-purple-600 text-white hover:bg-purple-700 transition-all disabled:opacity-75 shadow-lg shadow-purple-600/20"
            >
              {converting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              Convert
            </button>
          )}
          
          {!isNew && (
            <button
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-1.5 px-2 py-3 rounded-xl font-bold text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 transition-all hover:bg-zinc-200 dark:hover:bg-zinc-700 shadow-sm"
            >
              <Share className="w-4 h-4" /> Share
            </button>
          )}
          
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-1.5 px-2 py-3 rounded-xl font-bold text-xs bg-blue-600 text-white hover:bg-blue-700 transition-all disabled:opacity-75 shadow-lg shadow-blue-600/20"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        trigger={upgradeTrigger}
      />
    </div>
  );
}
