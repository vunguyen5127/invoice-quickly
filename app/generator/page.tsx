"use client";

import React, { useState, useEffect } from "react";
import { InvoiceForm } from "@/components/invoice-form";
import { InvoicePreview } from "@/components/invoice-preview";
import { initialInvoiceState, InvoiceState } from "@/types/invoice";
import { generatePDF } from "@/utils/generate-pdf";
import { Download, Save, Building2, X, Plus, Receipt, Printer, Share2 } from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { getUserCompanies } from "@/app/dashboard/actions";
import { saveInvoiceToSupabase } from "@/utils/supabase/actions";
import Link from "next/link";
import { CreateCompanyModal } from "@/components/create-company-modal";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuthButton } from "@/components/auth-button";
import { useLanguage } from "@/contexts/language-context";

function CreateInvoiceContent() {
  const { t } = useLanguage();
  const [invoice, setInvoice] = useState<InvoiceState>(initialInvoiceState);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [companies, setCompanies] = useState<any[]>([]);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isGuestSaveModalOpen, setIsGuestSaveModalOpen] = useState(false);

  const searchParams = useSearchParams();

  // Load from localStorage on mount and prefill user name
  useEffect(() => {
    const initData = async () => {
      let draftInvoice = initialInvoiceState;
      const isNew = searchParams.get("new") === "1";

      if (isNew) {
        // Coming from landing page CTA — always start fresh
        localStorage.removeItem("invoiceQuicklyDraft");
        // Clean URL without reloading
        window.history.replaceState({}, "", "/generator");
      } else {
        const savedDraft = localStorage.getItem("invoiceQuicklyDraft");
        if (savedDraft) {
          try {
            draftInvoice = JSON.parse(savedDraft);
          } catch (e) {
            console.error("Failed to parse draft", e);
          }
        }
      }

      // Try to get user info if signatureName is empty
      // Try to get user info if signatureName is empty
      const {
        data: { session },
      } = (await supabase?.auth.getSession()) || { data: { session: null } };
      if (session?.user) {
        setIsLoggedIn(true);
        if (!draftInvoice.signatureName) {
          const name = session.user.user_metadata?.name || session.user.user_metadata?.full_name || session.user.email?.split("@")[0];
          if (name) {
            draftInvoice = { ...draftInvoice, signatureName: name };
          }
        }
      }

      setInvoice(draftInvoice);
      setIsLoaded(true);
    };

    initData();
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("invoiceQuicklyDraft", JSON.stringify(invoice));
    }
  }, [invoice, isLoaded]);

  const handleDownload = async () => {
    setIsGenerating(true);
    await generatePDF("invoice-capture-area", `Invoice-${invoice.details.invoiceNumber}`);
    setIsGenerating(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    alert("Please save the invoice first to generate a shareable public link.");
    handleSaveClick();
  };

  const handleSaveClick = async () => {
    setIsSaving(true);

    // Check if user is logged in
    const {
      data: { session },
    } = (await supabase?.auth.getSession()) || { data: { session: null } };

    if (!session) {
      setIsSaving(false);
      setIsGuestSaveModalOpen(true);
      return;
    }

    try {
      const userCompanies = await getUserCompanies();
      setCompanies(userCompanies);
      setIsSelectModalOpen(true);
    } catch (e) {
      console.error(e);
      alert("Failed to fetch companies.");
    } finally {
      setIsSaving(false);
    }
  };

  const saveToCompany = async (companyId: string) => {
    setIsSaving(true);
    try {
      await saveInvoiceToSupabase(invoice, companyId);
      setIsSelectModalOpen(false);
      alert("Invoice saved to company!");
      router.push(`/company/${companyId}`);
    } catch (e: any) {
      alert("Error saving invoice.");
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  // Don't render until loaded to prevent hydration mismatch
  if (!isLoaded) return null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950">
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-8 max-w-[1600px] mx-auto">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl tracking-tight text-zinc-800 dark:text-zinc-100 transition-opacity hover:opacity-80"
          >
            <Receipt className="h-6 w-6 text-blue-600 dark:text-blue-500" />
            <span className="hidden sm:inline-block">InvoiceQuickly</span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 ml-1">{t.draft}</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-2 sm:gap-3 mr-2">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-sm shadow-sm bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
              >
                <Share2 className="w-4 h-4" /> <span className="hidden lg:inline">{t.share}</span>
              </button>
              <button
                onClick={handleSaveClick}
                disabled={isSaving}
                className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-sm shadow-sm bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-colors disabled:opacity-75"
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
        <div className="flex flex-col xl:flex-row xl:items-start gap-8 pb-32 xl:pb-20">
          {/* Left Column: Form */}
          <div className="w-full xl:w-1/2">
            <div className="h-10 flex items-center mb-6">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-none">{t.editor}</h2>
            </div>
            <div className="bg-white dark:bg-zinc-900/50 rounded-[5px] shadow-sm border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 lg:p-8">
              <InvoiceForm invoice={invoice} setInvoice={setInvoice} />
            </div>
          </div>

          {/* Right Column: Preview */}
          <div className="w-full xl:w-1/2 xl:sticky xl:top-24">
            <div className="h-10 flex items-center mb-6">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-none">{t.livePreview}</h2>
            </div>
            <div className="w-full rounded-[5px] ring-2 ring-blue-400/50">
              <div className="w-full bg-zinc-50 dark:bg-zinc-950 rounded-[5px] overflow-hidden [background-image:radial-gradient(rgba(212,212,216,0.3)_1px,transparent_1px)] [background-size:16px_16px] dark:[background-image:radial-gradient(rgba(39,39,42,0.3)_1px,transparent_1px)]">
                <div className="[zoom:0.6] sm:[zoom:0.75] lg:[zoom:0.9] xl:[zoom:1] origin-top transition-all">
                  <InvoicePreview invoice={invoice} isLoggedIn={isLoggedIn} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Select Company Modal */}
        {isSelectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 rounded-[5px] shadow-xl w-full max-w-md overflow-hidden ring-1 ring-zinc-200 dark:ring-zinc-800 animate-in zoom-in-95 duration-200">
              <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{t.saveInvoiceTo}</h2>
                <button onClick={() => setIsSelectModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3">
                {companies.length === 0 ? (
                  <div className="text-center py-6 text-zinc-500">
                    <Building2 className="w-8 h-8 opacity-50 mx-auto mb-3" />
                    <p className="mb-4">{t.noCompaniesYet}</p>
                    <button
                      onClick={() => {
                        setIsSelectModalOpen(false);
                        setIsCreateModalOpen(true);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                      {t.createFirstCompany}
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-zinc-500 mb-4">{t.selectCompanyInstruction}</p>
                    {companies.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => saveToCompany(c.id)}
                        className="w-full text-left p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all flex items-center gap-3"
                      >
                        <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-5 h-5 text-zinc-500" />
                        </div>
                        <div className="flex-1 truncate">
                          <h3 className="font-semibold text-zinc-900 dark:text-white truncate">{c.name}</h3>
                          <p className="text-xs text-zinc-500 truncate">{c.email || t.noEmail}</p>
                        </div>
                      </button>
                    ))}
                    <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                      <button
                        onClick={() => {
                          setIsSelectModalOpen(false);
                          setIsCreateModalOpen(true);
                        }}
                        className="w-full p-4 border border-zinc-200 border-dashed dark:border-zinc-800 rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-blue-600 hover:border-blue-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" /> {t.createNewCompany}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Create Company Modal (if they choose to create from here) */}
        <CreateCompanyModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={async (newCompany) => {
            setIsCreateModalOpen(false);
            await saveToCompany(newCompany.id);
          }}
        />

        {/* Guest Save Modal */}
        {isGuestSaveModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden ring-1 ring-zinc-200 dark:ring-zinc-800 animate-in zoom-in-95 duration-200 p-8 text-center relative">
              <button
                onClick={() => setIsGuestSaveModalOpen(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Save className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">{t.saveYourInvoice}</h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-8">
                {t.saveInvoiceBenefit}
              </p>
              <div className="space-y-3">
                <Link
                  href="/login?redirect=/generator"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  {t.createFreeAccount}
                </Link>
                <Link
                  href="/login?redirect=/generator"
                  className="w-full flex justify-center py-3 px-4 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  {t.signIn}
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Sticky Bottom Bar */}
         <div className="sm:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-3 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-none pb-safe">
          <button
            onClick={handleSaveClick}
            disabled={isSaving}
            className="flex-1 flex justify-center items-center gap-2 px-4 py-3 rounded-xl font-semibold shadow-sm bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-colors disabled:opacity-75"
          >
            <Save className="w-5 h-5" /> {isSaving ? t.saving : t.save}
          </button>
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="flex-1 flex justify-center items-center gap-2 px-4 py-3 rounded-xl font-semibold shadow-sm bg-blue-600 text-white hover:bg-blue-700 transition-all disabled:opacity-75"
          >
            <Download className="w-5 h-5" /> {isGenerating ? t.wait : t.download}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CreateInvoice() {
  return (
    <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center text-zinc-500">Loading editor...</div>}>
      <CreateInvoiceContent />
    </React.Suspense>
  );
}
