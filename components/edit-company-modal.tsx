"use client";

import React, { useState, useEffect } from "react";
import { updateCompany } from "@/app/dashboard/actions";
import { X, Loader2, PenTool, Upload, Building2 } from "lucide-react";
import { SignaturePadModal } from "./signature-pad-modal";
import { InvoiceState, CURRENCIES } from "@/types/invoice";
import { useLanguage } from "@/contexts/language-context";

interface EditCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedCompany: any) => void;
  initialData: {
    id: string;
    name: string;
    email: string;
    address: string;
    phone?: string;
    signature_url?: string;
    signer_name?: string;
    default_currency?: string;
    default_notes?: string;
    default_terms?: string;
    show_notes?: boolean;
    show_terms?: boolean;
    default_tax?: number;
    default_discount?: number;
  } | null;
}

export function EditCompanyModal({ isOpen, onClose, onSuccess, initialData }: EditCompanyModalProps) {
  const { t } = useLanguage();
  const [tab, setTab] = useState<"company" | "defaults">("company");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [logo, setLogo] = useState<string | undefined>(undefined);
  const [signerName, setSignerName] = useState("");
  const [signatureUrl, setSignatureUrl] = useState<string | undefined>(undefined);
  const [defaultCurrency, setDefaultCurrency] = useState("USD");
  const [defaultNotes, setDefaultNotes] = useState("");
  const [defaultTerms, setDefaultTerms] = useState("");
  const [showNotes, setShowNotes] = useState(true);
  const [showTerms, setShowTerms] = useState(true);
  const [defaultTax, setDefaultTax] = useState(0);
  const [defaultDiscount, setDefaultDiscount] = useState(0);
  const [isValidPhone, setIsValidPhone] = useState(true);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const logoInputRef = React.useRef<HTMLInputElement>(null);

  const fs = "w-full rounded-[5px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 pb-2 pt-0 transition-all focus-within:border-blue-500 dark:focus-within:border-blue-500 hover:border-zinc-300 dark:hover:border-zinc-700 group";
  const lg = "text-[11px] font-medium text-zinc-400 dark:text-zinc-500 px-1 ml-[-4px] group-focus-within:text-blue-500 transition-colors empty:hidden";
  const ic = "w-full bg-transparent text-[13px] font-medium text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none";

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setEmail(initialData.email || "");
      setPhone(initialData.phone || "");
      setAddress(initialData.address || "");
      setSignerName(initialData.signer_name || "");
      setSignatureUrl(initialData.signature_url || undefined);
      setDefaultCurrency(initialData.default_currency || "USD");
      setDefaultNotes(initialData.default_notes || "Thank you for your business! We appreciate your trust and look forward to working with you again.");
      setDefaultTerms(initialData.default_terms || "Payment is due within 30 days of invoice date.\nPlease make payment to the bank account listed above.\nFor questions, please contact us at the email above.");
      setShowNotes(initialData.show_notes ?? true);
      setShowTerms(initialData.show_terms ?? true);
      setDefaultTax(initialData.default_tax || 0);
      setDefaultDiscount(initialData.default_discount || 0);
      setLogo((initialData as any).logo_url || undefined);
    }
    setTab("company");
  }, [initialData, isOpen]);

  if (!isOpen || !initialData) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    const isPhoneValid = !phone || phoneRegex.test(phone.replace(/\s/g, ''));
    setIsValidPhone(isPhoneValid);
    if (!isPhoneValid) return;

    setIsSubmitting(true);
    const updated = await updateCompany(initialData.id, {
      name, email, address, phone, logo, signatureUrl, signerName,
      defaultCurrency, defaultNotes, defaultTerms, showNotes, showTerms,
      defaultTax, defaultDiscount,
    });
    setIsSubmitting(false);
    if (updated) { onSuccess(updated); onClose(); }
    else alert("Failed to update company. Please try again.");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert("Image must be less than 2MB"); return; }
    const reader = new FileReader();
    reader.onloadend = () => setLogo(reader.result as string);
    reader.readAsDataURL(file);
  };

  const tabBtn = (active: boolean) =>
    `flex-1 py-2 text-[13px] font-semibold transition-colors ${active
      ? "text-blue-600 border-b-2 border-blue-500"
      : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 border-b-2 border-transparent"}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 rounded-[5px] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="px-5 pt-4 pb-0 flex items-center justify-between">
          <h2 className="text-[15px] font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
            <PenTool className="w-4 h-4 text-blue-500" />
            {t.editCompany}
          </h2>
          <button onClick={onClose} className="p-1 rounded text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-5 mt-3 border-b border-zinc-100 dark:border-zinc-800">
          <button type="button" className={tabBtn(tab === "company")} onClick={() => setTab("company")}>{t.company}</button>
          <button type="button" className={tabBtn(tab === "defaults")} onClick={() => setTab("defaults")}>{t.invoiceDefaults}</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-5 space-y-3 max-h-[68vh] overflow-y-auto">

            {/* ── Company Tab ── */}
            {tab === "company" && (
              <>
                <div className="flex gap-3 items-start">
                  <div className="flex-1 space-y-3">
                    <fieldset className={fs}>
                      <legend className={lg}>{t.companyNameField} <span className="text-red-500">*</span></legend>
                      <input required value={name} onChange={e => setName(e.target.value)} className={ic} placeholder="Acme Corp" />
                    </fieldset>
                    <fieldset className={fs}>
                      <legend className={lg}>{t.billingEmailField}</legend>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={ic} placeholder="billing@acme.com" />
                    </fieldset>
                  </div>

                  {/* Logo */}
                  <div className="w-[110px] flex-shrink-0 relative">
                    {logo ? (
                      <div className="relative w-full h-[110px] group transition-all">
                        <div className="w-full h-full rounded-[5px] border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950/50 flex items-center justify-center overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={logo} alt="Logo" className="w-full h-full object-cover" />
                        </div>
                        <button type="button" onClick={() => setLogo(undefined)} className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all shadow-md z-10">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div onClick={() => logoInputRef.current?.click()} className="w-full h-[110px] rounded-[5px] border border-zinc-200 dark:border-zinc-700 flex flex-col items-center justify-center cursor-pointer bg-white hover:bg-blue-50/50 dark:bg-zinc-900">
                        <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white">
                          <Building2 className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] text-zinc-400 mt-1">{t.companyLogo}</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" className="hidden" ref={logoInputRef} onChange={handleImageUpload} />
                  </div>
                </div>

                <fieldset className={fs}>
                  <legend className={lg}>{t.addressField}</legend>
                  <textarea rows={2} value={address} onChange={e => setAddress(e.target.value)} className={`${ic} resize-none mt-1`} placeholder="123 Business St, City, Country" />
                </fieldset>
 
                <div className="grid grid-cols-2 gap-2">
                  <fieldset className={`${fs} ${!isValidPhone ? 'border-red-500 dark:border-red-500' : ''}`}>
                    <legend className={`${lg} ${!isValidPhone ? 'text-red-500' : ''}`}>{t.phoneField}</legend>
                    <input 
                      value={phone} 
                      onChange={e => {
                        setPhone(e.target.value);
                        setIsValidPhone(true);
                      }} 
                      className={ic} 
                      placeholder="+1 (555) 000-0000" 
                    />
                  </fieldset>
                  <fieldset className={fs}>
                    <legend className={lg}>{t.currency}</legend>
                    <select value={defaultCurrency} onChange={e => setDefaultCurrency(e.target.value)} className={`${ic} py-0.5`}>
                      {CURRENCIES.map(c => (
                        <option key={c.code} value={c.code}>
                          {c.code} ({c.symbol})
                        </option>
                      ))}
                    </select>
                  </fieldset>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <fieldset className={fs}>
                    <legend className={lg}>{t.taxRate} (%)</legend>
                    <input type="number" value={defaultTax || ''} onChange={e => setDefaultTax(Number(e.target.value))} className={ic} placeholder="0" />
                  </fieldset>
                  <fieldset className={fs}>
                    <legend className={lg}>{t.discount}</legend>
                    <input type="number" value={defaultDiscount || ''} onChange={e => setDefaultDiscount(Number(e.target.value))} className={ic} placeholder="0" />
                  </fieldset>
                </div>

                {/* Signature */}
                <div>
                  <p className="text-[11px] font-medium text-zinc-400 mb-1.5">{t.signature}</p>
                  {signatureUrl ? (
                    <div className="relative h-20 rounded-[5px] border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 flex items-center justify-center p-1 group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={signatureUrl} alt="Signature" className="max-h-full object-contain mix-blend-multiply dark:mix-blend-normal dark:invert" />
                      <button type="button" onClick={() => setSignatureUrl(undefined)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 shadow transition-all">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => document.getElementById('sig-upload-edit')?.click()} className="flex-1 h-20 rounded-[5px] border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-blue-500 flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-colors text-zinc-400 hover:text-blue-500">
                        <Upload className="w-4 h-4" /><span className="text-[10px] uppercase font-semibold">{t.upload}</span>
                      </button>
                      <span className="text-[11px] text-zinc-400">{t.or}</span>
                      <button type="button" onClick={() => setIsSignatureModalOpen(true)} className="flex-1 h-14 rounded-[5px] border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-blue-500 flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-colors text-zinc-400 hover:text-blue-500">
                        <PenTool className="w-4 h-4" /><span className="text-[10px] uppercase font-semibold">{t.draw}</span>
                      </button>
                      <input id="sig-upload-edit" type="file" accept="image/*" className="hidden" onChange={e => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (file.size > 2 * 1024 * 1024) { alert("Max 2MB"); return; }
                        const r = new FileReader();
                        r.onloadend = () => setSignatureUrl(r.result as string);
                        r.readAsDataURL(file);
                      }} />
                    </div>
                  )}
                </div>

                <fieldset className={fs}>
                  <legend className={lg}>{t.signerNameField}</legend>
                  <input value={signerName} onChange={e => setSignerName(e.target.value)} className={ic} placeholder="John Doe" />
                </fieldset>
              </>
            )}

            {/* ── Invoice Defaults Tab ── */}
            {tab === "defaults" && (
              <>
                <fieldset className={fs}>
                  <legend className={lg}>{t.defaultNotesField}</legend>
                  <textarea rows={3} value={defaultNotes} onChange={e => setDefaultNotes(e.target.value)} className={`${ic} resize-none mt-1`} placeholder="Thank you for your business!" />
                </fieldset>

                <fieldset className={fs}>
                  <legend className={lg}>{t.defaultTermsField}</legend>
                  <textarea rows={3} value={defaultTerms} onChange={e => setDefaultTerms(e.target.value)} className={`${ic} resize-none mt-1`} placeholder="Payment due within 30 days." />
                </fieldset>

                <div className="flex flex-col gap-2 pt-1 border-t border-zinc-100 dark:border-zinc-800">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 pt-2">{t.visibilityHeading}</p>
                  <label className="flex items-center gap-2.5 cursor-pointer select-none text-[13px] text-zinc-700 dark:text-zinc-300">
                    <input type="checkbox" checked={showNotes} onChange={e => setShowNotes(e.target.checked)} className="w-4 h-4 accent-blue-500" />
                    {t.showNotesLabel}
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer select-none text-[13px] text-zinc-700 dark:text-zinc-300">
                    <input type="checkbox" checked={showTerms} onChange={e => setShowTerms(e.target.checked)} className="w-4 h-4 accent-blue-500" />
                    {t.showTermsLabel}
                  </label>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 pb-4 pt-3 flex items-center justify-end gap-4 border-t border-zinc-100 dark:border-zinc-800">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              {t.cancel}
            </button>
            <button type="submit" disabled={isSubmitting || !name.trim()} className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-[5px] transition-colors disabled:opacity-50 shadow-sm">
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {t.saveChanges}
            </button>
          </div>
        </form>
      </div>

      <SignaturePadModal isOpen={isSignatureModalOpen} onClose={() => setIsSignatureModalOpen(false)} onSave={(dataUrl) => setSignatureUrl(dataUrl)} />
    </div>
  );
}
