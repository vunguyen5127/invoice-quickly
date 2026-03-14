"use client";

import React, { useRef, useState, useEffect } from "react";
import { InvoiceState, InvoiceItem, CURRENCIES } from "@/types/invoice";
import { Plus, Trash2, Upload, X, Package, PenTool, ChevronDown, ChevronUp, Building2, User, Calendar, Settings, RefreshCw } from "lucide-react";
import { format, parseISO } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { SignaturePadModal } from "./signature-pad-modal";
import { useLanguage } from "@/contexts/language-context";
import { getUserCompanies } from "@/app/dashboard/actions";
import { supabase } from "@/utils/supabase/client";
import { Tooltip } from "./tooltip";

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
        const result = await getUserCompanies(session.access_token);
        setMyCompanies(result.data || []);
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
                    className={`${inputInnerClass} flex-1 resize-none h-[52px] mt-1 pr-6 leading-snug`} 
                    value={invoice.company.name} 
                    onChange={(e) => handleSectionChange('company', 'name', e.target.value)}
                    rows={2}
                  />
                </div>
              </fieldset>
            </div>

            {/* Right Column: Dropdown + Logo Upload */}
            <div className="w-full md:w-[100px] flex-shrink-0 flex flex-col gap-3">
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
              
              <div className="w-[100px] h-[100px] ml-auto md:mx-0">
                {invoice.company.logo ? (
                  <div className="relative w-[100px] h-[100px] group transition-all">
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
                    className="w-[100px] h-[100px] rounded-[5px] border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-400 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all bg-zinc-50 hover:bg-blue-50/50 dark:bg-zinc-900/50 dark:hover:bg-blue-900/20 text-zinc-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 overflow-hidden"
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


          {/* To Section */}
          <div className="space-y-6">
            <h4 className="text-[14px] font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-500" />
              {t.toClientDetails}
            </h4>
            <div className="space-y-4">
              <fieldset className={fieldsetClass}>
                <legend className={legendClass}>{`${t.clientName}, ${t.clientAddress}, ${t.clientEmail}, ${t.clientPhone}`}</legend>
                <div className="w-full h-full flex flex-col">
                  <ClearBtn value={invoice.client.name} onClear={() => handleSectionChange('client', 'name', '')} />
                  <textarea 
                    placeholder={`${t.clientName}, ${t.clientAddress}, ${t.clientEmail}, ${t.clientPhone}`}
                    className={`${inputInnerClass} resize-y h-[52px] min-h-[52px] mt-1 pr-6 leading-relaxed overflow-y-auto`} 
                    value={invoice.client.name} 
                    onChange={(e) => handleSectionChange('client', 'name', e.target.value)}
                    rows={2}
                  />
                </div>
              </fieldset>
              
              <fieldset className={fieldsetClass}>
                <legend className={legendClass}>{`${t.shipTo} ${t.clientPhone.includes('(') ? t.clientPhone.match(/\(.*\)/)?.[0] || '(Optional)' : '(Optional)'}`}</legend>
                <ClearBtn value={invoice.client.shipTo || ""} onClear={() => handleSectionChange('client', 'shipTo', '')} />
                <textarea 
                  className={`${inputInnerClass} resize-y h-[52px] min-h-[52px] mt-1 pr-6 leading-relaxed overflow-y-auto`} 
                  value={invoice.client.shipTo || ""} 
                  onChange={(e) => handleSectionChange('client', 'shipTo', e.target.value)}
                  rows={2}
                />
              </fieldset>
            </div>
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <div className="mb-6">
          <h3 className="text-[16px] font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-500" />
            {t.lineItems}
          </h3>
        </div>
        
        <div className="w-full">
          <div className="w-full">
            {/* Header - Hidden on Mobile */}
            <div className="hidden md:grid grid-cols-24 gap-[1px] py-2 text-[12px] font-bold text-zinc-900 bg-zinc-100 dark:bg-zinc-800/50 rounded-[5px] items-center mb-[1px] pr-8 uppercase tracking-wider">
              <div className="col-span-16 pl-5">{t.description}</div>
              <div className="col-span-3 text-center">{t.qty}</div>
              <div className="col-span-5 text-center">{t.rate}</div>
            </div>

            <div className="space-y-[1px]">
              {invoice.items.map((item, index) => (
                <div 
                  key={item.id} 
                  className="relative flex flex-col md:grid md:grid-cols-24 gap-3 md:gap-[1px] items-start md:items-center group p-4 md:p-0 md:pr-8 bg-zinc-50/50 md:bg-transparent rounded-xl md:rounded-none border md:border-none border-zinc-200/60 dark:border-zinc-800/60 mb-3 md:mb-0 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900/40"
                >
                  {/* Item Label for Mobile */}
                  <div className="md:hidden text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">{t.description}</div>
                  
                  {/* Description (Item) Boxed */}
                  <div className="w-full md:col-span-16">
                    <input 
                      type="text" 
                      placeholder={t.itemDescription}
                      className="w-full h-11 pl-4 md:pl-5 pr-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[8px] md:rounded-[5px] text-[14px] font-medium text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans shadow-sm"
                      value={item.description}
                      maxLength={120}
                      onChange={(e) => handleItemChange(index, "description", e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addItem(); } }}
                    />
                  </div>

                  <div className="flex gap-3 w-full md:contents">
                    {/* Qty (Quantity) Boxed */}
                    <div className="flex-1 md:col-span-3">
                      <div className="md:hidden text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1 mb-1">{t.qty}</div>
                      <input 
                        type="number" 
                        className="w-full h-11 px-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[8px] md:rounded-[5px] text-center text-[14px] font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none font-sans shadow-sm transition-all"
                        value={item.quantity}
                        min="0"
                        onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))}
                        onKeyDown={(e) => ["-", "+", "e"].includes(e.key) && e.preventDefault()}
                      />
                    </div>

                    {/* Rate Boxed */}
                    <div className="flex-[2] md:col-span-5">
                      <div className="md:hidden text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1 mb-1">{t.rate}</div>
                      <input 
                        type="number" 
                        placeholder="0.00"
                        className="w-full h-11 px-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[8px] md:rounded-[5px] text-left text-[14px] font-medium text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none font-sans shadow-sm"
                        value={item.rate || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '' || /^\d*\.?\d{0,2}$/.test(val)) {
                            handleItemChange(index, "rate", val === '' ? 0 : Number(val));
                          }
                        }}
                        onBlur={(e) => handleItemChange(index, "rate", Number(Number(e.target.value).toFixed(2)))}
                        min="0"
                        onKeyDown={(e) => ["-", "+", "e"].includes(e.key) && e.preventDefault()}
                        step="0.01"
                      />
                    </div>
                  </div>

                  {/* Delete Icon - absolute on desktop, positioned in card for mobile */}
                  <div className="absolute right-2 top-2 md:-right-2 md:top-1/2 md:-translate-y-1/2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all z-10">
                    <Tooltip content="Remove item" position="left">
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-zinc-400 hover:text-red-500 transition-all focus:opacity-100"
                        aria-label="Remove item"
                      >
                        <X className="w-5 h-5 border border-zinc-200 dark:border-zinc-700/50 rounded-full p-1 shadow-sm bg-white dark:bg-zinc-800" />
                      </button>
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button 
            type="button"
            onClick={addItem}
            className="w-fit flex items-center justify-center gap-2 mt-6 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[14px] font-bold shadow-sm shadow-emerald-200 dark:shadow-none transition-all active:scale-[0.98] group"
          >
            <Plus className="w-4 h-4 text-white" /> {t.addItem}
          </button>
        </div>
      </div>

      <div className={sectionClass}>
        <h3 className="text-[16px] font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-5 flex items-center gap-2">
          <Settings className="w-4 h-4 text-blue-500" />
          {t.settings}
        </h3>
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
            
            <div className="flex flex-col gap-3">
              {/* Discount */}
              <div className="grid grid-cols-2 gap-[2px] items-center">
                <div className="h-11 border border-transparent hover:border-zinc-200/50 focus-within:border-blue-500 dark:border-zinc-800 rounded-[5px] bg-white dark:bg-zinc-950 flex items-center px-4 transition-all">
                  <input 
                    className="w-full bg-transparent border-none outline-none text-[14px] font-medium text-zinc-500 text-right focus:ring-0 p-0"
                    value={invoice.discountLabel || t.discount}
                    onChange={(e) => handleRootChange("discountLabel", e.target.value)}
                    placeholder={t.discount}
                  />
                </div>
                <div className="h-11 border border-zinc-200 dark:border-zinc-800 rounded-[5px] bg-white dark:bg-zinc-950 flex items-center focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                  <input 
                    type="number" 
                    placeholder="0"
                    className="flex-1 min-w-0 bg-transparent pl-4 pr-1 text-center text-[15px] font-bold text-zinc-900 dark:text-zinc-100 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                    value={invoice.discount || ''}
                    onChange={(e) => handleRootChange("discount", Math.max(0, e.target.value === '' ? 0 : Number(e.target.value)))}
                    min="0"
                    onKeyDown={(e) => ["-", "+", "e"].includes(e.key) && e.preventDefault()}
                  />
                  <div className="flex-shrink-0 w-16 h-full border-l border-zinc-200 dark:border-zinc-800">
                    <button
                      type="button"
                      onClick={() => handleRootChange("discountType", invoice.discountType === 'percentage' ? 'fixed' : 'percentage')}
                      className="w-full h-full px-4 flex items-center justify-between text-zinc-400 hover:text-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all"
                    >
                      <span className="text-[14px] font-bold text-zinc-500">
                        {invoice.discountType === 'percentage' ? '%' : (CURRENCIES.find(c => c.code === invoice.currency)?.symbol || '$')}
                      </span>
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Tax */}
              <div className="grid grid-cols-2 gap-[2px] items-center">
                <div className="h-11 border border-transparent hover:border-zinc-200/50 focus-within:border-blue-500 dark:border-zinc-800 rounded-[5px] bg-white dark:bg-zinc-950 flex items-center px-4 transition-all">
                  <input 
                    className="w-full bg-transparent border-none outline-none text-[14px] font-medium text-zinc-500 text-right focus:ring-0 p-0"
                    value={invoice.taxLabel || t.tax}
                    onChange={(e) => handleRootChange("taxLabel", e.target.value)}
                    placeholder={t.tax}
                  />
                </div>
                <div className="h-11 border border-zinc-200 dark:border-zinc-800 rounded-[5px] bg-white dark:bg-zinc-950 flex items-center focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                  <input 
                    type="number" 
                    placeholder="0"
                    className="flex-1 min-w-0 bg-transparent pl-4 pr-1 text-center text-[15px] font-bold text-zinc-900 dark:text-zinc-100 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                    value={invoice.taxRate || ''}
                    onChange={(e) => handleRootChange("taxRate", Math.max(0, e.target.value === '' ? 0 : Number(e.target.value)))}
                    min="0"
                    onKeyDown={(e) => ["-", "+", "e"].includes(e.key) && e.preventDefault()}
                  />
                  <div className="flex-shrink-0 w-16 h-full border-l border-zinc-200 dark:border-zinc-800">
                    <button
                      type="button"
                      onClick={() => handleRootChange("taxType", invoice.taxType === 'percentage' ? 'fixed' : 'percentage')}
                      className="w-full h-full px-4 flex items-center justify-between text-zinc-400 hover:text-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all"
                    >
                      <span className="text-[14px] font-bold text-zinc-500">
                        {invoice.taxType === 'percentage' ? '%' : (CURRENCIES.find(c => c.code === invoice.currency)?.symbol || '$')}
                      </span>
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Shipping */}
              <div className="grid grid-cols-2 gap-[2px] items-center">
                <div className="h-11 border border-transparent hover:border-zinc-200/50 focus-within:border-blue-500 dark:border-zinc-800 rounded-[5px] bg-white dark:bg-zinc-950 flex items-center px-4 transition-all">
                  <input 
                    className="w-full bg-transparent border-none outline-none text-[14px] font-medium text-zinc-500 text-right focus:ring-0 p-0"
                    value={invoice.shippingLabel || t.shipping}
                    onChange={(e) => handleRootChange("shippingLabel", e.target.value)}
                    placeholder={t.shipping}
                  />
                </div>
                <div className="h-11 border border-zinc-200 dark:border-zinc-800 rounded-[5px] bg-white dark:bg-zinc-950 flex items-center focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                  <input 
                    type="number" 
                    placeholder="0"
                    className="flex-1 min-w-0 bg-transparent pl-4 pr-1 text-center text-[15px] font-bold text-zinc-900 dark:text-zinc-100 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                    value={invoice.shipping || ''}
                    onChange={(e) => handleRootChange("shipping", Math.max(0, e.target.value === '' ? 0 : Number(e.target.value)))}
                    min="0"
                    onKeyDown={(e) => ["-", "+", "e"].includes(e.key) && e.preventDefault()}
                  />
                  <div className="flex-shrink-0 w-16 h-full border-l border-zinc-200 dark:border-zinc-800 px-3 flex items-center justify-center text-[14px] font-bold text-zinc-500/50 select-none">
                    {CURRENCIES.find(c => c.code === invoice.currency)?.symbol || '$'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {/* Notes Accordion */}
              <div className="border border-zinc-200/60 dark:border-zinc-800/60 rounded-[5px] overflow-hidden bg-white/50 dark:bg-zinc-950">
                <div className="w-full h-11 flex items-center justify-between px-3.5 bg-zinc-50/50 dark:bg-zinc-800/20">
                  <div className="flex items-center gap-3 flex-1 min-w-0 h-full">
                    <label className="flex items-center gap-2 cursor-pointer shrink-0 h-full" onClick={(e) => e.stopPropagation()}>
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
                      className="flex-1 h-full text-left text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 truncate hover:text-blue-600 transition-colors"
                    >
                      {t.notes} {invoice.notes && !isNotesOpen && <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-medium">{t.addNotes}</span>}
                    </button>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setIsNotesOpen(!isNotesOpen)}
                    className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-[5px] transition-colors"
                  >
                    {isNotesOpen ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                  </button>
                </div>
                {isNotesOpen && (
                  <div className="p-4 border-t border-zinc-200/60 dark:border-zinc-800/60 pt-6">
                    <fieldset className={fieldsetClass}>
                      <legend className={legendClass}>{t.notes}</legend>
                      <textarea 
                        className={`${inputInnerClass} h-[52px] min-h-[52px] overflow-y-auto resize-none mt-1`} 
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
                <div className="w-full h-11 flex items-center justify-between px-3.5 bg-zinc-50/50 dark:bg-zinc-800/20">
                  <div className="flex items-center gap-3 flex-1 min-w-0 h-full">
                    <label className="flex items-center gap-2 cursor-pointer shrink-0 h-full" onClick={(e) => e.stopPropagation()}>
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
                      className="flex-1 h-full text-left text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 truncate hover:text-blue-600 transition-colors"
                    >
                      {t.termsConditions} {invoice.terms && !isTermsOpen && <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-medium">{t.addTerms}</span>}
                    </button>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setIsTermsOpen(!isTermsOpen)}
                    className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-[5px] transition-colors"
                  >
                    {isTermsOpen ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                  </button>
                </div>
                {isTermsOpen && (
                  <div className="p-4 border-t border-zinc-200/60 dark:border-zinc-800/60 pt-6">
                    <fieldset className={fieldsetClass}>
                      <legend className={legendClass}>{t.termsConditions}</legend>
                      <textarea 
                        className={`${inputInnerClass} h-[52px] min-h-[52px] overflow-y-auto resize-none mt-1`} 
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
                className="w-full h-11 flex items-center justify-between px-3.5 text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 bg-zinc-50/50 dark:bg-zinc-800/20 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/40 transition-colors rounded-[5px]"
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
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-[5px] p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 w-full">
                          <div 
                            onClick={() => signatureInputRef.current?.click()}
                            className="flex-1 h-20 rounded-[5px] border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors bg-white hover:bg-blue-50 dark:bg-zinc-900/50 dark:hover:bg-blue-900/20 text-zinc-500 hover:text-blue-600"
                          >
                            <Upload className="w-5 h-5 flex-shrink-0" />
                            <span className="text-[10px] uppercase font-semibold tracking-wider truncate px-1 text-center w-full">{t.upload}</span>
                          </div>
                          
                          <div className="flex items-center justify-center text-sm font-medium text-zinc-400 flex-shrink-0">OR</div>

                          <div 
                            onClick={() => setIsSignatureModalOpen(true)}
                            className="flex-1 h-20 rounded-[5px] border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors bg-white hover:bg-blue-50 dark:bg-zinc-900/50 dark:hover:bg-blue-900/20 text-zinc-500 hover:text-blue-600"
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
