"use client";

import React, { useRef, useState, useEffect } from "react";
import { InvoiceState, InvoiceItem, CURRENCIES, RecurringInterval } from "@/types/invoice";
import { Plus, Upload, X, Package, PenTool, ChevronDown, ChevronUp, Building2, User, Calendar, Settings, RefreshCw, Repeat2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { SignaturePadModal } from "./signature-pad-modal";
import { useLanguage } from "@/contexts/language-context";
import { getUserCompanies, getNextInvoiceNumber } from "@/app/dashboard/actions";
import { getItems } from "@/app/dashboard/items/actions";
import { supabase } from "@/utils/supabase/client";
import { Tooltip } from "./tooltip";
import { convertToWebP } from "@/utils/image-utils";
import { SavedItem } from "@/types/item";

interface InvoiceFormProps {
  invoice: any;
  setInvoice: React.Dispatch<React.SetStateAction<any>>;
  defaultCompanyId?: string;
  canUseRecurring?: boolean;
  onShowUpgrade?: () => void;
  docType?: 'invoice' | 'quote';
  onCompanySelect?: (companyId: string) => void;
}

export function InvoiceForm({ invoice, setInvoice, defaultCompanyId, canUseRecurring = false, onShowUpgrade, docType = 'invoice', onCompanySelect }: InvoiceFormProps) {
  const { t } = useLanguage();
  const [myCompanies, setMyCompanies] = useState<any[]>([]);
  const [myItems, setMyItems] = useState<SavedItem[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(defaultCompanyId || "");
  const [focusedItemIndex, setFocusedItemIndex] = useState<number | null>(null);

  useEffect(() => {
    if (defaultCompanyId) {
      setSelectedCompanyId(defaultCompanyId);
    }
  }, [defaultCompanyId]);

  const applyCompanyData = async (selectedId: string, availableCompanies: any[]) => {
    if (!selectedId) return;
    
    const comp = availableCompanies.find(c => c.id === selectedId);
    if (comp) {
      const details = [];
      if (comp.name) details.push(comp.name);
      if (comp.address) details.push(comp.address);
      if (comp.email) details.push(comp.email);
      if (comp.phone) details.push(comp.phone);
      
      const companyDetailsString = details.filter(Boolean).join(", ");

      let fetchedNextInvNum: string | null = null;
      try {
        if (docType === 'invoice' && supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            fetchedNextInvNum = await getNextInvoiceNumber(session.access_token, selectedId);
          }
        }
      } catch (e) {
        console.error("Failed to fetch next invoice number", e);
      }

      setInvoice((prev: any) => ({
        ...prev,
        details: {
          ...prev.details,
          invoiceNumber: fetchedNextInvNum || prev.details.invoiceNumber
        },
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
    if (onCompanySelect) onCompanySelect(selectedId);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      try {
        const [companiesResult, itemsResult] = await Promise.all([
          getUserCompanies(session.access_token),
          getItems(session.access_token, { pageSize: 50 })
        ]);
        const fetchedCompanies = companiesResult.data || [];
        setMyCompanies(fetchedCompanies);
        setMyItems(itemsResult.data || []);
      } catch (e) {
        console.error("Failed to fetch data for auto-fill", e);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCompanyAutoFill = (e: React.ChangeEvent<HTMLSelectElement>) => {
    applyCompanyData(e.target.value, myCompanies);
  };
  
  const handleSectionChange = (section: keyof InvoiceState, field: string, value: any) => {
    setInvoice((prev: any) => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value,
      },
    }));
  };

  const handleRootChange = (field: keyof InvoiceState, value: any) => {
    setInvoice((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    setInvoice((prev: any) => {
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

  const MAX_ITEMS = 100;

  const addItem = () => {
    if (invoice.items.length >= MAX_ITEMS) return;
    setInvoice((prev: any) => ({
      ...prev,
      items: [
        ...prev.items,
        { id: uuidv4(), description: "", quantity: 1, rate: 0 },
      ],
    }));
  };

  const removeItem = (id: string) => {
    setInvoice((prev: any) => ({
      ...prev,
      items: prev.items.filter((item: any) => item.id !== id),
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (webp: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const webpDataUrl = await convertToWebP(file);
      callback(webpDataUrl);
    } catch (error) {
      console.error("Failed to convert image to WebP", error);
      // Fallback to original reader if conversion fails
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const logoInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);

  // Recurring accordion state
  const [isRecurringOpen, setIsRecurringOpen] = useState(false);

  // Compute next invoice date based on issueDate + interval
  const computeNextDate = (issueDate: string, interval: RecurringInterval): string => {
    const d = new Date(issueDate || new Date().toISOString().split('T')[0]);
    switch (interval) {
      case 'weekly':    d.setDate(d.getDate() + 7); break;
      case 'monthly':   d.setMonth(d.getMonth() + 1); break;
      case 'quarterly': d.setMonth(d.getMonth() + 3); break;
      case 'yearly':    d.setFullYear(d.getFullYear() + 1); break;
    }
    return d.toISOString().split('T')[0];
  };

  const handleRecurringToggle = (checked: boolean) => {
    if (checked && !canUseRecurring) {
      onShowUpgrade?.();
      return;
    }
    const interval = invoice.recurringInterval || 'monthly';
    setInvoice((prev: any) => ({
      ...prev,
      isRecurring: checked,
      recurringInterval: checked ? interval : undefined,
      nextInvoiceDate: checked
        ? computeNextDate(prev.details.issueDate, interval)
        : undefined,
    }));
    if (checked) setIsRecurringOpen(true);
  };

  const handleIntervalChange = (interval: RecurringInterval) => {
    setInvoice((prev: any) => ({
      ...prev,
      recurringInterval: interval,
      // Only update nextInvoiceDate if recurring is actually enabled
      ...(prev.isRecurring ? { nextInvoiceDate: computeNextDate(prev.details.issueDate, interval) } : {}),
    }));
  };

  const INTERVAL_OPTIONS: { value: RecurringInterval; label: string }[] = [
    { value: 'weekly',    label: 'Weekly' },
    { value: 'monthly',   label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly',    label: 'Yearly' },
  ];

  const formatNextDate = (date: string) => {
    try { return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }); }
    catch { return date; }
  };
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

  const inputBaseClass = "w-full rounded-xl border border-border bg-background px-3 py-2 text-[14px] font-normal transition-all duration-300 focus:outline-none focus:border-primary/50 hover:border-zinc-300 dark:hover:border-zinc-700 text-foreground placeholder:text-zinc-400 shadow-sm";
  const labelClass = "block text-[13px] font-medium text-zinc-600 dark:text-zinc-400 mb-1.5 hidden";
  
  const fieldsetBaseClass = "relative w-full rounded-xl border bg-white/70 dark:bg-zinc-900/40 backdrop-blur-md px-3 pb-2 pt-0 transition-all duration-300 focus-within:border-primary/50 hover:border-zinc-300 dark:hover:border-zinc-700 group min-w-0 shadow-sm hover:shadow-md";
  const fieldsetBorderDefault = "border-border";
  const fieldsetBorderRequired = "border-destructive/40 bg-destructive/5 dark:bg-destructive/10";
  const legendClass = "text-[12px] font-medium text-zinc-500 dark:text-zinc-500 px-1 ml-[-4px] group-focus-within:text-primary transition-colors empty:hidden max-w-full block truncate text-slate-400";
  const inputInnerClass = "w-full bg-transparent text-[14px] font-normal text-foreground placeholder:text-zinc-400 focus:outline-none pr-6";

  const ClearBtn = ({ value, onClear }: { value: string; onClear: () => void }) => {
    if (!value) return null;
    return (
      <button
        type="button"
        onClick={onClear}
        className="absolute -top-2 right-1 z-10 w-5 h-5 flex items-center justify-center rounded-full bg-white dark:bg-zinc-900 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 border border-zinc-200 dark:border-zinc-700 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100 shadow-sm"
        tabIndex={-1}
        aria-label="Clear"
      >
        <X className="w-3 h-3" />
      </button>
    );
  };

  const sectionClass = "relative";
  const sectionTitleClass = "text-[16px] font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 pb-3 mb-6 border-b border-zinc-100 dark:border-zinc-800/60";

  return (
    <div className="w-full flex flex-col gap-8">
      
      {/* Details Section */}
      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>{docType === 'quote' ? 'Quote Details' : t.invoiceDetails}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <fieldset className={`${fieldsetBaseClass} ${(docType === 'quote' ? !invoice.details.quoteNumber : !invoice.details.invoiceNumber) ? fieldsetBorderRequired : fieldsetBorderDefault}`}>
            <legend className={legendClass}>{docType === 'quote' ? 'Quote Number' : t.invoiceNumber}</legend>
            <ClearBtn value={docType === 'quote' ? invoice.details.quoteNumber : invoice.details.invoiceNumber} onClear={() => handleSectionChange('details', docType === 'quote' ? 'quoteNumber' : 'invoiceNumber', '')} />
            <input 
              type="text" 
              className={inputInnerClass} 
              value={docType === 'quote' ? invoice.details.quoteNumber : invoice.details.invoiceNumber} 
              onChange={(e) => handleSectionChange('details', docType === 'quote' ? 'quoteNumber' : 'invoiceNumber', e.target.value)}
            />
          </fieldset>
          <fieldset className={`${fieldsetBaseClass} ${!invoice.details.issueDate ? fieldsetBorderRequired : fieldsetBorderDefault}`}>
            <legend className={legendClass}>{t.issueDate}</legend>
            <div className="relative flex items-center">
              <input 
                type="date" 
                className={`${inputInnerClass} cursor-pointer`}
                value={invoice.details.issueDate} 
                onChange={(e) => handleSectionChange('details', 'issueDate', e.target.value)}
              />
              <Calendar className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute right-0 pointer-events-none" />
            </div>
          </fieldset>
          <fieldset className={`${fieldsetBaseClass} ${fieldsetBorderDefault}`}>
            <legend className={legendClass}>{docType === 'quote' ? 'Valid Until' : t.dueDate}</legend>
            <div className="relative flex items-center">
              <input 
                type="date" 
                className={`${inputInnerClass} cursor-pointer`}
                value={invoice.details.dueDate} 
                onChange={(e) => handleSectionChange('details', 'dueDate', e.target.value)}
              />
              <Calendar className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute right-0 pointer-events-none" />
            </div>
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
              <fieldset className={`${fieldsetBaseClass} flex-1 ${!invoice.company.name ? fieldsetBorderRequired : fieldsetBorderDefault}`}>
                <legend className={legendClass}>{`${t.companyName}, ${t.yourAddress}, ${t.yourEmail}, ${t.companyPhone}`}</legend>
                <div className="w-full h-full flex flex-col">
                  <ClearBtn value={invoice.company.name} onClear={() => handleSectionChange('company', 'name', '')} />
                  <textarea 
                    placeholder={`${t.companyName}, ${t.yourAddress}, ${t.yourEmail}, ${t.companyPhone}`}
                    className={`${inputInnerClass} flex-1 resize-y min-h-[80px] mt-1 pr-6 leading-relaxed overflow-y-auto`} 
                    value={invoice.company.name} 
                    onChange={(e) => handleSectionChange('company', 'name', e.target.value)}
                    rows={3}
                  />
                </div>
              </fieldset>
            </div>

            {/* Right Column: Dropdown + Logo Upload */}
            <div className="w-full md:w-[130px] flex-shrink-0 flex flex-col gap-3">
              <div className="h-[32px] w-full">
                {myCompanies.length > 0 ? (
                  <select 
                    value={selectedCompanyId}
                    onChange={handleCompanyAutoFill}
                    className="w-full h-full text-[11px] font-semibold uppercase tracking-tight truncate bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 text-zinc-700 dark:text-zinc-300 outline-none transition-colors cursor-pointer shadow-sm appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2371717a'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1em 1em`, paddingRight: `1.5rem` }}
                  >
                    <option value="" disabled>{t.autoFillFrom}</option>
                    {myCompanies.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                ) : (
                  <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800/50 animate-pulse rounded-lg border border-zinc-200/50 dark:border-zinc-700/50" />
                )}
              </div>
              
              <div className="w-[100px] h-[100px] ml-auto md:mx-0">
                {invoice.company.logo ? (
                  <div className="relative w-[100px] h-[100px] group transition-all">
                    <div className="w-full h-full rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center p-0 shadow-sm overflow-hidden transition-all duration-300 group-hover:shadow-md">
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
                    className="w-[100px] h-[100px] rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-blue-500/50 dark:hover:border-blue-400/50 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300 bg-white/50 hover:bg-blue-50/50 dark:bg-zinc-900/40 dark:hover:bg-blue-900/20 text-zinc-500 hover:text-blue-600 dark:text-zinc-400 backdrop-blur-md overflow-hidden hover:shadow-lg hover:shadow-blue-500/10 group"
                  >
                    <div className="p-2.5 bg-white dark:bg-zinc-800 rounded-full shadow-sm border border-zinc-100 dark:border-zinc-700 group-hover:scale-110 transition-transform">
                      <Upload className="w-4 h-4" />
                    </div>
                    <div className="text-center mt-1">
                      <p className="text-[11px] font-medium leading-tight">{t.companyLogo}</p>
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
              <fieldset className={`${fieldsetBaseClass} ${!invoice.client.name ? fieldsetBorderRequired : fieldsetBorderDefault}`}>
                <legend className={legendClass}>{`${t.clientName}, ${t.clientAddress}, ${t.clientEmail}, ${t.clientPhone}`}</legend>
                <div className="w-full h-full flex flex-col">
                  <ClearBtn value={invoice.client.name} onClear={() => handleSectionChange('client', 'name', '')} />
                  <textarea 
                    placeholder={`${t.clientName}, ${t.clientAddress}, ${t.clientEmail}, ${t.clientPhone}`}
                    className={`${inputInnerClass} resize-y min-h-[80px] mt-1 pr-6 leading-relaxed overflow-y-auto`} 
                    value={invoice.client.name} 
                    onChange={(e) => handleSectionChange('client', 'name', e.target.value)}
                    rows={3}
                  />
                </div>
              </fieldset>
              
              <fieldset className={`${fieldsetBaseClass} ${fieldsetBorderDefault}`}>
                <legend className={legendClass}>{`${t.shipTo} ${t.clientPhone.includes('(') ? t.clientPhone.match(/\(.*\)/)?.[0] || '(Optional)' : '(Optional)'}`}</legend>
                <ClearBtn value={invoice.client.shipTo || ""} onClear={() => handleSectionChange('client', 'shipTo', '')} />
                <textarea 
                  className={`${inputInnerClass} resize-y min-h-[80px] mt-1 pr-6 leading-relaxed overflow-y-auto`} 
                  value={invoice.client.shipTo || ""} 
                  onChange={(e) => handleSectionChange('client', 'shipTo', e.target.value)}
                  rows={3}
                />
              </fieldset>
            </div>
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <div className="mb-6">
          <h3 className="text-[16px] font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-500" />
            {t.lineItems}
          </h3>
        </div>
        
        <div className="w-full">
          <div className="w-full">
            {/* Header - Hidden on Mobile */}
            <div className="hidden md:grid grid-cols-24 gap-[1px] py-2 text-[12px] font-semibold text-zinc-900 bg-zinc-100 dark:bg-zinc-800/80 rounded-xl items-center mb-[2px] pr-8 uppercase tracking-widest">
              <div className="col-span-16 pl-6">{t.description}</div>
              <div className="col-span-3 text-center">{t.qty}</div>
              <div className="col-span-5 text-center">{t.rate}</div>
            </div>

            <div className="space-y-4 md:space-y-[2px]">
              {invoice.items.map((item: any, index: number) => (
                <div 
                  key={item.id} 
                  className="relative flex flex-col md:grid md:grid-cols-24 gap-3 md:gap-[1px] items-start md:items-center group p-5 md:p-0 md:pr-8 bg-zinc-50/50 dark:bg-zinc-900/20 md:bg-transparent rounded-2xl md:rounded-none border md:border-none border-zinc-200 dark:border-zinc-800 md:mb-0 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900/40"
                >
                  {/* Item Label for Mobile */}
                  <div className="md:hidden text-[10px] font-semibold text-zinc-400 uppercase tracking-widest ml-1">{t.description}</div>
                  
                  {/* Description (Item) Boxed */}
                  <div className="w-full md:col-span-16 relative">
                    <input 
                      type="text" 
                      placeholder={t.itemDescription}
                      className={`w-full h-12 pl-4 md:pl-6 pr-14 bg-background border ${!item.description ? 'border-2 border-destructive/30' : 'border-border'} rounded-xl text-[14px] font-normal text-foreground placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm`}
                      value={item.description}
                      maxLength={120}
                      onChange={(e) => handleItemChange(index, "description", e.target.value)}
                      onFocus={() => setFocusedItemIndex(index)}
                      onBlur={() => setTimeout(() => setFocusedItemIndex(null), 200)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addItem(); } }}
                    />
                    {item.description.length >= 110 && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-medium text-red-500 pointer-events-none transition-colors">
                        {item.description.length >= 120 ? "Max limits" : `${120 - item.description.length} left`}
                      </span>
                    )}
                    {focusedItemIndex === index && myItems.length > 0 && (
                      <div className="absolute z-50 w-full mt-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 md:w-[150%]">
                        <div className="max-h-[200px] overflow-y-auto p-1">
                          {myItems.filter(i => i.name.toLowerCase().includes(item.description.toLowerCase())).length === 0 ? (
                            <div className="p-3 text-center text-xs text-zinc-500 font-medium">No saved items found</div>
                          ) : (
                            myItems
                              .filter(i => i.name.toLowerCase().includes(item.description.toLowerCase()))
                              .map(savedItem => (
                                <button
                                  key={savedItem.id}
                                  type="button"
                                  className="w-full text-left px-3 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-lg transition-colors flex flex-col gap-0.5"
                                  onClick={() => {
                                    handleItemChange(index, "description", savedItem.name);
                                    if (savedItem.rate) {
                                      handleItemChange(index, "rate", savedItem.rate);
                                    }
                                  }}
                                >
                                  <div className="flex justify-between items-start gap-3 w-full">
                                    <span className="text-[13px] font-medium text-zinc-900 dark:text-zinc-100 whitespace-pre-wrap">{savedItem.name}</span>
                                    <span className="text-[12px] font-medium text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5">
                                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: invoice.currency }).format(savedItem.rate)}
                                    </span>
                                  </div>
                                </button>
                              ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 w-full md:contents">
                    {/* Qty (Quantity) Boxed */}
                    <div className="flex-1 md:col-span-3">
                      <div className="md:hidden text-[10px] font-semibold text-zinc-400 uppercase tracking-widest ml-1 mb-1">{t.qty}</div>
                      <input 
                        type="number" 
                        className="w-full h-12 px-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl md:rounded-lg text-center text-[14px] font-normal text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none shadow-sm transition-all"
                        value={item.quantity}
                        min="0"
                        onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))}
                        onKeyDown={(e) => ["-", "+", "e"].includes(e.key) && e.preventDefault()}
                      />
                    </div>

                    {/* Rate Boxed */}
                    <div className="flex-[2] md:col-span-5">
                      <div className="md:hidden text-[10px] font-semibold text-zinc-400 uppercase tracking-widest ml-1 mb-1">{t.rate}</div>
                      <input 
                        type="number" 
                        placeholder="0.00"
                        className={`w-full h-12 px-4 bg-white dark:bg-zinc-950 border ${(!item.rate || item.rate === 0) ? 'border-2 border-red-300/80 dark:border-red-500/30' : 'border-zinc-200 dark:border-zinc-800'} rounded-xl md:rounded-lg text-left text-[14px] font-normal text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none shadow-sm`}
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
                  <div className="absolute right-2 top-2 md:-right-2 md:top-1/2 md:-translate-y-1/2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all z-10 font-bold">
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
          
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3">
            <button 
              type="button"
              onClick={addItem}
              disabled={invoice.items.length >= MAX_ITEMS}
              className="w-fit flex items-center justify-center gap-2 px-5 py-3 bg-success text-success-foreground rounded-2xl text-[14px] font-semibold shadow-lg shadow-success/10 transition-all hover:opacity-90 active:scale-[0.98] group disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:active:scale-100"
            >
              <Plus className="w-4 h-4 text-white" /> {t.addItem}
            </button>
            <span className={`text-[12px] font-medium tabular-nums ${
              invoice.items.length >= MAX_ITEMS
                ? "text-red-500 dark:text-red-400"
                : invoice.items.length >= MAX_ITEMS - 3
                ? "text-amber-500 dark:text-amber-400"
                : "text-zinc-400"
            }`}>
              {invoice.items.length}/{MAX_ITEMS} items
              {invoice.items.length >= MAX_ITEMS && " — limit reached"}
            </span>
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <h3 className="text-[16px] font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
          <Settings className="w-4 h-4 text-blue-500" />
          {t.settings}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="space-y-4">
            <fieldset className={`${fieldsetBaseClass} ${fieldsetBorderDefault}`}>
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
            
            <div className="flex flex-col gap-4">
              {/* Discount */}
              <div className="grid grid-cols-2 gap-[2px] items-center">
                <div className="h-12 border border-transparent hover:border-zinc-200/50 focus-within:border-blue-500 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 flex items-center px-4 transition-all">
                  <input 
                    className="w-full bg-transparent border-none outline-none text-[13px] font-medium text-zinc-500 text-right focus:ring-0 p-0"
                    value={(invoice.discountLabel === 'Discount' ? '' : invoice.discountLabel) || t.discount}
                    onChange={(e) => handleRootChange("discountLabel", e.target.value)}
                    placeholder={t.discount}
                  />
                </div>
                <div className="h-12 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 flex items-center focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                  <input 
                    type="number" 
                    placeholder="0"
                    className="flex-1 min-w-0 bg-transparent pl-4 pr-1 text-center text-[15px] font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                    value={invoice.discount || ''}
                    onChange={(e) => handleRootChange("discount", Math.max(0, e.target.value === '' ? 0 : Number(e.target.value)))}
                    min="0"
                    onKeyDown={(e) => ["-", "+", "e"].includes(e.key) && e.preventDefault()}
                  />
                  <div className="flex-shrink-0 w-16 h-full border-l border-zinc-200 dark:border-zinc-800">
                    <button
                      type="button"
                      onClick={() => handleRootChange("discountType", invoice.discountType === 'percentage' ? 'fixed' : 'percentage')}
                      className="w-full h-full px-2 flex items-center justify-center gap-1.5 text-zinc-400 hover:text-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all"
                    >
                      <span className="text-[14px] font-bold text-zinc-500">
                        {invoice.discountType === 'percentage' ? '%' : (CURRENCIES.find(c => c.code === invoice.currency)?.symbol || '$')}
                      </span>
                      <RefreshCw className="w-4 h-4 ml-0.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Tax */}
              <div className="grid grid-cols-2 gap-[2px] items-center">
                <div className="h-12 border border-transparent hover:border-zinc-200/50 focus-within:border-blue-500 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 flex items-center px-4 transition-all">
                  <input 
                    className="w-full bg-transparent border-none outline-none text-[13px] font-medium text-zinc-500 text-right focus:ring-0 p-0"
                    value={(invoice.taxLabel === 'Tax' ? '' : invoice.taxLabel) || t.tax}
                    onChange={(e) => handleRootChange("taxLabel", e.target.value)}
                    placeholder={t.tax}
                  />
                </div>
                <div className="h-12 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 flex items-center focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                  <input 
                    type="number" 
                    placeholder="0"
                    className="flex-1 min-w-0 bg-transparent pl-4 pr-1 text-center text-[15px] font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                    value={invoice.taxRate || ''}
                    onChange={(e) => handleRootChange("taxRate", Math.max(0, e.target.value === '' ? 0 : Number(e.target.value)))}
                    min="0"
                    onKeyDown={(e) => ["-", "+", "e"].includes(e.key) && e.preventDefault()}
                  />
                  <div className="flex-shrink-0 w-16 h-full border-l border-zinc-200 dark:border-zinc-800">
                    <button
                      type="button"
                      onClick={() => handleRootChange("taxType", invoice.taxType === 'percentage' ? 'fixed' : 'percentage')}
                      className="w-full h-full px-2 flex items-center justify-center gap-1.5 text-zinc-400 hover:text-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all"
                    >
                      <span className="text-[14px] font-bold text-zinc-500">
                        {invoice.taxType === 'percentage' ? '%' : (CURRENCIES.find(c => c.code === invoice.currency)?.symbol || '$')}
                      </span>
                      <RefreshCw className="w-4 h-4 ml-0.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Shipping */}
              <div className="grid grid-cols-2 gap-[2px] items-center">
                <div className="h-12 border border-transparent hover:border-zinc-200/50 focus-within:border-blue-500 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 flex items-center px-4 transition-all">
                  <input 
                    className="w-full bg-transparent border-none outline-none text-[13px] font-medium text-zinc-500 text-right focus:ring-0 p-0"
                    value={(invoice.shippingLabel === 'Shipping' ? '' : invoice.shippingLabel) || t.shipping}
                    onChange={(e) => handleRootChange("shippingLabel", e.target.value)}
                    placeholder={t.shipping}
                  />
                </div>
                <div className="h-12 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 flex items-center focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                  <input 
                    type="number" 
                    placeholder="0"
                    className="flex-1 min-w-0 bg-transparent pl-4 pr-1 text-center text-[15px] font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                    value={invoice.shipping || ''}
                    onChange={(e) => handleRootChange("shipping", Math.max(0, e.target.value === '' ? 0 : Number(e.target.value)))}
                    min="0"
                    onKeyDown={(e) => ["-", "+", "e"].includes(e.key) && e.preventDefault()}
                  />
                  <div className="flex-shrink-0 w-16 h-full border-l border-zinc-200 dark:border-zinc-800 px-3 flex items-center justify-center text-[14px] font-medium text-zinc-500/50 select-none">
                    {CURRENCIES.find(c => c.code === invoice.currency)?.symbol || '$'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {/* Notes Accordion */}
              <div className="border border-zinc-200/60 dark:border-zinc-800/60 rounded-xl overflow-hidden bg-white/50 dark:bg-zinc-950 shadow-sm">
                <div className="w-full h-12 flex items-center justify-between px-4 bg-zinc-50/50 dark:bg-zinc-800/20">
                  <div className="flex items-center gap-3 flex-1 min-w-0 h-full">
                    <label className="flex items-center gap-2 cursor-pointer shrink-0 h-full" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="checkbox" 
                        checked={invoice.showNotes} 
                        onChange={(e) => handleRootChange("showNotes", e.target.checked)}
                        className="w-4 h-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 cursor-pointer transition-all"
                      />
                    </label>
                    <button 
                      type="button"
                      onClick={() => setIsNotesOpen(!isNotesOpen)} 
                      className="flex-1 h-full text-left text-[13px] font-medium text-zinc-900 dark:text-zinc-100 truncate hover:text-blue-600 transition-colors"
                    >
                      {t.notes} {invoice.notes && !isNotesOpen && <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-[10px] font-medium">{t.addNotes}</span>}
                    </button>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setIsNotesOpen(!isNotesOpen)}
                    className="p-1 px-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    {isNotesOpen ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                  </button>
                </div>
                {isNotesOpen && (
                  <div className="p-5 border-t border-zinc-200/60 dark:border-zinc-800/60 pt-6">
                    <fieldset className={`${fieldsetBaseClass} ${fieldsetBorderDefault}`}>
                      <legend className={legendClass}>{t.notes}</legend>
                      <textarea 
                        className={`${inputInnerClass} h-[64px] min-h-[64px] overflow-y-auto resize-none mt-1 leading-relaxed`} 
                        value={invoice.notes} 
                        onChange={(e) => handleRootChange("notes", e.target.value)}
                        placeholder={t.notesPlaceholder}
                      />
                    </fieldset>
                  </div>
                )}
              </div>

            {/* Terms Accordion */}
              <div className="border border-zinc-200/60 dark:border-zinc-800/60 rounded-xl overflow-hidden bg-white/50 dark:bg-zinc-950 shadow-sm">
                <div className="w-full h-12 flex items-center justify-between px-4 bg-zinc-50/50 dark:bg-zinc-800/20">
                  <div className="flex items-center gap-3 flex-1 min-w-0 h-full">
                    <label className="flex items-center gap-2 cursor-pointer shrink-0 h-full" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="checkbox" 
                        checked={invoice.showTerms} 
                        onChange={(e) => handleRootChange("showTerms", e.target.checked)}
                        className="w-4 h-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 cursor-pointer transition-all"
                      />
                    </label>
                    <button 
                      type="button"
                      onClick={() => setIsTermsOpen(!isTermsOpen)} 
                      className="flex-1 h-full text-left text-[13px] font-medium text-zinc-900 dark:text-zinc-100 truncate hover:text-blue-600 transition-colors"
                    >
                      {t.termsConditions} {invoice.terms && !isTermsOpen && <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-[10px] font-medium">{t.addTerms}</span>}
                    </button>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setIsTermsOpen(!isTermsOpen)}
                    className="p-1 px-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    {isTermsOpen ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                  </button>
                </div>
                {isTermsOpen && (
                  <div className="p-5 border-t border-zinc-200/60 dark:border-zinc-800/60 pt-6">
                    <fieldset className={`${fieldsetBaseClass} ${fieldsetBorderDefault}`}>
                      <legend className={legendClass}>{t.termsConditions}</legend>
                      <textarea 
                        className={`${inputInnerClass} h-[64px] min-h-[64px] overflow-y-auto resize-none mt-1 leading-relaxed`} 
                        value={invoice.terms} 
                        onChange={(e) => handleRootChange("terms", e.target.value)}
                        placeholder={t.termsPlaceholder}
                      />
                    </fieldset>
                  </div>
                )}
              </div>

            {/* Signature Accordion */}
            <div className="border border-zinc-200/60 dark:border-zinc-800/60 rounded-xl overflow-hidden bg-white/50 dark:bg-zinc-950 shadow-sm">
              <button 
                className="w-full h-12 flex items-center justify-between px-4 text-[13px] font-bold text-zinc-900 dark:text-zinc-100 bg-zinc-50/50 dark:bg-zinc-800/20 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/40 transition-colors"
                onClick={() => setIsSignatureOpen(!isSignatureOpen)}
              >
                {t.signature} {(invoice.signature || invoice.signatureName) && !isSignatureOpen && <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-[10px] font-bold">{t.addSignature}</span>}
                {isSignatureOpen ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
              </button>
              {isSignatureOpen && (
                <div className="p-5 border-t border-zinc-200/60 dark:border-zinc-800/60 space-y-5">
                  <div>
                    <div className="flex items-start gap-4">
                      {invoice.signature ? (
                        <div className="relative h-24 px-5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 flex items-center justify-center group shadow-sm transition-all min-w-[180px]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={invoice.signature} alt="Signature" className="max-w-full max-h-full object-contain dark:invert" />
                          <button 
                            onClick={() => {
                              setInvoice((prev: any) => ({
                                ...prev,
                                signature: undefined,
                                signatureName: ""
                              }));
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-lg p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4 w-full">
                          <div 
                            onClick={() => signatureInputRef.current?.click()}
                            className="flex-1 h-24 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all bg-white hover:bg-blue-50/50 dark:bg-zinc-900/50 dark:hover:bg-blue-900/20 text-zinc-500 hover:text-blue-600 shadow-sm"
                          >
                            <Upload className="w-5 h-5 flex-shrink-0" />
                            <span className="text-[10px] uppercase font-bold tracking-widest truncate px-1 text-center w-full">{t.upload}</span>
                          </div>
                          
                          <div className="flex items-center justify-center text-[10px] font-black tracking-widest text-zinc-300 uppercase flex-shrink-0">OR</div>

                          <div 
                            onClick={() => setIsSignatureModalOpen(true)}
                            className="flex-1 h-24 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all bg-white hover:bg-blue-50/50 dark:bg-zinc-900/50 dark:hover:bg-blue-900/20 text-zinc-500 hover:text-blue-600 shadow-sm"
                          >
                            <PenTool className="w-5 h-5 flex-shrink-0" />
                            <span className="text-[10px] uppercase font-bold tracking-widest truncate px-1 text-center w-full">{t.draw}</span>
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
                      <fieldset className={`${fieldsetBaseClass} ${fieldsetBorderDefault}`}>
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
        onSave={(data: any) => handleRootChange("signature", data)} 
      />

      {/* Recurring Invoice Accordion */}
      {docType === 'invoice' && (
      <div className={sectionClass}>
        <div className="border border-zinc-200/60 dark:border-zinc-800/60 rounded-xl overflow-hidden bg-white/50 dark:bg-zinc-950 shadow-sm">
          <div className="w-full h-12 flex items-center justify-between px-4 bg-zinc-50/50 dark:bg-zinc-800/20">
            <div className="flex items-center gap-3 flex-1 min-w-0 h-full">
              <label className={`flex items-center gap-2 shrink-0 h-full ${!canUseRecurring ? 'cursor-not-allowed' : 'cursor-pointer'}`} onClick={(e) => {
                // If it's disabled, clicking the checkbox container should still show the upgrade modal
                if (!canUseRecurring) {
                  onShowUpgrade?.();
                  e.preventDefault();
                }
                e.stopPropagation();
              }}>
                <input
                  type="checkbox"
                  disabled={!canUseRecurring}
                  checked={!!invoice.isRecurring}
                  onChange={(e) => handleRecurringToggle(e.target.checked)}
                  className={`w-4 h-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 transition-all ${!canUseRecurring ? 'opacity-50 cursor-not-allowed bg-zinc-100 dark:bg-zinc-800' : 'cursor-pointer'}`}
                />
              </label>
              <button
                type="button"
                onClick={() => {
                  if (!invoice.isRecurring && !canUseRecurring) { onShowUpgrade?.(); return; }
                  setIsRecurringOpen(!isRecurringOpen);
                }}
                className="flex-1 h-full text-left text-[13px] font-bold text-zinc-900 dark:text-zinc-100 truncate hover:text-blue-600 transition-colors flex items-center gap-2"
              >
                <Repeat2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                Recurring Invoice
                {!canUseRecurring && (
                  <span className="ml-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider">Pro</span>
                )}
                {invoice.isRecurring && invoice.recurringInterval && !isRecurringOpen && (
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-[10px] font-bold capitalize">
                    {invoice.recurringInterval}
                  </span>
                )}
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                if (!invoice.isRecurring && !canUseRecurring) { onShowUpgrade?.(); return; }
                setIsRecurringOpen(!isRecurringOpen);
              }}
              className="p-1 px-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              {isRecurringOpen ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
            </button>
          </div>

          {isRecurringOpen && (
            <div className="p-5 border-t border-zinc-200/60 dark:border-zinc-800/60 space-y-4">
              {!canUseRecurring ? (
                // Locked state for Free users
                <div className="text-center py-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-3">
                    <Repeat2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1">Recurring Invoices — Pro Feature</p>
                  <p className="text-xs text-zinc-500 mb-3">Auto-generate invoices weekly, monthly, quarterly or yearly.</p>
                  <button
                    type="button"
                    onClick={() => onShowUpgrade?.()}
                    className="px-5 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25"
                  >
                    Upgrade to Pro
                  </button>
                </div>
              ) : (
                <>
                  {/* Interval selector */}
                  <div>
                    <p className="text-[12px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Frequency</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {INTERVAL_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleIntervalChange(opt.value)}
                          className={`py-2.5 rounded-xl text-[13px] font-bold transition-all border ${
                            invoice.recurringInterval === opt.value
                              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                              : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-blue-400'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Next invoice date preview */}
                  {invoice.isRecurring && invoice.nextInvoiceDate && (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50">
                      <RefreshCw className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <div>
                        <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Next Invoice</p>
                        <p className="text-[13px] font-bold text-blue-900 dark:text-blue-200">{formatNextDate(invoice.nextInvoiceDate)}</p>
                      </div>
                    </div>
                  )}

                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    A new draft invoice will be automatically created on the date above. You can edit or delete it at any time.
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      )}

    </div>
  );
}
