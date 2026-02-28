"use client";

import React, { useRef, useState } from "react";
import { InvoiceState, InvoiceItem } from "@/types/invoice";
import { Plus, Trash2, Upload, X, PenTool, ChevronDown, ChevronUp } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { SignaturePadModal } from "./signature-pad-modal";

interface InvoiceFormProps {
  invoice: InvoiceState;
  setInvoice: React.Dispatch<React.SetStateAction<InvoiceState>>;
}

export function InvoiceForm({ invoice, setInvoice }: InvoiceFormProps) {
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
      newItems[index] = { ...newItems[index], [field]: value };
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
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isSignatureOpen, setIsSignatureOpen] = useState(false);

  const inputBaseClass = "w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50 px-3 py-2.5 text-[14px] font-medium focus:outline-none focus:ring-[3px] focus:ring-zinc-100 dark:focus:ring-zinc-800/50 focus:border-zinc-300 dark:focus:border-zinc-700 text-zinc-900 dark:text-zinc-100 transition-all placeholder:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700 focus:shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:focus:shadow-none";
  const labelClass = "block text-[13px] font-medium text-zinc-600 dark:text-zinc-400 mb-1.5";
  const sectionClass = "relative";
  const sectionTitleClass = "text-[16px] font-bold tracking-tight text-zinc-900 dark:text-zinc-100 pb-3 mb-6 border-b border-zinc-100 dark:border-zinc-800/60";

  return (
    <div className="w-full flex flex-col gap-8">
      
      {/* Details Section */}
      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>Invoice Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className={labelClass}>Invoice Number</label>
            <input 
              type="text" 
              className={inputBaseClass} 
              value={invoice.details.invoiceNumber} 
              onChange={(e) => handleSectionChange('details', 'invoiceNumber', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Issue Date</label>
            <input 
              type="date" 
              className={inputBaseClass} 
              value={invoice.details.issueDate} 
              onChange={(e) => handleSectionChange('details', 'issueDate', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Due Date</label>
            <input 
              type="date" 
              className={inputBaseClass} 
              value={invoice.details.dueDate} 
              onChange={(e) => handleSectionChange('details', 'dueDate', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Billing Information Section */}
      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>Billing Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* From Column */}
          <div className="space-y-6">
            <h4 className="text-[14px] font-semibold text-zinc-800 dark:text-zinc-200">From (Your Details)</h4>
            
            <div className="flex items-start gap-3">
              {invoice.company.logo ? (
                <div className="relative w-20 h-20 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 flex items-center justify-center p-1.5 group transition-all">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={invoice.company.logo} alt="Logo" className="max-w-full max-h-full object-contain" />
                  <button 
                    onClick={() => handleSectionChange('company', 'logo', undefined)}
                    className="absolute -top-1.5 -right-1.5 bg-zinc-800 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => logoInputRef.current?.click()}
                  className="w-20 h-20 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors bg-zinc-50/50 dark:bg-zinc-900/50 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                >
                  <Upload className="w-4 h-4" />
                  <span className="text-[9px] font-medium uppercase tracking-wider">Upload</span>
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

            <div className="space-y-4">
              <div>
                <label className={labelClass}>Company Name</label>
                <input 
                  type="text" 
                  placeholder="Company Name"
                  className={inputBaseClass} 
                  value={invoice.company.name} 
                  onChange={(e) => handleSectionChange('company', 'name', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Email Address</label>
                <input 
                  type="email" 
                  placeholder="Email Address"
                  className={inputBaseClass} 
                  value={invoice.company.email} 
                  onChange={(e) => handleSectionChange('company', 'email', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Phone Number</label>
                <input 
                  type="text" 
                  placeholder="Phone Number"
                  className={inputBaseClass} 
                  value={invoice.company.phone} 
                  onChange={(e) => handleSectionChange('company', 'phone', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Address</label>
                <textarea 
                  placeholder="Address"
                  className={`${inputBaseClass} min-h-[70px] resize-y`} 
                  value={invoice.company.address} 
                  onChange={(e) => handleSectionChange('company', 'address', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* To Column */}
          <div className="space-y-6">
            <h4 className="text-[14px] font-semibold text-zinc-800 dark:text-zinc-200">To (Client Details)</h4>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Client Name</label>
                <input 
                  type="text" 
                  placeholder="Client Name"
                  className={inputBaseClass} 
                  value={invoice.client.name} 
                  onChange={(e) => handleSectionChange('client', 'name', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Email Address</label>
                <input 
                  type="email" 
                  placeholder="Email Address"
                  className={inputBaseClass} 
                  value={invoice.client.email} 
                  onChange={(e) => handleSectionChange('client', 'email', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Phone Number</label>
                <input 
                  type="text" 
                  placeholder="Phone Number"
                  className={inputBaseClass} 
                  value={invoice.client.phone} 
                  onChange={(e) => handleSectionChange('client', 'phone', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Address</label>
                <textarea 
                  placeholder="Address"
                  className={`${inputBaseClass} min-h-[70px] resize-y`} 
                  value={invoice.client.address} 
                  onChange={(e) => handleSectionChange('client', 'address', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>Line Items</h3>
        
        <div className="hidden md:grid grid-cols-12 gap-4 pb-3 mb-4 border-b border-zinc-100 dark:border-zinc-800/60 px-2 text-[13px] font-semibold text-zinc-600 dark:text-zinc-400">
          <div className="col-span-6">Description</div>
          <div className="col-span-2 text-right">Qty</div>
          <div className="col-span-3 text-right">Rate</div>
          <div className="col-span-1"></div>
        </div>

        <div className="space-y-3">
          {invoice.items.map((item, index) => (
            <div key={item.id} className="grid grid-cols-12 gap-3 md:gap-4 items-start group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 p-2 -mx-2 rounded-xl transition-colors">
              <div className="col-span-12 md:col-span-6">
                <input 
                  type="text" 
                  placeholder="Item description"
                  className={inputBaseClass} 
                  value={item.description}
                  onChange={(e) => handleItemChange(index, "description", e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addItem(); } }}
                />
              </div>
              <div className="col-span-4 md:col-span-2">
                <input 
                  type="number" 
                  placeholder="Qty"
                  className={`${inputBaseClass} md:text-right`} 
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addItem(); } }}
                  min="0"
                />
              </div>
              <div className="col-span-6 md:col-span-3">
                <input 
                  type="number" 
                  placeholder="Rate"
                  className={`${inputBaseClass} text-right`} 
                  value={item.rate}
                  onChange={(e) => handleItemChange(index, "rate", Number(e.target.value))}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addItem(); } }}
                  min="0"
                />
              </div>
              <div className="col-span-2 md:col-span-1 flex justify-end md:justify-center items-center h-10">
                <button 
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100"
                  aria-label="Remove item"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={addItem}
          className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors py-2"
        >
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      {/* Totals & Notes Setup */}
      <div className={sectionClass}>
        <h3 className={sectionTitleClass}>Totals & Notes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Currency</label>
              <select 
                className={inputBaseClass}
                value={invoice.currency}
                onChange={(e) => handleRootChange("currency", e.target.value)}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="AUD">AUD ($)</option>
                <option value="CAD">CAD ($)</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Tax Rate (%)</label>
                <input 
                  type="number" 
                  className={inputBaseClass} 
                  value={invoice.taxRate} 
                  onChange={(e) => handleRootChange("taxRate", Number(e.target.value))}
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>
              <div>
                <label className={labelClass}>Discount</label>
                <div className="flex relative">
                  <input 
                    type="number" 
                    className={`${inputBaseClass} rounded-r-none border-r-0`} 
                    value={invoice.discount} 
                    onChange={(e) => handleRootChange("discount", Number(e.target.value))}
                    min="0"
                  />
                  <select
                    className={`${inputBaseClass} w-auto min-w-[60px] rounded-l-none !px-1 border-l border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800`}
                    value={invoice.discountType}
                    onChange={(e) => handleRootChange("discountType", e.target.value as 'fixed' | 'percentage')}
                  >
                    <option value="percentage">%</option>
                    <option value="fixed">{invoice.currency.charAt(0) === 'U' ? '$' : 'Amt'}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {/* Notes Accordion */}
            <div className="border border-zinc-200/60 dark:border-zinc-800/60 rounded-xl overflow-hidden bg-white/50 dark:bg-zinc-950">
              <button 
                className="w-full flex items-center justify-between p-3.5 text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 bg-zinc-50/50 dark:bg-zinc-800/20 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/40 transition-colors"
                onClick={() => setIsNotesOpen(!isNotesOpen)}
              >
                Notes {invoice.notes && !isNotesOpen && <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs">Added</span>}
                {isNotesOpen ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
              </button>
              {isNotesOpen && (
                <div className="p-4 border-t border-zinc-200/60 dark:border-zinc-800/60">
                  <textarea 
                    className={`${inputBaseClass} min-h-[80px] bg-white`} 
                    value={invoice.notes} 
                    onChange={(e) => handleRootChange("notes", e.target.value)}
                    placeholder="Thanks for your business!"
                  />
                </div>
              )}
            </div>

            {/* Terms Accordion */}
            <div className="border border-zinc-200/60 dark:border-zinc-800/60 rounded-xl overflow-hidden bg-white/50 dark:bg-zinc-950">
              <button 
                className="w-full flex items-center justify-between p-3.5 text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 bg-zinc-50/50 dark:bg-zinc-800/20 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/40 transition-colors"
                onClick={() => setIsTermsOpen(!isTermsOpen)}
              >
                Terms & Conditions {invoice.terms && !isTermsOpen && <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs">Added</span>}
                {isTermsOpen ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
              </button>
              {isTermsOpen && (
                <div className="p-4 border-t border-zinc-200/60 dark:border-zinc-800/60">
                  <textarea 
                    className={`${inputBaseClass} min-h-[80px] bg-white`} 
                    value={invoice.terms} 
                    onChange={(e) => handleRootChange("terms", e.target.value)}
                    placeholder="Please pay within 14 days."
                  />
                </div>
              )}
            </div>

            {/* Signature Accordion */}
            <div className="border border-zinc-200/60 dark:border-zinc-800/60 rounded-xl overflow-hidden bg-white/50 dark:bg-zinc-950">
              <button 
                className="w-full flex items-center justify-between p-3.5 text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 bg-zinc-50/50 dark:bg-zinc-800/20 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/40 transition-colors"
                onClick={() => setIsSignatureOpen(!isSignatureOpen)}
              >
                Signature {(invoice.signature || invoice.signatureName) && !isSignatureOpen && <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs">Added</span>}
                {isSignatureOpen ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
              </button>
              {isSignatureOpen && (
                <div className="p-4 border-t border-zinc-200/60 dark:border-zinc-800/60 space-y-4">
                  <div>
                    <div className="flex items-start gap-4">
                      {invoice.signature ? (
                        <div className="relative w-40 h-20 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white flex items-center justify-center p-2 group shadow-sm transition-all">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={invoice.signature} alt="Signature" className="max-w-full max-h-full object-contain mix-blend-multiply" />
                          <button 
                            onClick={() => handleRootChange("signature", undefined)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row gap-3">
                          <div 
                            onClick={() => signatureInputRef.current?.click()}
                            className="w-40 h-20 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors bg-white hover:bg-blue-50 dark:bg-zinc-900/50 dark:hover:bg-blue-900/20 text-zinc-500 hover:text-blue-600"
                          >
                            <Upload className="w-5 h-5" />
                            <span className="text-[10px] uppercase font-semibold tracking-wider">Upload</span>
                          </div>
                          
                          <div className="flex items-center justify-center text-sm font-medium text-zinc-400">OR</div>

                          <div 
                            onClick={() => setIsSignatureModalOpen(true)}
                            className="w-40 h-20 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors bg-white hover:bg-blue-50 dark:bg-zinc-900/50 dark:hover:bg-blue-900/20 text-zinc-500 hover:text-blue-600"
                          >
                            <PenTool className="w-5 h-5" />
                            <span className="text-[10px] uppercase font-semibold tracking-wider">Draw</span>
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

                  <div>
                    <label className={labelClass}>Signer Name</label>
                    <input 
                      type="text" 
                      className={`${inputBaseClass} bg-white`} 
                      value={invoice.signatureName || ''} 
                      onChange={(e) => handleRootChange('signatureName', e.target.value)}
                      placeholder="e.g., John Doe"
                    />
                  </div>
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
