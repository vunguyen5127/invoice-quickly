"use client";

import React from "react";
import { InvoiceState, getCurrencySymbol } from "@/types/invoice";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/language-context";

interface InvoicePreviewProps {
  invoice: InvoiceState;
  isLoggedIn?: boolean;
  compact?: boolean;
}

export function InvoicePreview({ invoice, isLoggedIn = false, compact = false }: InvoicePreviewProps) {
  const { t } = useLanguage();
  const symbol = getCurrencySymbol(invoice.currency);

  const subTotal = invoice.items.filter(item => item.description || item.quantity || item.rate).reduce((acc, item) => acc + (item.quantity * item.rate), 0);
  
  const discountAmount = invoice.discountType === 'percentage' 
    ? subTotal * (invoice.discount / 100) 
    : invoice.discount;
    
  const afterDiscount = Math.max(0, subTotal - discountAmount);
  
  const taxAmount = invoice.taxType === 'percentage'
    ? afterDiscount * (invoice.taxRate / 100)
    : invoice.taxRate;
  
  const total = afterDiscount + taxAmount + (invoice.shipping || 0);

  const formatDate = (dateStr: string) => {
    try {
      if (!dateStr) return "";
      return format(new Date(dateStr), "MMM dd, yyyy");
    } catch {
      return dateStr;
    }
  };

  const formatAmount = (value: number) =>
    new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);

  return (
    <div 
      className="bg-white text-zinc-900 mx-auto overflow-hidden sm:rounded-[5px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] ring-1 ring-zinc-900/5 transition-transform duration-100" 
      style={{
        width: "100%",
        maxWidth: "210mm",     // A4 width
      }}
    >
      <div 
        id="invoice-capture-area" 
        className="w-full bg-white flex flex-col text-zinc-900 relative" 
        style={{ 
          minHeight: compact ? "auto" : "297mm",    // A4 height or auto
          padding: "16mm 16mm",  // Standard margins
        }}
      >
        {/* Top Company Logo/Name Row */}
        <div className="flex justify-between items-start mb-8">
           <div className="space-y-1 flex-1 min-w-0">
             <h2 className="text-2xl font-black tracking-tighter uppercase">{invoice.company.name.split(/,|\n/)[0]}</h2>
             <div className="text-[12px] text-zinc-500 max-w-xs">
                {invoice.company.name.split(/,|\n/).slice(1).map((line, idx) => (
                  <p key={idx}>{line.trim()}</p>
                ))}
             </div>
           </div>
           {invoice.company.logo && (
             <div className="shrink-0 ml-6">
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img src={invoice.company.logo} alt="Company Logo" className="max-w-[160px] max-h-[70px] object-contain rounded-sm" />
             </div>
           )}
        </div>

        {/* 3-Column Header Area */}
        <div className="flex gap-8 mb-8 text-[13px] items-start">
           {/* Column 1: Bill To */}
           <div className="flex-1 min-w-0">
             <p className="font-bold mb-2 uppercase tracking-wide text-zinc-400 text-[11px]">{t.billedTo || "Bill To"}</p>
             <div className="text-zinc-600 space-y-0.5 leading-tight break-words">
               <p className="font-bold text-zinc-900 text-[15px]">{invoice.client.name.split(/,|\n/)[0] || "-"}</p>
               <div className="text-[13px] text-zinc-600">
                  {invoice.client.name.split(/,|\n/).slice(1).map((line, idx) => (
                    <p key={idx}>{line.trim()}</p>
                  ))}
               </div>
             </div>
           </div>

           {/* Column 2: Ship To (Middle Column) */}
           <div className="flex-1 min-w-0">
             {invoice.client.shipTo && (
               <>
                 <p className="font-bold mb-2 uppercase tracking-wide text-zinc-400 text-[11px]">{t.shipTo}</p>
                 <div className="text-zinc-600 space-y-0.5 leading-tight break-words">
                   <p className="whitespace-pre-wrap">{invoice.client.shipTo}</p>
                 </div>
               </>
             )}
           </div>

           {/* Column 3: Invoice Details Block */}
            <div className="flex-1 min-w-0 flex justify-end">
              <div className="grid grid-cols-[auto_auto] gap-x-5 gap-y-2 text-left">
                <span className="font-bold whitespace-nowrap">{t.invoiceNumber}:{"\u00A0"}</span>
                <span className="text-zinc-600 whitespace-nowrap">#{invoice.details.invoiceNumber}</span>
                
                <span className="font-bold whitespace-nowrap">{t.issueDate}:{"\u00A0"}</span>
                <span className="text-zinc-600 whitespace-nowrap">{formatDate(invoice.details.issueDate)}</span>
                
                <span className="font-bold whitespace-nowrap">{t.dueDate}:{"\u00A0"}</span>
                <span className="text-zinc-600 whitespace-nowrap">{formatDate(invoice.details.dueDate)}</span>
              </div>
            </div>
        </div>

        {/* Full Grid Table */}
        <div className="mb-0 flex-1">
          <table className="w-full border-collapse border border-zinc-300">
            <thead>
              <tr className="bg-zinc-100 divide-x divide-zinc-300 border-b border-zinc-300">
                <th className="py-2 px-3 text-left text-[12px] font-bold uppercase tracking-wider">{t.description}</th>
                <th className="w-20 py-2 px-3 text-center text-[12px] font-bold uppercase tracking-wider">{t.qty}</th>
                <th className="w-28 py-2 px-3 text-right text-[12px] font-bold uppercase tracking-wider">{t.rate}</th>
                <th className="w-28 py-2 px-3 text-right text-[12px] font-bold uppercase tracking-wider">{t.lineTotal || "Total"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-300">
              {invoice.items.filter(item => item.description || item.quantity || item.rate).map((item) => (
                <tr key={item.id} className="divide-x divide-zinc-300">
                  <td className="py-3 px-3 text-left align-top whitespace-pre-wrap font-medium">{item.description || "-"}</td>
                  <td className="py-3 px-3 text-center align-top">{item.quantity}</td>
                  <td className="py-3 px-3 text-right align-top">{formatAmount(item.rate)}</td>
                  <td className="py-3 px-3 text-right align-top font-bold text-zinc-900">{formatAmount(item.quantity * item.rate)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Table Summary Section - Numeric Boxed Style */}
          <div className="flex justify-end mt-0">
            <div className="w-[calc(19rem+2px)]">
              <div className="flex">
                <div className="flex-1 py-3 px-4 text-right font-bold text-[14px]">{t.subtotal}</div>
                <div className="w-28 py-3 px-4 text-right font-bold text-[14px] border-l border-r border-t border-b border-zinc-300">{formatAmount(subTotal)}</div>
              </div>

              {invoice.discount > 0 && (
                <div className="flex">
                  <div className="flex-1 py-3 px-4 text-right font-bold text-[14px]">
                    {invoice.discountLabel || t.discount} {invoice.discountType === 'percentage' && invoice.discount > 0 ? `(${invoice.discount.toFixed(1)}%)` : ""}
                  </div>
                  <div className="w-28 py-3 px-4 text-right font-bold text-[14px] border-l border-r border-b border-zinc-300">-{formatAmount(discountAmount)}</div>
                </div>
              )}

              {invoice.taxRate > 0 && (
                <div className="flex">
                  <div className="flex-1 py-3 px-4 text-right font-bold text-[14px]">
                    {invoice.taxLabel || t.tax} {invoice.taxType === 'percentage' && invoice.taxRate > 0 ? `(${invoice.taxRate.toFixed(1)}%)` : ""}
                  </div>
                   <div className="w-28 py-3 px-4 text-right font-bold text-[14px] border-l border-r border-b border-zinc-300">{formatAmount(taxAmount)}</div>
                </div>
              )}

              {invoice.shipping > 0 && (
                <div className="flex">
                  <div className="flex-1 py-3 px-4 text-right font-bold text-[14px]">{invoice.shippingLabel || t.shipping}</div>
                   <div className="w-28 py-3 px-4 text-right font-bold text-[14px] border-l border-r border-b border-zinc-300">{formatAmount(invoice.shipping || 0)}</div>
                </div>
              )}

              <div className="flex">
                <div className="flex-1 py-4 px-4 text-right font-black text-[14px] tracking-tighter">{t.totalDue}</div>
                <div className="w-28 py-4 px-4 text-right font-black text-[14px] border-l border-r border-b-2 border-zinc-300">
                  {symbol}{formatAmount(total)}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Signature Area */}
        <div className="mt-8 flex justify-end">
           {invoice.signature ? (
             <div className="flex flex-col items-center">
                <div className="mb-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={invoice.signature} alt="Signature" className="max-w-[180px] max-h-[100px] object-contain dark:invert" />
                </div>
                {invoice.signatureName && (
                  <p className="mt-2 text-[18px] font-bold italic font-serif text-zinc-800 tracking-tight">{invoice.signatureName}</p>
                )}
             </div>
           ) : null}
        </div>

        {/* Footer Notes & Terms (Now pushed to bottom) */}
        <div className={`mt-auto ${compact ? 'pt-8 pb-4' : 'pt-16'}`}>
          {invoice.notes && invoice.showNotes && (
            <div className="mb-2">
              <p className="font-bold text-zinc-900 border-b border-zinc-100 mb-1 uppercase tracking-widest text-[10px] inline-block pr-8">{t.notes}</p>
              <p className="text-[10px] text-zinc-600 whitespace-pre-wrap leading-relaxed max-w-2xl">{invoice.notes}</p>
            </div>
          )}
          {invoice.terms && invoice.showTerms && (
            <div className="mb-8">
              <p className="font-bold text-zinc-900 border-b border-zinc-100 mb-1 uppercase tracking-widest text-[10px] inline-block pr-8">{t.termsConditions}</p>
              <p className="text-[10px] text-zinc-600 whitespace-pre-wrap leading-relaxed max-w-2xl">{invoice.terms}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
