"use client";

import React, { useState, useEffect } from "react";
import { InvoiceForm } from "@/components/invoice-form";
import { InvoicePreview } from "@/components/invoice-preview";
import { initialInvoiceState, InvoiceState } from "@/types/invoice";
import { generatePDF } from "@/utils/generate-pdf";
import { FileDown, Download, Receipt, Send, Plus, ArrowRight, Share2, Save, MoreHorizontal, X, Building2, LayoutDashboard } from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { getUserCompanies } from "@/app/dashboard/actions";
import { saveInvoiceToSupabase } from "@/utils/supabase/actions";
import Link from "next/link";
import { getBaseUrl } from "@/utils/url";
import dynamic from "next/dynamic";
import { InvoiceEditSkeleton } from "@/components/invoice-edit-skeleton";

import { ThemeToggle } from "@/components/theme-toggle";
import { AuthButton } from "@/components/auth-button";
const CreateCompanyModal = dynamic(() => import("@/components/create-company-modal").then((mod) => mod.CreateCompanyModal));
const SuccessModal = dynamic(() => import("@/components/success-modal").then((mod) => mod.SuccessModal));
import { useLanguage } from "@/contexts/language-context";

function CreateInvoiceContent() {
  const { t } = useLanguage();
  const [invoice, setInvoice] = useState<InvoiceState>(initialInvoiceState);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const canSave = invoice.client.name.trim().length > 0 && invoice.items.some((item) => item.description.trim().length > 0);

  const [companies, setCompanies] = useState<any[]>([]);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isGuestSaveModalOpen, setIsGuestSaveModalOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const searchParams = useSearchParams();

  // Load from localStorage on mount and prefill user name
  useEffect(() => {
    const initData = async () => {
      let draftInvoice = initialInvoiceState;
      const isNew = searchParams.get("new") === "1";

      // Check login state first
      const {
        data: { session },
      } = (await supabase?.auth.getSession()) || { data: { session: null } };
      const userIsLoggedIn = !!session?.user;

      if (isNew) {
        // Coming from landing page CTA — always start fresh
        localStorage.removeItem("invoiceQuicklyDraft");
        // Clean URL without reloading
        window.history.replaceState({}, "", "/generator");

        if (userIsLoggedIn) {
          // Logged-in users get a blank invoice (no demo data)
          draftInvoice = {
            ...initialInvoiceState,
            company: { name: "", email: "", address: "", phone: "" },
            client: { name: "", email: "", address: "", phone: "" },
            details: {
              invoiceNumber: "",
              issueDate: new Date().toISOString().split("T")[0],
              dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            },
            items: [{ id: "1", description: "", quantity: 1, rate: 0 }],
            taxRate: 0,
            discount: 0,
            notes: "",
            terms: "",
          };
        }
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

      if (userIsLoggedIn) {
        setIsLoggedIn(true);
        if (!draftInvoice.signatureName) {
          const name = session!.user.user_metadata?.name || session!.user.user_metadata?.full_name || session!.user.email?.split("@")[0];
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
      const token = session.access_token;
      const result = await getUserCompanies(session.access_token);
      setCompanies(result.data || []);
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
      const {
        data: { session },
      } = (await supabase?.auth.getSession()) || { data: { session: null } };
      if (!session) throw new Error("No session");
      await saveInvoiceToSupabase(session.access_token, invoice, companyId);
      setIsSelectModalOpen(false);
      setShowSuccessModal(true);
    } catch (e: any) {
      alert("Error saving invoice.");
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    // Since we saved it to a specific company, we redirect there to see it
    if (companies.length === 1) {
      router.push(`/company/${companies[0].id}`);
    } else {
      // Find which company it was saved to (we would need that state, or just go to home)
      router.push("/dashboard"); // Redirect to dashboard or a more general page
    }
  };

  // Don't render until loaded to prevent hydration mismatch
  if (!isLoaded) return null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950">
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl">
        <div className="container flex h-14 items-center justify-between px-4 sm:px-6 max-w-[1600px] mx-auto">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-bold text-base tracking-tight text-zinc-900 dark:text-zinc-100 transition-opacity hover:opacity-80"
          >
            <img src="/logo.svg" alt="Invoice-Quickly Logo" className="h-7 w-7 object-contain" />
            <span className="hidden sm:inline">Invoice-Quickly</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 bg-zinc-100/80 dark:bg-zinc-800/50 rounded-xl p-1">
              {isLoggedIn && (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-1.5 px-3 h-8 rounded-lg font-medium text-[13px] text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100 hover:shadow-sm transition-all duration-150"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" /> <span className="hidden lg:inline">{t.myInvoices}</span>
                </Link>
              )}
              <button
                onClick={handleShare}
                disabled={!canSave}
                className="inline-flex items-center justify-center gap-1.5 px-3 h-8 rounded-lg font-medium text-[13px] text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100 hover:shadow-sm transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none"
              >
                <Share2 className="w-3.5 h-3.5" /> <span className="hidden lg:inline">{t.share}</span>
              </button>
              <button
                onClick={handleSaveClick}
                disabled={isSaving || !canSave}
                className="inline-flex items-center justify-center gap-1.5 px-3 h-8 rounded-lg font-semibold text-[13px] bg-emerald-500 text-white hover:bg-emerald-600 active:bg-emerald-700 transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none shadow-sm"
              >
                <Save className="w-3.5 h-3.5" /> <span className="hidden lg:inline">{isSaving ? t.saving : t.save}</span>
              </button>
              <button
                onClick={handleDownload}
                disabled={isGenerating || !canSave}
                className="inline-flex items-center justify-center gap-1.5 px-3 h-8 rounded-lg font-semibold text-[13px] bg-zinc-800 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-100 active:bg-zinc-900 dark:active:bg-zinc-200 transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none shadow-sm"
              >
                <Download className="w-3.5 h-3.5" /> <span className="hidden lg:inline">{isGenerating ? t.wait : t.download}</span>
              </button>
            </div>
            <div className="hidden sm:block w-px h-5 bg-zinc-200 dark:bg-zinc-700 mx-0.5" />
            <div className="flex items-center gap-0.5">
              <ThemeToggle />
              <AuthButton />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-8 py-8 max-w-[1600px] flex-1">
        <div className="flex flex-col xl:flex-row xl:items-start gap-8 pb-32 xl:pb-20">
          {/* Left Column: Form */}
          <div className="flex-1">
            <div className="h-10 flex items-center mb-6">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-none">{t.editor}</h2>
            </div>
            <div className="bg-white dark:bg-zinc-900/50 rounded-[5px] shadow-sm border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 lg:p-8">
              <InvoiceForm invoice={invoice} setInvoice={setInvoice} />
            </div>
          </div>

          {/* Right Column: Preview */}
          <div className="flex-1 xl:sticky xl:top-14">
            <div className="h-10 flex items-center mb-6">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-none">{t.livePreview}</h2>
            </div>
            <div className="w-full rounded-[5px] ring-2 ring-blue-400/50">
              <div className="w-full bg-zinc-50 dark:bg-zinc-950 rounded-[5px] overflow-hidden [background-image:radial-gradient(rgba(212,212,216,0.3)_1px,transparent_1px)] [background-size:16px_16px] dark:[background-image:radial-gradient(rgba(39,39,42,0.3)_1px,transparent_1px)]">
                <div className="[zoom:0.6] sm:[zoom:0.75] lg:[zoom:0.9] xl:[zoom:1] origin-top-left transition-all">
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
                        className="w-full text-left p-4 border border-zinc-200 dark:border-zinc-800 rounded-[5px] hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all flex items-center gap-3"
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
                        className="w-full p-4 border border-zinc-200 border-dashed dark:border-zinc-800 rounded-[5px] text-zinc-600 dark:text-zinc-400 hover:text-blue-600 hover:border-blue-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all flex items-center justify-center gap-2"
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
            <div className="bg-white dark:bg-zinc-900 rounded-[5px] shadow-2xl w-full max-w-md overflow-hidden ring-1 ring-zinc-200 dark:ring-zinc-800 animate-in zoom-in-95 duration-200 p-8 text-center relative">
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
              <p className="text-zinc-600 dark:text-zinc-400 mb-8">{t.saveInvoiceBenefit}</p>
              <div className="space-y-3">
                <button
                  onClick={async () => {
                    if (!supabase) return;
                    const baseUrl = getBaseUrl();
                    await supabase.auth.signInWithOAuth({
                      provider: "google",
                      options: {
                        redirectTo: `${baseUrl}/auth/callback?next=${encodeURIComponent("/generator")}`,
                        queryParams: { prompt: "select_account" },
                      },
                    });
                  }}
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Sign in with Google
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Sticky Bottom Bar */}
        <div className="sm:hidden fixed bottom-0 left-0 right-0 px-4 py-3 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-200/80 dark:border-zinc-800/80 flex items-center gap-2 z-50 shadow-[0_-2px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_-2px_16px_rgba(0,0,0,0.3)] pb-safe">
          <button
            onClick={handleShare}
            aria-label="Share"
            className="flex-1 flex justify-center items-center gap-1.5 px-3 py-2.5 rounded-xl font-medium text-[13px] bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 active:scale-[0.97] transition-all duration-150"
          >
            <Share2 className="w-4 h-4" /> {t.share}
          </button>
          <button
            onClick={handleSaveClick}
            disabled={isSaving || !canSave}
            className="flex-1 flex justify-center items-center gap-1.5 px-3 py-2.5 rounded-xl font-semibold text-[13px] bg-emerald-500 text-white hover:bg-emerald-600 active:scale-[0.97] transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none shadow-sm shadow-emerald-500/25"
          >
            <Save className="w-4 h-4" /> {isSaving ? t.saving : t.save}
          </button>
          <button
            onClick={handleDownload}
            disabled={isGenerating || !canSave}
            className="flex-1 flex justify-center items-center gap-1.5 px-3 py-2.5 rounded-xl font-semibold text-[13px] bg-zinc-800 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-100 active:scale-[0.97] transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none shadow-sm"
          >
            <Download className="w-4 h-4" /> {isGenerating ? t.wait : t.download}
          </button>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        title={t.invoiceTitle + " Saved!" || "Invoice Saved!"}
        message="Your invoice has been successfully saved to your company dashboard."
      />
    </div>
  );
}

export default function CreateInvoice() {
  return (
    <React.Suspense fallback={<InvoiceEditSkeleton />}>
      <CreateInvoiceContent />
    </React.Suspense>
  );
}
