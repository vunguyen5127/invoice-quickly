"use client";

import React, { useRef, useState, useEffect } from "react";
import { InvoiceState, InvoiceItem, CURRENCIES } from "@/types/invoice";
import { Plus, Trash2, Upload, X, PenTool, ChevronDown, ChevronUp, Building2, User, Calendar } from "lucide-react";
import { format, parseISO } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { SignaturePadModal } from "./signature-pad-modal";
import { useLanguage } from "@/contexts/language-context";
import { getUserCompanies } from "@/app/dashboard/actions";
import { supabase } from "@/utils/supabase/client";

interface InvoiceFormProps {
  invoice: InvoiceState;
  setInvoice: React.Dispatch<React.SetStateAction<InvoiceState>>;
  defaultCompanyId?: string;
}

export function InvoiceForm({ invoice, setInvoice, defaultCompanyId }: InvoiceFormProps) {
  const { t } = useLanguage();
  const [myCompanies, setMyCompanies] = useState<any[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(defaultCompanyId || "");

  useEffect(() => {
    const fetchCompanies = async () => {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      try {
        const companies = await getUserCompanies(session.access_token);
        setMyCompanies(companies);
      } catch (e) {
        console.error("Failed to fetch companies for auto-fill", e);
      }
    };
    fetchCompanies();
  }, []);

  const handleCompanyAutoFill = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    if (!selectedId) return;
    
    const comp = myCompanies.find(c => c.id === selectedId);
    if (comp) {
      const companyDetailsString = [comp.name, comp.address, comp.email, comp.phone]
        .filter(Boolean)
        .join(", ");

      setInvoice(prev => ({
        ...prev,
        company: {
           name: companyDetailsString,
           email: "",
           phone: "",
           address: "",
           logo: comp.logo_url || prev.company.logo,
        },
        signatureName: comp.signer_name || prev.signatureName,
        signature: comp.signature_url || prev.signature,
        currency: comp.default_currency || prev.currency,
        notes: comp.default_notes || prev.notes,
        terms: comp.default_terms || prev.terms,
        showNotes: comp.show_notes ?? true,
        showTerms: comp.show_terms ?? true,
        taxRate: comp.default_tax || 0,
        discount: comp.default_discount || 0,
      }));
    }
    setSelectedCompanyId(selectedId);
  };
  
  const handleSectionChange = (section: keyof InvoiceState, field: string, value: any) => {
    setInvoice((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value,
      },
    }));
  };

  const handleRootChange = (field: keyof InvoiceState, value: any) => {
    setInvoice((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    setInvoice((prev) => {
      const newItems = [...prev.items];
      const item = { ...newItems[index], [field]: value };
      
      // Auto-compose description if billing dates or description itself changes
      if (field === 'billingStart' || field === 'billingEnd') {
        const baseDesc = item.description.split(' — ')[0];
        if (item.billingStart && item.billingEnd) {
          try {
            const start = format(parseISO(item.billingStart), 'MMM dd, yyyy');
            const end = format(parseISO(item.billingEnd), 'MMM dd, yyyy');
            item.description = `${baseDesc} — ${start} ${t.to} ${end}`;
          } catch (e) {
            // Ignore invalid dates
          }
        }
      }
      
      newItems[index] = item;
      return { ...prev, items: newItems };
    });
  };

  const addItem = () => {
    setInvoice((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { id: uuidv4(), description: "", quantity: 1, rate: 0 },
      ],
    }));
  };

  const removeItem = (id: string) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const logoInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);

  // Accordion states
  const [isNotesOpen, setIsNotesOpen] = useState(true);
  const [isTermsOpen, setIsTermsOpen] = useState(true);
  const [isSignatureOpen, setIsSignatureOpen] = useState(false);

  // Sync accordion states with props when they change (e.g. after company data loads)
  useEffect(() => {
    setIsNotesOpen(invoice.showNotes);
  }, [invoice.showNotes]);

  useEffect(() => {
    setIsTermsOpen(invoice.showTerms);
  }, [invoice.showTerms]);

  const inputBaseClass = "w-full rounded-[5px] border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950/50 px-3 py-2 text-[14px] font-medium transition-all focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 hover:border-zinc-400 dark:hover:border-zinc-600 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400";
  const labelClass = "block text-[13px] font-medium text-zinc-600 dark:text-zinc-400 mb-1.5 hidden";
  
  const fieldsetClass = "relative w-full rounded-[5px] border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950/50 px-3 pb-2 pt-0 transition-all focus-within:border-blue-600 dark:focus-within:border-blue-500 focus-within:border-2 hover:border-zinc-400 dark:hover:border-zinc-600 group min-w-0";
  const legendClass = "text-[12px] font-medium text-zinc-500 dark:text-zinc-400 px-1 ml-[-4px] group-focus-within:text-blue-600 dark:group-focus-within:text-blue-500 transition-colors empty:hidden max-w-full block truncate";
  const inputInnerClass = "w-full bg-transparent text-[14px] font-medium text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none pr-6";

  const ClearBtn = ({ value, onClear }: { value: string; onClear: () => void }) => {
    if (!value) return null;
    return (
      <button
        type="button"
        onClick={onClear}
        className="absolute -top-2 right-1 z-10 w-5 h-5 flex items-center justify-center rounded-full bg-white dark:bg-zinc-900 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 border border-zinc-200 dark:border-zinc-700 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-sm"
        tabIndex={-1}
        aria-label="Clear"
      >
        <X className="w-3 h-3" />
      </button>
    );
  };

  const sectionClass = "relative";
  const sectionTitleClass = "text-[16px] font-bold tracking-tight text-zinc-900 dark:text-zinc-100 pb-3 mb-6 border-b border-zinc-100 dark:border-zinc-800/60";

  return (
    <div className="w-full flex flex-col gap-8">
      
      {/* Details Section */}
      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>{t.invoiceDetails}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <fieldset className={fieldsetClass}>
            <legend className={legendClass}>{t.invoiceNumber}</legend>
            <ClearBtn value={invoice.details.invoiceNumber} onClear={() => handleSectionChange('details', 'invoiceNumber', '')} />
            <input 
              type="text" 
              className={inputInnerClass} 
              value={invoice.details.invoiceNumber} 
              onChange={(e) => handleSectionChange('details', 'invoiceNumber', e.target.value)}
            />
          </fieldset>
          <fieldset className={fieldsetClass}>
            <legend className={legendClass}>{t.issueDate}</legend>
            <input 
              type="date" 
              className={inputInnerClass} 
              value={invoice.details.issueDate} 
              onChange={(e) => handleSectionChange('details', 'issueDate', e.target.value)}
            />
          </fieldset>
          <fieldset className={fieldsetClass}>
            <legend className={legendClass}>{t.dueDate}</legend>
            <input 
              type="date" 
              className={inputInnerClass} 
              value={invoice.details.dueDate} 
              onChange={(e) => handleSectionChange('details', 'dueDate', e.target.value)}
            />
          </fieldset>
        </div>
      </div>

      {/* Billing Information Section */}
      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>{t.billingInformation}</h3>

        <div className="flex flex-col gap-8">
          
          {/* From Section */}
          <div className="flex flex-col md:flex-row gap-6">
            
            {/* Left Column: Header + Text Area */}
            <div className="flex-1 flex flex-col">
              <div className="flex items-center mb-3 h-[32px]">
                <h4 className="text-[14px] font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-500" />
                  {t.fromYourDetails}
                </h4>
              </div>
              <fieldset className={`${fieldsetClass} flex-1`}>
                <legend className={legendClass}>{`${t.companyName}, ${t.yourAddress}, ${t.yourEmail}, ${t.companyPhone}`}</legend>
                <div className="w-full h-full flex flex-col">
                  <ClearBtn value={invoice.company.name} onClear={() => handleSectionChange('company', 'name', '')} />
                  <textarea 
                    placeholder={`${t.companyName}, ${t.yourAddress}, ${t.yourEmail}, ${t.companyPhone}`}
                    className={`${inputInnerClass} flex-1 resize-none h-[72px] mt-1 pr-6 leading-snug`} 
                    value={invoice.company.name} 
                    onChange={(e) => handleSectionChange('company', 'name', e.target.value)}
                    rows={3}
                  />
                </div>
              </fieldset>
            </div>

            {/* Right Column: Dropdown + Logo Upload */}
            <div className="w-full md:w-[130px] flex-shrink-0 flex flex-col gap-3">
              {myCompanies.length > 0 ? (
                <div className="h-[32px]">
                  <select 
                    value={selectedCompanyId}
                    onChange={handleCompanyAutoFill}
                    className="w-full h-full text-xs truncate bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-[5px] px-2.5 text-zinc-700 dark:text-zinc-300 outline-none transition-colors cursor-pointer shadow-sm appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2371717a'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1em 1em`, paddingRight: `1.5rem` }}
                  >
                    <option value="" disabled>{t.autoFillFrom}</option>
                    {myCompanies.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="h-[32px] hidden md:block" />
              )}
              
              <div className="w-[130px] h-[130px] ml-auto md:mx-0">
                {invoice.company.logo ? (
                  <div className="relative w-[130px] h-[130px] group transition-all">
                    <div className="w-full h-full rounded-[5px] border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 flex items-center justify-center p-0 shadow-sm overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={invoice.company.logo} alt="Logo" className="w-full h-full object-cover" />
                    </div>
                    <button 
                      onClick={() => handleSectionChange('company', 'logo', undefined)}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all shadow-md z-10"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={() => logoInputRef.current?.click()}
                    className="w-[130px] h-[130px] rounded-[5px] border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-400 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all bg-zinc-50 hover:bg-blue-50/50 dark:bg-zinc-900/50 dark:hover:bg-blue-900/20 text-zinc-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 overflow-hidden"
                  >
                    <div className="p-2.5 bg-white dark:bg-zinc-800 rounded-full shadow-sm border border-zinc-100 dark:border-zinc-700 group-hover:scale-110 transition-transform">
                      <Upload className="w-4 h-4" />
                    </div>
                    <div className="text-center mt-1">
                      <p className="text-[12px] font-medium leading-tight">{t.companyLogo}</p>
                      <p className="text-[10px] opacity-70 mt-1 uppercase tracking-wider font-semibold">{t.upload}</p>
                    </div>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={logoInputRef}
                  onChange={(e) => handleImageUpload(e, (base64) => handleSectionChange('company', 'logo', base64))}
                />
              </div>
            </div>
          </div>

          {/* Divider between From and To */}
          <div className="w-full h-px bg-zinc-100 dark:bg-zinc-800/60"></div>

          {/* To Section */}
          <div className="space-y-6">
            <h4 className="text-[14px] font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-500" />
              {t.toClientDetails}
            </h4>
            <div className="space-y-4">
              <fieldset className={fieldsetClass}>
                <legend className={legendClass}>{t.clientName}</legend>
                <ClearBtn value={invoice.client.name} onClear={() => handleSectionChange('client', 'name', '')} />
                <input 
                  type="text" 
                  placeholder={t.clientName}
                  className={inputInnerClass} 
                  value={invoice.client.name} 
                  onChange={(e) => handleSectionChange('client', 'name', e.target.value)}
                />
              </fieldset>
              <fieldset className={fieldsetClass}>
                <legend className={legendClass}>{t.clientEmail}</legend>
                <ClearBtn value={invoice.client.email} onClear={() => handleSectionChange('client', 'email', '')} />
                <input 
                  type="email" 
                  placeholder={t.clientEmail}
                  className={inputInnerClass} 
                  value={invoice.client.email} 
                  onChange={(e) => handleSectionChange('client', 'email', e.target.value)}
                />
              </fieldset>
              <fieldset className={fieldsetClass}>
                <legend className={legendClass}>{t.clientPhone}</legend>
                <ClearBtn value={invoice.client.phone} onClear={() => handleSectionChange('client', 'phone', '')} />
                <input 
                  type="text" 
                  placeholder={t.clientPhone}
                  className={inputInnerClass} 
                  value={invoice.client.phone} 
                  onChange={(e) => handleSectionChange('client', 'phone', e.target.value)}
                />
              </fieldset>
              <fieldset className={fieldsetClass}>
                <legend className={legendClass}>{t.clientAddress}</legend>
                <ClearBtn value={invoice.client.address} onClear={() => handleSectionChange('client', 'address', '')} />
                <textarea 
                  placeholder={t.clientAddress}
                  className={`${inputInnerClass} min-h-[70px] resize-y mt-1 pr-6`} 
                  value={invoice.client.address} 
                  onChange={(e) => handleSectionChange('client', 'address', e.target.value)}
                />
              </fieldset>
            </div>
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div className={sectionClass}>
        <div className="mb-6 border-b border-zinc-100 dark:border-zinc-800/60 pb-3">
          <h3 className="text-[16px] font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{t.lineItems}</h3>
        </div>
        
        {/* Header - Desktop Only */}
        <div className="hidden md:grid grid-cols-12 gap-4 pb-2 mb-2 px-4 text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          <div className="col-span-2">{t.qty}</div>
          <div className="col-span-6">{t.description}</div>
          <div className="col-span-3 text-right">{t.rate}</div>
          <div className="col-span-1"></div>
        </div>

        <div className="space-y-3">
          {invoice.items.map((item, index) => (
            <div 
              key={item.id} 
              className="relative grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-4 items-center p-4 bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200/60 dark:border-zinc-800/50 rounded-xl hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-white dark:hover:bg-zinc-900/50 transition-all group shadow-sm hover:shadow-md"
            >
              {/* Qty (with Stepper) */}
              <div className="md:col-span-2 order-2 md:order-1">
                <div className="flex flex-col gap-1">
                  <span className="md:hidden text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">{t.qty}</span>
                  <div className="flex items-center h-10 w-full md:w-24 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                    <button 
                      onClick={() => handleItemChange(index, "quantity", Math.max(1, item.quantity - 1))}
                      className="w-10 h-full flex items-center justify-center text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 border-r border-zinc-200 dark:border-zinc-800 transition-colors"
                    >
                      <span className="text-lg font-medium">−</span>
                    </button>
                    <input 
                      type="number" 
                      className="w-full h-full bg-transparent text-center text-sm font-bold text-zinc-900 dark:text-zinc-100 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, "quantity", Math.max(1, Number(e.target.value)))}
                      min="1"
                    />
                    <button 
                      onClick={() => handleItemChange(index, "quantity", item.quantity + 1)}
                      className="w-10 h-full flex items-center justify-center text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 border-l border-zinc-200 dark:border-zinc-800 transition-colors"
                    >
                      <span className="text-lg font-medium">+</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="md:col-span-6 order-1 md:order-2">
                <div className="flex flex-col gap-1">
                  <span className="md:hidden text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">{t.description}</span>
                  <div className="relative group/desc">
                    <input 
                      type="text" 
                      placeholder="e.g. Seller Growth Plan (Monthly)"
                      className="w-full h-10 px-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-medium text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      value={item.description}
                      maxLength={120}
                      onChange={(e) => handleItemChange(index, "description", e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addItem(); } }}
                    />
                    <div className="absolute top-[-18px] right-0 opacity-0 group-focus-within/desc:opacity-100 transition-opacity">
                      <span className={`text-[10px] font-bold ${item.description.length >= 110 ? 'text-amber-500' : 'text-zinc-400'}`}>
                        {item.description.length}/120
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amount (Unit Price) */}
              <div className="md:col-span-3 order-3">
                <div className="flex flex-col gap-1">
                  <span className="md:hidden text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">{t.rate}</span>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-zinc-400 text-sm font-medium">$</span>
                    <input 
                      type="number" 
                      placeholder="0.00"
                      className="w-full h-10 pl-7 pr-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-right text-sm font-bold text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      value={item.rate || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || /^\d*\.?\d{0,2}$/.test(val)) {
                          handleItemChange(index, "rate", val === '' ? 0 : Number(val));
                        }
                      }}
                      onBlur={(e) => handleItemChange(index, "rate", Number(Number(e.target.value).toFixed(2)))}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addItem(); } }}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>

              {/* Delete Icon */}
              <div className="md:col-span-1 order-4 flex justify-end md:justify-center items-center pt-2 md:pt-0">
                <button 
                  onClick={() => removeItem(item.id)}
                  className="p-2.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  aria-label="Remove item"
                  title="Remove item"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          ))}
          
          <button 
            type="button"
            onClick={addItem}
            className="w-full flex items-center justify-center gap-2 mt-4 py-3 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-[13px] font-semibold text-zinc-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all group shadow-sm hover:shadow"
          >
            <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" /> {t.addItem}
          </button>
        </div>
      </div>

      {/* Totals & Notes Setup */}
      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>{t.settings}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="space-y-4">
            <fieldset className={fieldsetClass}>
              <legend className={legendClass}>{t.currency}</legend>
              <select 
                className={`${inputInnerClass} py-0`}
                value={invoice.currency}
                onChange={(e) => handleRootChange("currency", e.target.value)}
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.symbol})
                  </option>
                ))}
              </select>
            </fieldset>
            
            <div className="grid grid-cols-2 gap-4">
              <fieldset className={fieldsetClass}>
                <legend className={legendClass}>{t.taxRate}</legend>
                <div className="flex relative">
                  <input 
                    type="number" 
                    placeholder="0"
                    className={`${inputInnerClass} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`} 
                    value={invoice.taxRate || ''} 
                    onChange={(e) => handleRootChange("taxRate", e.target.value === '' ? 0 : Number(e.target.value))}
                    onKeyDown={(e) => {
                      if (['e', 'E', '+', '-', '.'].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    min="0"
                    max="100"
                    step="1"
                  />
                  <div className="w-auto min-w-[50px] flex items-center justify-center text-[14px] font-medium text-zinc-900 dark:text-zinc-100 px-1 border-l border-zinc-200 dark:border-zinc-700 ml-2">
                    %
                  </div>
                </div>
              </fieldset>
              
              <fieldset className={fieldsetClass}>
                <legend className={legendClass}>{t.discount}</legend>
                <div className="flex relative">
                  <input 
                    type="number" 
                    placeholder="0"
                    className={`${inputInnerClass} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`} 
                    value={invoice.discount || ''} 
                    onChange={(e) => handleRootChange("discount", e.target.value === '' ? 0 : Number(e.target.value))}
                    onKeyDown={(e) => {
                      if (['e', 'E', '+', '-', '.'].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    min="0"
                  />
                  <select
                    className="w-auto min-w-[50px] bg-transparent outline-none text-[14px] font-medium text-zinc-900 dark:text-zinc-100 px-1 border-l border-zinc-200 dark:border-zinc-700 ml-2"
                    value={invoice.discountType}
                    onChange={(e) => handleRootChange("discountType", e.target.value as 'fixed' | 'percentage')}
                  >
                    <option value="percentage">%</option>
                    <option value="fixed">{CURRENCIES.find(c => c.code === invoice.currency)?.symbol || '$'}</option>
                  </select>
                </div>
              </fieldset>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {/* Notes Accordion */}
              <div className="border border-zinc-200/60 dark:border-zinc-800/60 rounded-[5px] overflow-hidden bg-white/50 dark:bg-zinc-950">
                <div className="w-full flex items-center justify-between p-3.5 bg-zinc-50/50 dark:bg-zinc-800/20">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <label className="flex items-center gap-2 cursor-pointer shrink-0" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="checkbox" 
                        checked={invoice.showNotes} 
                        onChange={(e) => handleRootChange("showNotes", e.target.checked)}
                        className="w-4 h-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </label>
                    <button 
                      type="button"
                      onClick={() => setIsNotesOpen(!isNotesOpen)} 
                      className="flex-1 text-left text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 truncate hover:text-blue-600 transition-colors"
                    >
                      {t.notes} {invoice.notes && !isNotesOpen && <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-medium">{t.addNotes}</span>}
                    </button>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setIsNotesOpen(!isNotesOpen)}
                    className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors"
                  >
                    {isNotesOpen ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                  </button>
                </div>
                {isNotesOpen && (
                  <div className="p-4 border-t border-zinc-200/60 dark:border-zinc-800/60 pt-6">
                    <fieldset className={fieldsetClass}>
                      <legend className={legendClass}>{t.notes}</legend>
                      <textarea 
                        className={`${inputInnerClass} min-h-[80px] resize-y mt-1`} 
                        value={invoice.notes} 
                        onChange={(e) => handleRootChange("notes", e.target.value)}
                        placeholder={t.notesPlaceholder}
                      />
                    </fieldset>
                  </div>
                )}
              </div>

            {/* Terms Accordion */}
              <div className="border border-zinc-200/60 dark:border-zinc-800/60 rounded-[5px] overflow-hidden bg-white/50 dark:bg-zinc-950">
                <div className="w-full flex items-center justify-between p-3.5 bg-zinc-50/50 dark:bg-zinc-800/20">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <label className="flex items-center gap-2 cursor-pointer shrink-0" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="checkbox" 
                        checked={invoice.showTerms} 
                        onChange={(e) => handleRootChange("showTerms", e.target.checked)}
                        className="w-4 h-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </label>
                    <button 
                      type="button"
                      onClick={() => setIsTermsOpen(!isTermsOpen)} 
                      className="flex-1 text-left text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 truncate hover:text-blue-600 transition-colors"
                    >
                      {t.termsConditions} {invoice.terms && !isTermsOpen && <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-medium">{t.addTerms}</span>}
                    </button>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setIsTermsOpen(!isTermsOpen)}
                    className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors"
                  >
                    {isTermsOpen ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                  </button>
                </div>
                {isTermsOpen && (
                  <div className="p-4 border-t border-zinc-200/60 dark:border-zinc-800/60 pt-6">
                    <fieldset className={fieldsetClass}>
                      <legend className={legendClass}>{t.termsConditions}</legend>
                      <textarea 
                        className={`${inputInnerClass} min-h-[80px] resize-y mt-1`} 
                        value={invoice.terms} 
                        onChange={(e) => handleRootChange("terms", e.target.value)}
                        placeholder={t.termsPlaceholder}
                      />
                    </fieldset>
                  </div>
                )}
              </div>

            {/* Signature Accordion */}
            <div className="border border-zinc-200/60 dark:border-zinc-800/60 rounded-[5px] overflow-hidden bg-white/50 dark:bg-zinc-950">
              <button 
                className="w-full flex items-center justify-between p-3.5 text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 bg-zinc-50/50 dark:bg-zinc-800/20 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/40 transition-colors"
                onClick={() => setIsSignatureOpen(!isSignatureOpen)}
              >
                {t.signature} {(invoice.signature || invoice.signatureName) && !isSignatureOpen && <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs">{t.addSignature}</span>}
                {isSignatureOpen ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
              </button>
              {isSignatureOpen && (
                <div className="p-4 border-t border-zinc-200/60 dark:border-zinc-800/60 space-y-4">
                  <div>
                    <div className="flex items-start gap-4">
                      {invoice.signature ? (
                        <div className="relative h-20 px-4 rounded-[5px] border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 flex items-center justify-center group shadow-sm transition-all min-w-[160px]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={invoice.signature} alt="Signature" className="max-w-full max-h-full object-contain dark:invert" />
                          <button 
                            onClick={() => {
                              setInvoice(prev => ({
                                ...prev,
                                signature: undefined,
                                signatureName: ""
                              }));
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div 
                            onClick={() => signatureInputRef.current?.click()}
                            className="flex-1 max-w-[160px] min-w-[80px] h-20 rounded-[5px] border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors bg-white hover:bg-blue-50 dark:bg-zinc-900/50 dark:hover:bg-blue-900/20 text-zinc-500 hover:text-blue-600"
                          >
                            <Upload className="w-5 h-5 flex-shrink-0" />
                            <span className="text-[10px] uppercase font-semibold tracking-wider truncate px-1 text-center w-full">{t.upload}</span>
                          </div>
                          
                          <div className="flex items-center justify-center text-sm font-medium text-zinc-400 flex-shrink-0">OR</div>

                          <div 
                            onClick={() => setIsSignatureModalOpen(true)}
                            className="flex-1 max-w-[160px] min-w-[80px] h-20 rounded-[5px] border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors bg-white hover:bg-blue-50 dark:bg-zinc-900/50 dark:hover:bg-blue-900/20 text-zinc-500 hover:text-blue-600"
                          >
                            <PenTool className="w-5 h-5 flex-shrink-0" />
                            <span className="text-[10px] uppercase font-semibold tracking-wider truncate px-1 text-center w-full">{t.draw}</span>
                          </div>
                        </div>
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        ref={signatureInputRef}
                        onChange={(e) => handleImageUpload(e, (base64) => handleRootChange("signature", base64))}
                      />
                    </div>
                  </div>

                  {invoice.signature && (
                    <div>
                      <fieldset className={fieldsetClass}>
                        <legend className={legendClass}>{t.printName}</legend>
                        <input 
                          type="text" 
                          className={`${inputInnerClass} pb-1`} 
                          value={invoice.signatureName || ''} 
                          onChange={(e) => handleRootChange('signatureName', e.target.value)}
                          placeholder="e.g., John Doe"
                        />
                      </fieldset>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
      
      <SignaturePadModal 
        isOpen={isSignatureModalOpen} 
        onClose={() => setIsSignatureModalOpen(false)} 
        onSave={(base64) => handleRootChange("signature", base64)} 
      />

    </div>
  );
}
