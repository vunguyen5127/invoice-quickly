"use client";

import React, { useState, useEffect } from "react";
import { InvoiceForm } from "@/components/invoice-form";
import { InvoicePreview } from "@/components/invoice-preview";
import { initialInvoiceState, InvoiceState } from "@/types/invoice";
import { generatePDF } from "@/utils/generate-pdf";
import { Download, Save, ArrowLeft, Loader2, Receipt } from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { getCompanyById } from "@/app/dashboard/actions";
import { saveInvoiceToSupabase } from "@/utils/supabase/actions";
import Link from "next/link";
import { use } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuthButton } from "@/components/auth-button";

export default function CreateCompanyInvoice({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [invoice, setInvoice] = useState<InvoiceState>(initialInvoiceState);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [companyName, setCompanyName] = useState("");
  const router = useRouter();

  // Load company data on mount and pre-fill the invoice state
  useEffect(() => {
    const loadCompanyAndSetInvoice = async () => {
      if (!supabase) return;
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login?redirect=/dashboard");
        return;
      }

      const companyData = await getCompanyById(resolvedParams.id);
      if (!companyData) {
        alert("Company not found");
        router.push("/dashboard");
        return;
      }
      setCompanyName(companyData.name);

      // Try to get user info for signatureName
      let defaultSignatureName = "";
      if (session?.user) {
        defaultSignatureName = session.user.user_metadata?.name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || "";
      }

      // Pre-fill the invoice seller info with the company's data
      setInvoice((prev) => ({
        ...prev,
        company: {
          name: companyData.name || "",
          address: companyData.address || "",
          email: companyData.email || "",
          phone: prev.company.phone || "", // Phone is not in the Company schema yet, keep prev
          logo: companyData.logo_url || prev.company.logo, // Ensure logo is fetched!
        },
        signatureName: prev.signatureName || defaultSignatureName
      }));

      setLoading(false);
    };

    loadCompanyAndSetInvoice();
  }, [router, resolvedParams.id]);

  const handleDownload = async () => {
    setIsGenerating(true);
    await generatePDF("invoice-capture-area", `Invoice-${invoice.details.invoiceNumber}`);
    setIsGenerating(false);
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
      await saveInvoiceToSupabase(invoice, resolvedParams.id);
      router.push(`/company/${resolvedParams.id}`);
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
            <Receipt className="h-6 w-6 text-blue-600 dark:text-blue-500" />
            <span className="hidden sm:inline-block">InvoiceQuickly</span>
            {companyName && <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 ml-1 truncate max-w-[120px]">{companyName}</span>}
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-sm shadow-sm bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-colors disabled:opacity-75"
            >
              <Save className="w-4 h-4" /> <span>{isSaving ? "Saving..." : "Save"}</span>
            </button>
            <button 
              onClick={handleDownload}
              disabled={isGenerating}
              className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-sm shadow-sm bg-blue-600 text-white hover:bg-blue-700 transition-all disabled:opacity-75"
            >
              <Download className="w-4 h-4" /> <span>{isGenerating ? "Wait..." : "PDF"}</span>
            </button>
            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1"></div>
            <ThemeToggle />
            <AuthButton />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-[1600px] flex-1">
        <Link href={`/company/${resolvedParams.id}`} className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Company Dashboard
        </Link>

        <div className="flex flex-col xl:flex-row gap-8 pb-32 xl:pb-20">
          
          {/* Left Column: Form */}
          <div className="w-full xl:w-1/2 flex flex-col gap-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Create Invoice</h1>
            </div>
          
          <div className="bg-white dark:bg-zinc-900/50 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 lg:p-8">
            <InvoiceForm invoice={invoice} setInvoice={setInvoice} />
          </div>
        </div>

        {/* Right Column: Preview */}
        <div className="w-full xl:w-1/2 flex flex-col gap-6">
          <div className="hidden xl:flex items-center justify-between mb-2">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Live Preview</h2>
          </div>
          
          <div className="xl:sticky xl:top-24 mt-4 xl:mt-0 w-full overflow-x-auto rounded-3xl shadow-inner ring-1 ring-zinc-900/5 dark:ring-white/10 bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-12 flex justify-center [background-image:radial-gradient(rgba(212,212,216,0.3)_1px,transparent_1px)] [background-size:16px_16px] dark:[background-image:radial-gradient(rgba(39,39,42,0.3)_1px,transparent_1px)]">
            <div className="transform origin-top scale-[0.6] sm:scale-75 lg:scale-90 xl:scale-100 transition-transform active:scale-[0.98]">
              <InvoicePreview invoice={invoice} isLoggedIn={true} />
            </div>
          </div>
        </div>

        </div>

        {/* Mobile Sticky Bottom Bar */}
        <div className="sm:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-3 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-none pb-safe">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 flex justify-center items-center gap-2 px-4 py-3 rounded-xl font-semibold shadow-sm bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-colors disabled:opacity-75"
          >
            <Save className="w-5 h-5" /> {isSaving ? "Saving..." : "Save"}
          </button>
          <button 
            onClick={handleDownload}
            disabled={isGenerating}
            className="flex-1 flex justify-center items-center gap-2 px-4 py-3 rounded-xl font-semibold shadow-sm bg-blue-600 text-white hover:bg-blue-700 transition-all disabled:opacity-75"
          >
            <Download className="w-5 h-5" /> {isGenerating ? "Wait..." : "PDF"}
          </button>
        </div>

      </div>
    </div>
  );
}
