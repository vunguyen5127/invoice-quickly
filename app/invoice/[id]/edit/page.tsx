"use client";

import React, { useState, useEffect } from "react";
import { InvoiceForm } from "@/components/invoice-form";
import { InvoicePreview } from "@/components/invoice-preview";
import { InvoiceState, initialInvoiceState } from "@/types/invoice";
import { generatePDF } from "@/utils/generate-pdf";
import { Download, Save, Loader2, Receipt, Printer, ChevronRight, Share2 } from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { getInvoiceById } from "../actions";
import { updateInvoiceInSupabase } from "@/utils/supabase/actions";
import Link from "next/link";
import { use } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuthButton } from "@/components/auth-button";
import { useLanguage } from "@/contexts/language-context";

export default function EditInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { t } = useLanguage();
  const resolvedParams = use(params);
  const [invoice, setInvoice] = useState<InvoiceState>(initialInvoiceState);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadInvoice = async () => {
      if (!supabase) return;
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login?redirect=/dashboard");
        return;
      }

      const data = await getInvoiceById(session.access_token, resolvedParams.id);
      if (!data) {
        alert("Invoice not found");
        router.push("/dashboard");
        return;
      }

      const { _companyId, ...invoiceData } = data;
      setCompanyId(_companyId || null);
      setInvoice(invoiceData as InvoiceState);
      setLoading(false);
    };

    loadInvoice();
  }, [router, resolvedParams.id]);

  const handleDownload = async () => {
    setIsGenerating(true);
    await generatePDF("invoice-capture-area", `Invoice-${invoice.details.invoiceNumber}`);
    setIsGenerating(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/share/${resolvedParams.id}`;
      
      if (navigator.share) {
        await navigator.share({
          title: `Invoice #${invoice?.details.invoiceNumber}`,
          text: 'Here is my invoice.',
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing", err);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    const { data: { session } } = await supabase?.auth.getSession() || { data: { session: null } };
    
    if (!session) {
      setIsSaving(false);
      router.push("/login?redirect=/dashboard");
      return;
    }

    try {
      const { data: { session } } = await supabase?.auth.getSession() || { data: { session: null }};
      if (!session) throw new Error("No session");
      await updateInvoiceInSupabase(session.access_token, resolvedParams.id, invoice);
      if (companyId) {
        router.push(`/company/${companyId}`);
      } else {
        router.push("/dashboard");
      }
    } catch (e: any) {
      alert("Error saving invoice. Please check your config.");
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
     return (
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950">
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-8 max-w-[1600px] mx-auto">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl tracking-tight text-zinc-800 dark:text-zinc-100 transition-opacity hover:opacity-80">
            <img src="/logo.png" alt="InvoiceQuickly Logo" className="h-8 w-8 object-contain" />
            <span className="hidden sm:inline-block">InvoiceQuickly</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-2 sm:gap-3 mr-2">
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-sm shadow-sm bg-emerald-600 text-white hover:bg-emerald-700 transition-all disabled:opacity-75"
              >
                <Save className="w-4 h-4" /> <span className="hidden lg:inline">{isSaving ? t.saving : t.save}</span>
              </button>
              <button 
                onClick={handleDownload}
                disabled={isGenerating}
                className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-sm shadow-sm bg-blue-600 text-white hover:bg-blue-700 transition-all disabled:opacity-75"
              >
                <Download className="w-4 h-4" /> <span className="hidden lg:inline">{isGenerating ? t.wait : t.download}</span>
              </button>
            </div>
            <ThemeToggle />
            <AuthButton />
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8 max-w-[1600px] flex-1">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm mb-6">
          <Link href="/dashboard" className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
            {t.dashboard}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-600" />
          {companyId && (
            <>
              <Link href={`/company/${companyId}`} className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors truncate max-w-[160px]">
                {invoice.company.name || t.company}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-600" />
            </>
          )}
          <span className="text-zinc-700 dark:text-zinc-200 font-medium">Edit #{invoice.details.invoiceNumber}</span>
        </nav>

        <div className="flex flex-col xl:flex-row gap-8 pb-32 xl:pb-20">
          
          {/* Left Column: Form */}
          <div className="w-full xl:w-1/2 flex flex-col gap-6">
            <div className="flex items-center justify-between h-10">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-none">Edit Invoice</h2>
            </div>
            <div className="bg-white dark:bg-zinc-900/50 rounded-[5px] shadow-sm border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 lg:p-8 mt-[3px]">
              <InvoiceForm invoice={invoice} setInvoice={setInvoice} />
            </div>
          </div>

        {/* Right Column: Preview */}
        <div className="w-full xl:w-1/2 flex flex-col gap-6">
          <div className="flex items-center justify-between h-10">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-none">{t.livePreview}</h2>
          </div>
          
          <div className="xl:sticky xl:top-24 mt-4 xl:mt-0 w-full">
            <div className="w-full overflow-x-auto bg-zinc-50 dark:bg-zinc-950 rounded-[5px] p-px flex justify-center [background-image:radial-gradient(rgba(212,212,216,0.3)_1px,transparent_1px)] [background-size:16px_16px] dark:[background-image:radial-gradient(rgba(39,39,42,0.3)_1px,transparent_1px)]">
              <div className="transform origin-top scale-[0.6] sm:scale-75 lg:scale-90 xl:scale-100 transition-transform">
                <InvoicePreview invoice={invoice} isLoggedIn={true} />
              </div>
            </div>
          </div>
        </div>

        </div>

        {/* Mobile bottom bar */}
        <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 p-4 flex gap-2 z-50">
          <button
            onClick={handleShare}
            aria-label="Share"
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg font-medium text-sm bg-white border border-zinc-200 text-zinc-700 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 transition-all shadow-sm"
          >
            <Share2 className="w-4 h-4" /> {t.share}
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg font-medium text-sm bg-emerald-600 text-white hover:bg-emerald-700 transition-all disabled:opacity-75"
          >
            <Save className="w-4 h-4" /> {isSaving ? t.saving : t.save}
          </button>
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg font-medium text-sm bg-blue-600 text-white hover:bg-blue-700 transition-all disabled:opacity-75"
          >
            <Download className="w-4 h-4" /> {isGenerating ? t.wait : t.download}
          </button>
        </div>
      </div>
    </div>
  );
}
