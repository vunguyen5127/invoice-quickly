"use client";

import React from "react";
import { InvoiceState } from "@/types/invoice";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/language-context";

interface InvoicePreviewProps {
  invoice: InvoiceState;
  isLoggedIn?: boolean;
}

const getSymbol = (currency: string) => {
  switch (currency) {
    case 'USD': return '$';
    case 'EUR': return '€';
    case 'GBP': return '£';
    case 'AUD': return 'A$';
    case 'CAD': return 'C$';
    default: return '$';
  }
}

export function InvoicePreview({ invoice, isLoggedIn = false }: InvoicePreviewProps) {
  const { t } = useLanguage();
  const symbol = getSymbol(invoice.currency);

  const subTotal = invoice.items.reduce((acc, item) => acc + (item.quantity * item.rate), 0);
  
  const discountAmount = invoice.discountType === 'percentage' 
    ? subTotal * (invoice.discount / 100) 
    : invoice.discount;
    
  const afterDiscount = Math.max(0, subTotal - discountAmount);
  
  const taxAmount = afterDiscount * (invoice.taxRate / 100);
  
  const total = afterDiscount + taxAmount;

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
        className="w-full bg-white flex flex-col font-mono text-zinc-900 relative" 
        style={{ 
          minHeight: "297mm",    // A4 height
          padding: "16mm 16mm",  // Standard margins
        }}
      >
        {!isLoggedIn && (
          <div className="absolute top-8 right-8 rotate-12 opacity-10 pointer-events-none select-none border-4 border-zinc-900 px-4 py-2 text-2xl font-black uppercase tracking-tighter">
            Sample Preview
          </div>
        )}
        
        {/* Top Company Logo/Name Row */}
        <div className="flex justify-between items-start mb-8">
           <div className="space-y-1">
             <h2 className="text-2xl font-black tracking-tighter uppercase">{invoice.company.name.split(/,|\n/)[0]}</h2>
             <div className="text-[12px] text-zinc-500 max-w-xs">
                {invoice.company.name.split(/,|\n/).slice(1).map((line, idx) => (
                  <p key={idx}>{line.trim()}</p>
                ))}
             </div>
           </div>
           <div className="shrink-0">
             {invoice.company.logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={invoice.company.logo} alt="Company Logo" className="max-w-[120px] max-h-[50px] object-contain mix-blend-multiply" />
            )}
           </div>
        </div>

        {/* 2-Column Header Area */}
        <div className="flex justify-between md:grid-cols-2 gap-4 mb-10 text-[13px]">
           {/* Bill To */}
           <div>
             <p className="font-bold mb-2 uppercase tracking-wide text-zinc-400 text-[11px]">{t.billedTo || "Bill To"}</p>
             <div className="text-zinc-600 space-y-0.5 leading-tight">
               <p className="font-bold text-zinc-900 text-[15px]">{invoice.client.name}</p>
               <p className="whitespace-pre-wrap">{invoice.client.address}</p>
               <p>{invoice.client.email}</p>
             </div>
           </div>

           {/* Invoice Details Block */}
           <div className="text-right">
              <div className="inline-grid grid-cols-[auto_auto] gap-x-4 gap-y-1 text-left">
                <span className="font-bold whitespace-nowrap">Invoice #</span>
                <span className="text-zinc-600 whitespace-nowrap">{invoice.details.invoiceNumber}</span>
                
                <span className="font-bold whitespace-nowrap">Invoice Date</span>
                <span className="text-zinc-600 whitespace-nowrap">{formatDate(invoice.details.issueDate)}</span>
                
                <span className="font-bold whitespace-nowrap">Due Date</span>
                <span className="text-zinc-600 whitespace-nowrap">{formatDate(invoice.details.dueDate)}</span>
              </div>
           </div>
        </div>

        {/* Full Grid Table */}
        <div className="mb-0 flex-1">
          <table className="w-full border-collapse border border-zinc-300">
            <thead>
              <tr className="bg-zinc-100 divide-x divide-zinc-300 border-b border-zinc-300">
                <th className="w-16 py-2 px-3 text-center text-[12px] font-bold uppercase tracking-wider">Qty</th>
                <th className="py-2 px-3 text-center text-[12px] font-bold uppercase tracking-wider">Description</th>
                <th className="w-40 py-2 px-3 text-right text-[12px] font-bold uppercase tracking-wider">Amount</th>
                <th className="w-40 py-2 px-3 text-right text-[12px] font-bold uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-300">
              {invoice.items.filter(item => item.description || item.quantity || item.rate).map((item) => (
                <tr key={item.id} className="divide-x divide-zinc-300">
                  <td className="py-3 px-3 text-center align-top">{item.quantity}</td>
                  <td className="py-3 px-3 text-left align-top whitespace-pre-wrap">{item.description || "-"}</td>
                  <td className="py-3 px-3 text-right align-top">{formatAmount(item.rate)}</td>
                  <td className="py-3 px-3 text-right align-top font-bold">{formatAmount(item.quantity * item.rate)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Table Summary Section - Numeric Boxed Style */}
          <div className="flex justify-end mt-0">
            <div className="w-[calc(22rem+2px)]">
              <div className="flex">
                <div className="flex-1 py-3 px-4 text-right font-bold text-[14px]">Subtotal</div>
                <div className="w-40 py-3 px-4 text-right font-bold text-[14px] border-l border-r border-t border-b border-zinc-300">{formatAmount(subTotal)}</div>
              </div>

              {invoice.taxRate > 0 ? (
                <div className="flex">
                  <div className="flex-1 py-3 px-4 text-right font-bold text-[14px]">Sales Tax {invoice.taxRate.toFixed(1)}%</div>
                  <div className="w-40 py-3 px-4 text-right font-bold text-[14px] border-l border-r border-b border-zinc-300">{formatAmount(taxAmount)}</div>
                </div>
              ) : !isLoggedIn && (
                <div className="flex opacity-50">
                  <div className="flex-1 py-3 px-4 text-right font-medium text-[12px] italic">Tax calculated by payment provider</div>
                  <div className="w-40 py-3 px-4 text-right font-bold text-[14px] border-l border-r border-b border-zinc-300">0.00</div>
                </div>
              )}

              {invoice.discount > 0 && (
                <div className="flex text-red-600">
                  <div className="flex-1 py-3 px-4 text-right font-bold text-[14px]">Discount</div>
                  <div className="w-40 py-3 px-4 text-right font-bold text-[14px] border-l border-r border-b border-zinc-300">-{formatAmount(discountAmount)}</div>
                </div>
              )}

              <div className="flex">
                <div className="flex-1 py-4 px-4 text-right font-black text-[14px] uppercase tracking-tighter">TOTAL</div>
                <div className="w-40 py-4 px-4 text-right font-black text-[14px] border-l border-r border-b-2 border-zinc-300">
                  {symbol}{formatAmount(total)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Signature Area */}
        <div className="mt-8 flex justify-end">
           {invoice.signature || invoice.signatureName ? (
             <div className="flex flex-col items-center">
                {invoice.signature && (
                  <div className="mb-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={invoice.signature} alt="Signature" className="max-w-[180px] max-h-[100px] object-contain mix-blend-multiply" />
                  </div>
                )}
                {invoice.signatureName && (
                  <p className="mt-2 text-[18px] font-bold italic font-serif text-zinc-800 tracking-tight">{invoice.signatureName}</p>
                )}
             </div>
           ) : (
             <p className="text-[11px] text-zinc-400 italic max-w-[200px] text-right">
                This invoice is generated electronically and is valid without a signature.
             </p>
           )}
        </div>

        {/* Footer Notes & Terms - Bottom of Page */}
        <div className="mt-auto pt-16">
          {invoice.notes && (
            <div className="mb-6">
              <p className="font-bold text-zinc-900 border-b border-zinc-100 mb-1 uppercase tracking-widest text-[11px] inline-block pr-8">Notes</p>
              <p className="text-[13px] text-zinc-600 whitespace-pre-wrap leading-relaxed max-w-2xl">{invoice.notes}</p>
            </div>
          )}
          {invoice.terms && (
            <div className="mb-8">
              <p className="font-bold text-zinc-900 border-b border-zinc-100 mb-1 uppercase tracking-widest text-[11px] inline-block pr-8">Terms & Conditions</p>
              <p className="text-[13px] text-zinc-600 whitespace-pre-wrap leading-relaxed max-w-2xl">{invoice.terms}</p>
            </div>
          )}
        </div>

        {/* App Watermark */}
        {!isLoggedIn && (
           <div className="text-center pb-6 mt-12 bg-white">
             <span className="text-[10px] font-medium text-zinc-300 pointer-events-none select-none italic">
               {t.watermark}
             </span>
           </div>
        )}
      </div>
    </div>
  );
}
