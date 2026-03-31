"use client";

import React, { useState, useEffect, useRef } from "react";
import { InvoiceForm } from "@/components/invoice-form";
import { InvoicePreview } from "@/components/invoice-preview";
import { initialInvoiceState, InvoiceState } from "@/types/invoice";
import { generatePDF } from "@/utils/generate-pdf";
import { Download, Plus, Share2, Save, X, Building2, Package, Users, LayoutDashboard, Loader2, ArrowRight } from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { getUserCompanies, getNextInvoiceNumber } from "@/app/dashboard/actions";
import { getUserEntitlements } from "@/utils/entitlements";
import { getItems, getSavedClients } from "@/app/dashboard/items/actions";

import { saveInvoiceToSupabase } from "@/utils/supabase/actions";
import Link from "next/link";
import Image from "next/image";
import { getBaseUrl } from "@/utils/url";
import dynamic from "next/dynamic";
import { InvoiceEditSkeleton } from "@/components/invoice-edit-skeleton";

import { ThemeToggle } from "@/components/theme-toggle";
import { AuthButton } from "@/components/auth-button";
const CreateCompanyModal = dynamic(() => import("@/components/create-company-modal").then((mod) => mod.CreateCompanyModal));
const SuccessModal = dynamic(() => import("@/components/success-modal").then((mod) => mod.SuccessModal));
import { useLanguage } from "@/contexts/language-context";

import { useAuth } from "@/contexts/auth-context";

function CreateInvoiceContent() {
  const { t } = useLanguage();
  const { session, loading: authLoading } = useAuth();
  const [invoice, setInvoice] = useState<InvoiceState>(initialInvoiceState);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [canUseRecurring, setCanUseRecurring] = useState(false);
  const [hasNoCompany, setHasNoCompany] = useState(false);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [hasNoItems, setHasNoItems] = useState(false);
  const [hasNoClients, setHasNoClients] = useState(false);

  const canSave = invoice.client.name.trim().length > 0 && invoice.items.some((item) => item.description.trim().length > 0);

  const [companies, setCompanies] = useState<any[]>([]);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isGuestSaveModalOpen, setIsGuestSaveModalOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [initialCompanyId, setInitialCompanyId] = useState<string>("");

  const searchParams = useSearchParams();
  const initRef = useRef(false);

  // Load from localStorage on mount and prefill user name
  useEffect(() => {
    if (authLoading) return;
    if (initRef.current) return;
    initRef.current = true;
    
    const initData = async () => {
      let draftInvoice = initialInvoiceState;
      const isNew = searchParams.get("new") === "1";
      const userIsLoggedIn = !!session?.user;

      if (isNew) {
        // Coming from landing page CTA — always start fresh
        localStorage.removeItem("Invoice-QuicklyDraft");
        // Clean URL without reloading
        window.history.replaceState({}, "", "/generator");

        if (userIsLoggedIn) {
          // Logged-in users get a blank invoice (no demo data), prefilled if only 1 company
          let companyData = { name: "", email: "", address: "", phone: "", logo: "" };
          let nextInvNum = "";
          let sigName = "";
          let sigUrl = "";
          let currency = initialInvoiceState.currency;
          let notes = initialInvoiceState.notes;
          let terms = initialInvoiceState.terms;
          let taxRate = 0;
          let discount = 0;
          
          if (session) {
            try {
              // Fetch companies, entitlements, item count, client count in parallel
              const [res, ents, itemsRes, clientsRes] = await Promise.all([
                getUserCompanies(session.access_token),
                getUserEntitlements(session.access_token),
                getItems(session.access_token, { pageSize: 1 }).catch(() => ({ data: [], totalCount: 0 })),
                getSavedClients(session.access_token, { pageSize: 1 }).catch(() => ({ data: [], totalCount: 0 })),
              ]);
              setCanUseRecurring(ents.canUseRecurring);
              if (itemsRes.totalCount === 0) setHasNoItems(true);
              if (clientsRes.totalCount === 0) setHasNoClients(true);

              if (res.data && res.data.length === 1) {
                const autoCompany = res.data[0];
                setInitialCompanyId(autoCompany.id);
                
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
                sigName = autoCompany.signer_name || "";
                sigUrl = autoCompany.signature_url || "";
                currency = autoCompany.default_currency || initialInvoiceState.currency;
                notes = autoCompany.default_notes || initialInvoiceState.notes;
                terms = autoCompany.default_terms || initialInvoiceState.terms;
                taxRate = autoCompany.default_tax !== null && autoCompany.default_tax !== undefined ? autoCompany.default_tax : 0;
                discount = autoCompany.default_discount !== null && autoCompany.default_discount !== undefined ? autoCompany.default_discount : 0;

                // Await invoice number so it's ready before draftInvoice is built
                try {
                  nextInvNum = await getNextInvoiceNumber(session.access_token, autoCompany.id, autoCompany.invoice_number_prefix || undefined);
                } catch (e) {
                  console.error("Failed to fetch invoice number", e);
                }
              } else if (!res.data || res.data.length === 0) {
                setHasNoCompany(true);
              }
            } catch (e) {
              console.error("Failed to fetch initial company data", e);
            }
          }

          draftInvoice = {
            ...initialInvoiceState,
            company: companyData,
            client: { name: "", email: "", address: "", phone: "" },
            details: {
              invoiceNumber: nextInvNum,
              issueDate: new Date().toISOString().split("T")[0],
              dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            },
            items: [{ id: "1", description: "", quantity: 1, rate: 0 }],
            taxRate: taxRate,
            discount: discount,
            notes: notes,
            terms: terms,
            signatureName: sigName,
            signature: sigUrl,
            currency: currency,
          };
        }
      } else {
        const savedDraft = localStorage.getItem("Invoice-QuicklyDraft");
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
        // canUseRecurring already set above when fetching entitlements in parallel
        if (!draftInvoice.signatureName) {
          const name = session!.user.user_metadata?.name || session!.user.user_metadata?.full_name || session!.user.email?.split("@")[0];
          if (name) {
            draftInvoice = { ...draftInvoice, signatureName: name };
          }
        }
      }

      setInvoice(draftInvoice);
      setIsLoaded(true);
      // Trigger mount animation after a frame so transition plays
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsMounted(true));
      });
    };

    initData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, session]);

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("Invoice-QuicklyDraft", JSON.stringify(invoice));
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

    if (!session) {
      setIsSaving(false);
      setIsGuestSaveModalOpen(true);
      return;
    }

    if (initialCompanyId) {
      await saveToCompany(initialCompanyId);
      return;
    }

    try {
      const result = await getUserCompanies(session.access_token);
      setCompanies(result.data || []);
      
      if (result.data?.length === 1) {
        setInitialCompanyId(result.data[0].id);
        await saveToCompany(result.data[0].id, result.data[0]);
      } else {
        setIsSelectModalOpen(true);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to fetch companies.");
    } finally {
      setIsSaving(false);
    }
  };

  const saveToCompany = async (companyId: string, companyData?: any) => {
    setIsSaving(true);
    try {
      const {
        data: { session },
      } = (await supabase?.auth.getSession()) || { data: { session: null } };
      if (!session) throw new Error("No session");

      let finalInvoice = invoice;
      
      // Override the default invoice company info with the selected company
      if (companyData) {
        const details = [];
        if (companyData.name) details.push(companyData.name);
        if (companyData.address) details.push(companyData.address);
        if (companyData.email) details.push(companyData.email);
        if (companyData.phone) details.push(companyData.phone);

        const companyDetailsString = details.filter(Boolean).join(", ");
          
        finalInvoice = {
          ...invoice,
          company: {
            ...invoice.company,
            name: companyDetailsString,
            email: "",
            address: "",
            phone: "",
            logo: companyData.logo_url || invoice.company.logo,
          },
          signatureName: companyData.signer_name || invoice.signatureName,
          signature: companyData.signature_url || invoice.signature,
          currency: companyData.default_currency || invoice.currency,
          notes: companyData.default_notes || invoice.notes,
          terms: companyData.default_terms || invoice.terms,
          taxRate: companyData.default_tax !== null && companyData.default_tax !== undefined ? companyData.default_tax : invoice.taxRate,
          discount: companyData.default_discount !== null && companyData.default_discount !== undefined ? companyData.default_discount : invoice.discount,
        };
        setInvoice(finalInvoice);
      }

      // Update invoice number if it matches the default placeholder
      if (finalInvoice.details.invoiceNumber === "INV-2026-001" || finalInvoice.details.invoiceNumber === `INV-${new Date().getFullYear()}-001`) {
        const nextInvoiceNumber = await getNextInvoiceNumber(session.access_token, companyId);
        finalInvoice = {
          ...finalInvoice,
          details: { ...finalInvoice.details, invoiceNumber: nextInvoiceNumber }
        };
      }

      await saveInvoiceToSupabase(session.access_token, finalInvoice, companyId);
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

  // Prefill invoice form with new company data (used by setup banner flow)
  const handleCompanySetup = (newCompany: any) => {
    setHasNoCompany(false);
    setIsSetupModalOpen(false);
    setInitialCompanyId(newCompany.id);
    const details: string[] = [];
    if (newCompany.name) details.push(newCompany.name);
    if (newCompany.address) details.push(newCompany.address);
    if (newCompany.email) details.push(newCompany.email);
    if (newCompany.phone) details.push(newCompany.phone);
    setInvoice(prev => ({
      ...prev,
      company: { ...prev.company, name: details.join(", "), logo: newCompany.logo_url || prev.company.logo },
      signatureName: newCompany.signer_name || prev.signatureName,
      signature: newCompany.signature_url || prev.signature,
      currency: newCompany.default_currency || prev.currency,
      notes: newCompany.default_notes || prev.notes,
      terms: newCompany.default_terms || prev.terms,
      taxRate: newCompany.default_tax ?? prev.taxRate,
      discount: newCompany.default_discount ?? prev.discount,
    }));
    // Load invoice number for this company
    if (session) {
      getNextInvoiceNumber(session.access_token, newCompany.id, newCompany.invoice_number_prefix || undefined)
        .then(num => setInvoice(prev => ({ ...prev, details: { ...prev.details, invoiceNumber: num } })))
        .catch(console.error);
    }
  };

  // Don't render interactive parts until loaded to prevent hydration mismatch
  const mainContent = (
    <>
      {/* Left Column: Form */}
      <div className="w-full flex-1 overflow-hidden animate-in fade-in duration-500">
        <div className="h-10 flex items-center mb-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-none">
            {!isLoaded ? "Editor" : t.editor}
          </h2>
        </div>

        {/* New-user company setup banner */}
        {isLoaded && isLoggedIn && hasNoCompany && (
          <div className="mb-4 flex items-center gap-3 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl text-sm">
            <Building2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <span className="text-blue-700 dark:text-blue-300 flex-1">
              Set up your company profile to auto-fill invoices and save time.
            </span>
            <button
              onClick={() => setIsSetupModalOpen(true)}
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline whitespace-nowrap"
            >
              Set up now →
            </button>
            <button
              onClick={() => setHasNoCompany(false)}
              className="text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 ml-1"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Items library banner — shown after company is set up */}
        {isLoaded && isLoggedIn && !hasNoCompany && hasNoItems && (
          <div className="mb-4 flex items-center gap-3 px-4 py-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl text-sm">
            <Package className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span className="text-amber-700 dark:text-amber-300 flex-1">
              Add items to your library to speed up invoice creation.
            </span>
            <button
              onClick={() => router.push('/dashboard/items')}
              className="text-amber-600 dark:text-amber-400 font-semibold hover:underline whitespace-nowrap"
            >
              Go to Item Library →
            </button>
            <button
              onClick={() => setHasNoItems(false)}
              className="text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 ml-1"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Clients banner — shown after company + items are set up */}
        {isLoaded && isLoggedIn && !hasNoCompany && !hasNoItems && hasNoClients && (
          <div className="mb-4 flex items-center gap-3 px-4 py-3 bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800/50 rounded-xl text-sm">
            <Users className="w-4 h-4 text-violet-500 flex-shrink-0" />
            <span className="text-violet-700 dark:text-violet-300 flex-1">
              Save clients to your list for quick reuse in future invoices.
            </span>
            <button
              onClick={() => router.push('/dashboard/items')}
              className="text-violet-600 dark:text-violet-400 font-semibold hover:underline whitespace-nowrap"
            >
              Add Clients →
            </button>
            <button
              onClick={() => setHasNoClients(false)}
              className="text-violet-400 hover:text-violet-600 dark:hover:text-violet-300 ml-1"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="bg-white dark:bg-zinc-900/50 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 lg:p-8">
          {!isLoaded ? (
            <InvoiceEditSkeleton />
          ) : (
            <InvoiceForm invoice={invoice} setInvoice={setInvoice} defaultCompanyId={initialCompanyId} canUseRecurring={canUseRecurring} />
          )}
        </div>
      </div>

      {/* Right Column: Preview */}
      <div className="w-full flex-1 xl:sticky xl:top-14 overflow-hidden animate-in fade-in duration-700">
        <div className="h-10 flex items-center mb-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-none">
            {!isLoaded ? "Live Preview" : t.livePreview}
          </h2>
        </div>
        <div className="rounded-[5px] overflow-hidden mt-1">
          {!isLoaded ? (
            <div className="w-full aspect-[1/1.4] bg-zinc-100 dark:bg-zinc-800/50 animate-pulse rounded-md border border-zinc-200 dark:border-zinc-700" />
          ) : (
            <InvoicePreview invoice={invoice} isLoggedIn={isLoggedIn} />
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950">
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl">
        <div className="container flex h-14 items-center justify-between px-4 sm:px-6 max-w-[1600px] mx-auto">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-bold text-base tracking-tight text-zinc-900 dark:text-zinc-100 transition-opacity hover:opacity-80"
          >
            <Image src="/logo.svg" alt="Invoice-Quickly Logo" width={28} height={28} className="h-6 w-6 sm:h-7 sm:w-7 object-contain" />
            <span className="text-sm sm:text-base">Invoice-Quickly</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1 bg-zinc-100/50 dark:bg-zinc-800/40 border border-zinc-200/50 dark:border-zinc-700/50 rounded-xl p-1 shadow-sm">
              <button
                onClick={handleShare}
                disabled={!canSave}
                className="inline-flex items-center justify-center gap-1.5 px-3 h-9 rounded-xl font-semibold text-[13px] text-zinc-500 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none"
              >
                <Share2 className="w-3.5 h-3.5" /> <span className="hidden lg:inline">{t.share}</span>
              </button>
              <button
                onClick={handleSaveClick}
                disabled={isSaving || !canSave}
                className="inline-flex items-center justify-center gap-1.5 px-4 h-9 rounded-xl font-semibold text-[13px] bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700/80 active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none shadow-sm"
              >
                <Save className="w-3.5 h-3.5" /> <span className="hidden lg:inline">{isSaving ? t.saving : t.save}</span>
              </button>
              <button
                onClick={handleDownload}
                disabled={isGenerating || !canSave}
                className="inline-flex items-center justify-center gap-1.5 px-5 h-9 rounded-xl font-semibold text-[13px] bg-gradient-to-b from-primary to-primary/95 text-primary-foreground hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none shadow-md shadow-primary/10 min-w-[110px]"
              >
                {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                <span className="hidden lg:inline">{t.download}</span>
              </button>
            </div>
            <div className="hidden sm:block w-px h-5 bg-zinc-200 dark:bg-zinc-800 mx-0.5" />
            <div className="flex items-center gap-1.5">
              {isLoggedIn && (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-1.5 px-3 h-8 rounded-[5px] font-medium text-[13px] text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100 hover:shadow-sm transition-all duration-150 mr-1"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden lg:inline">{t.myInvoices}</span>
                </Link>
              )}
              {isLoggedIn && <div className="hidden xs:block w-px h-5 bg-zinc-200 dark:bg-zinc-700 mx-1" />}
              <ThemeToggle />
              <AuthButton />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-8 py-8 max-w-[1600px] flex-1">
        <div className="flex flex-col xl:flex-row xl:items-start gap-8 pb-32 xl:pb-20">
          {mainContent}
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
                      className="px-4 py-2 bg-blue-600 text-white rounded-[5px] hover:bg-blue-700 font-medium"
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
                        onClick={() => saveToCompany(c.id, c)}
                        className="w-full text-left p-4 border border-zinc-200 dark:border-zinc-800 rounded-[5px] hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all flex items-center gap-3"
                      >
                        <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-[5px] flex items-center justify-center flex-shrink-0">
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

        {/* Create Company Modal — setup flow (prefill without saving) */}
        <CreateCompanyModal
          isOpen={isSetupModalOpen}
          onClose={() => setIsSetupModalOpen(false)}
          onSuccess={handleCompanySetup}
        />

        {/* Create Company Modal (if they choose to create from here) */}
        <CreateCompanyModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={async (newCompany) => {
            setIsCreateModalOpen(false);
            await saveToCompany(newCompany.id, newCompany);
          }}
        />

        {/* Guest Save Modal */}
        {isGuestSaveModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-zinc-950/40 dark:bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-zinc-200/60 dark:border-zinc-800/60 w-full max-w-[420px] overflow-hidden animate-in zoom-in-95 duration-300 relative py-10 px-6 sm:px-10 text-center">
              <button
                onClick={() => setIsGuestSaveModalOpen(false)}
                className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full p-2 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-blue-50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/10 rounded-2xl flex items-center justify-center border border-blue-100/50 dark:border-blue-800/30 shadow-sm shadow-blue-500/5 mb-6">
                <Save className="w-7 h-7 text-blue-600 dark:text-blue-500" strokeWidth={2.5} />
              </div>
              
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight mb-2">
                {t.saveYourInvoice}
              </h2>
              <p className="text-[15px] text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed max-w-[300px] mx-auto">
                {t.saveInvoiceBenefit}
              </p>
              
              <div className="mt-2 w-full max-w-[320px] mx-auto">
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
                  aria-label="Securely log in with your Google Workspace or personal account"
                  title="Single Sign-On with Google"
                  className="w-full group relative flex items-center justify-center h-[52px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-100 rounded-xl font-medium text-[15px] transition-all duration-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                >
                  <div className="absolute left-4">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  </div>
                  <span>Continue with Google</span>
                  <ArrowRight className="absolute right-4 w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-zinc-400" />
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
            className="flex-1 flex justify-center items-center gap-1.5 px-3 py-2.5 rounded-xl font-medium text-[13px] bg-secondary text-secondary-foreground border border-border hover:opacity-90 active:scale-[0.97] transition-all duration-150"
          >
            <Share2 className="w-4 h-4" /> {t.share}
          </button>
          <button
            onClick={handleSaveClick}
            disabled={isSaving || !canSave}
            className="flex-1 flex justify-center items-center gap-1.5 px-3 py-2.5 rounded-xl font-semibold text-[13px] bg-success text-success-foreground hover:opacity-90 active:scale-[0.97] transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none shadow-lg shadow-success/10"
          >
            <Save className="w-4 h-4" /> {isSaving ? t.saving : t.save}
          </button>
          <button
            onClick={handleDownload}
            disabled={isGenerating || !canSave}
            className="flex-1 flex justify-center items-center gap-1.5 px-3 py-2.5 rounded-xl font-semibold text-[13px] bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.97] transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none shadow-lg shadow-primary/10"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {t.download}
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
