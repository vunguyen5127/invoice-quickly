"use client";

import React, { useState } from "react";
import { createCompany } from "@/app/dashboard/actions";
import { X, Loader2, Upload, Building2, Plus, PenTool } from "lucide-react";
import { SignaturePadModal } from "./signature-pad-modal";
import { CURRENCIES } from "@/types/invoice";
import { useLanguage } from "@/contexts/language-context";

interface CreateCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newCompany: any) => void;
}

export function CreateCompanyModal({ isOpen, onClose, onSuccess }: CreateCompanyModalProps) {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [logo, setLogo] = useState<string | undefined>(undefined);
  const [signerName, setSignerName] = useState("");
  const [signatureUrl, setSignatureUrl] = useState<string | undefined>(undefined);
  const [defaultCurrency, setDefaultCurrency] = useState("USD");
  const [defaultTax, setDefaultTax] = useState(0);
  const [defaultDiscount, setDefaultDiscount] = useState(0);
  const [isValidPhone, setIsValidPhone] = useState(true);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const logoInputRef = React.useRef<HTMLInputElement>(null);

  const fieldsetClass = "w-full rounded-[5px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 pb-2 pt-0 transition-all focus-within:border-blue-500 dark:focus-within:border-blue-500 hover:border-zinc-300 dark:hover:border-zinc-700 group";
  const legendClass = "text-[12px] font-medium text-zinc-500 dark:text-zinc-400 px-1 ml-[-4px] group-focus-within:text-blue-600 dark:group-focus-within:text-blue-500 transition-colors empty:hidden";
  const inputInnerClass = "w-full bg-transparent text-[14px] font-medium text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none";

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Basic phone validation: allow empty OR require basic digits/plus/space/dash
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    const isPhoneValid = !phone || phoneRegex.test(phone.replace(/\s/g, ''));
    setIsValidPhone(isPhoneValid);
    if (!isPhoneValid) return;

    setIsSubmitting(true);
    const newCompany = await createCompany({ name, email, address, phone, logo, signatureUrl, signerName, defaultCurrency, defaultTax, defaultDiscount });
    setIsSubmitting(false);

    if (newCompany) {
      onSuccess(newCompany);
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setLogo(undefined);
      setSignerName("");
      setSignatureUrl(undefined);
      setDefaultTax(0);
      setDefaultDiscount(0);
      onClose();
    } else {
      alert("Failed to create company. Please try again.");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 rounded-[5px] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 pt-6 pb-2 flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
            <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-500" />
            {t.addNewCompany}
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex gap-4 items-start">
            <div className="flex-1 space-y-4">
              <fieldset className={fieldsetClass}>
                <legend className={legendClass}>{t.companyNameField} <span className="text-red-500">*</span></legend>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputInnerClass}
                  placeholder="Acme Corp"
                />
              </fieldset>

              <fieldset className={fieldsetClass}>
                <legend className={legendClass}>{t.billingEmailField}</legend>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputInnerClass}
                  placeholder="billing@acme.com"
                />
              </fieldset>
                            <fieldset className={`${fieldsetClass} ${!isValidPhone ? 'border-red-500 dark:border-red-500' : ''}`}>
                  <legend className={`${legendClass} ${!isValidPhone ? 'text-red-500' : ''}`}>{t.phoneField}</legend>
                  <input
                    id="phone"
                    type="text"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setIsValidPhone(true);
                    }}
                    className={inputInnerClass}
                    placeholder="+1 (555) 000-0000"
                  />
                </fieldset>

                <fieldset className={fieldsetClass}>
                  <legend className={legendClass}>{t.currency}</legend>
                  <select 
                    value={defaultCurrency} 
                    onChange={e => setDefaultCurrency(e.target.value)} 
                    className={`${inputInnerClass} py-0.5 bg-transparent`}
                  >
                    {CURRENCIES.map(c => (
                      <option key={c.code} value={c.code} className="bg-white dark:bg-zinc-900">
                        {c.code} ({c.symbol})
                      </option>
                    ))}
                  </select>
                </fieldset>

                <div className="grid grid-cols-2 gap-4">
                  <fieldset className={fieldsetClass}>
                    <legend className={legendClass}>{t.taxRate} (%)</legend>
                    <input 
                      type="number" 
                      value={defaultTax || ''} 
                      onChange={e => setDefaultTax(Number(e.target.value))} 
                      className={inputInnerClass} 
                      placeholder="0" 
                    />
                  </fieldset>
                  <fieldset className={fieldsetClass}>
                    <legend className={legendClass}>{t.discount}</legend>
                    <input 
                      type="number" 
                      value={defaultDiscount || ''} 
                      onChange={e => setDefaultDiscount(Number(e.target.value))} 
                      className={inputInnerClass} 
                      placeholder="0" 
                    />
                  </fieldset>
                </div>
            </div>

            {/* Square Logo Upload */}
            <div className="w-[136px] flex-shrink-0 relative mt-2">
              <span className="absolute -top-[20px] left-1 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                {t.companyLogoField || "Company Logo"}
              </span>
              {logo ? (
                <div className="relative w-full h-[132px] group transition-all">
                  <div className="w-full h-full rounded-[5px] border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950/50 flex items-center justify-center p-0 shadow-sm overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logo} alt="Logo" className="w-full h-full object-cover" />
                  </div>
                  <button 
                    type="button"
                    onClick={() => setLogo(undefined)}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all shadow-md z-10"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => logoInputRef.current?.click()}
                  className="w-full h-[132px] rounded-[5px] border border-zinc-200 dark:border-zinc-700 flex flex-col items-center justify-center cursor-pointer transition-all bg-white hover:bg-blue-50/50 dark:bg-zinc-900 shadow-sm"
                >
                  <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white shadow-sm hover:scale-105 transition-transform">
                    <Building2 className="w-7 h-7" />
                  </div>
                </div>
              )}
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={logoInputRef}
                onChange={handleImageUpload}
              />
            </div>
          </div>

          <fieldset className={fieldsetClass}>
            <legend className={legendClass}>{t.addressField}</legend>
            <textarea
              id="address"
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={`${inputInnerClass} resize-none mt-1`}
              placeholder="123 Business St, City, Country"
            />
          </fieldset>

          <div className="flex gap-4">
            <div className="flex-1 space-y-4">
              <div className="w-full">
                <label className="block text-[13px] font-medium text-zinc-700 dark:text-zinc-300 mb-2 px-1">
                  Signature
                </label>
                {signatureUrl ? (
                  <div className="relative h-20 rounded-[5px] border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 flex items-center justify-center p-1 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={signatureUrl} alt="Signature" className="max-h-full object-contain mix-blend-multiply dark:mix-blend-normal dark:invert" />
                    <button 
                      type="button"
                      onClick={() => setSignatureUrl(undefined)}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => document.getElementById('signature-upload-create')?.click()}
                      className="flex-1 h-20 rounded-[5px] border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors bg-white hover:bg-blue-50 dark:bg-zinc-900/50 dark:hover:bg-blue-900/20 text-zinc-500 hover:text-blue-600"
                    >
                      <Upload className="w-5 h-5 flex-shrink-0 text-blue-500" />
                      <span className="text-[10px] uppercase font-semibold tracking-wider px-1 text-center w-full">Upload</span>
                    </button>
                    
                    <div className="flex items-center justify-center text-sm font-medium text-zinc-400 flex-shrink-0">OR</div>

                    <button
                      type="button"
                      onClick={() => setIsSignatureModalOpen(true)}
                      className="flex-1 h-20 rounded-[5px] border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors bg-white hover:bg-blue-50 dark:bg-zinc-900/50 dark:hover:bg-blue-900/20 text-zinc-500 hover:text-blue-600"
                    >
                      <PenTool className="w-5 h-5 flex-shrink-0 text-blue-500" />
                      <span className="text-[10px] uppercase font-semibold tracking-wider px-1 text-center w-full">Draw</span>
                    </button>
                    <input 
                      id="signature-upload-create"
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 2 * 1024 * 1024) {
                            alert("Image must be less than 2MB");
                            return;
                          }
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setSignatureUrl(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                )}
              </div>
              
              <fieldset className={fieldsetClass}>
                <legend className={legendClass}>Signer Name</legend>
                <input
                  id="signerName"
                  type="text"
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  className={inputInnerClass}
                  placeholder="John Doe"
                />
              </fieldset>
            </div>
            {/* Empty right column to constrain width matching logo area */}
            <div className="w-28 flex-shrink-0 hidden sm:block"></div>
          </div>

          <div className="pt-6 pb-2 flex items-center justify-center sm:justify-end gap-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-base font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-base font-medium text-white bg-blue-400 hover:bg-blue-500 rounded-[5px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {t.createCompanyBtn}
            </button>
          </div>
        </form>
      </div>
      
      <SignaturePadModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        onSave={(dataUrl) => setSignatureUrl(dataUrl)}
      />
    </div>
  );
}
