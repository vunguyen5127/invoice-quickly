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
        className="w-full bg-white flex flex-col font-mono text-zinc-900" 
        style={{ 
          minHeight: "297mm",    // A4 height
          padding: "16mm 16mm",  // Standard margins
        }}
      >
        
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
        <div className="flex justify-between md:grid-cols-2 gap-8 mb-10 text-[13px]">
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
              <div className="inline-grid grid-cols-2 gap-x-4 gap-y-1 text-left">
                <span className="font-bold pr-4">Invoice #</span>
                <span className="text-zinc-600">{invoice.details.invoiceNumber}</span>
                
                <span className="font-bold pr-4">Invoice Date</span>
                <span className="text-zinc-600">{formatDate(invoice.details.issueDate)}</span>
                
                <span className="font-bold pr-4">Due Date</span>
                <span className="text-zinc-600">{formatDate(invoice.details.dueDate)}</span>
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
                <th className="w-32 py-2 px-3 text-center text-[12px] font-bold uppercase tracking-wider">Unit Price</th>
                <th className="w-32 py-2 px-3 text-center text-[12px] font-bold uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-300">
              {invoice.items.filter(item => item.description || item.quantity || item.rate).map((item) => (
                <tr key={item.id} className="divide-x divide-zinc-300">
                  <td className="py-3 px-3 text-center align-top">{item.quantity}</td>
                  <td className="py-3 px-3 text-left align-top">{item.description || "-"}</td>
                  <td className="py-3 px-3 text-right align-top">{item.rate.toFixed(2)}</td>
                  <td className="py-3 px-3 text-right align-top font-bold">{(item.quantity * item.rate).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Table Summary Section - Boxed Values Style */}
          <div className="flex justify-end mt-0">
            <div className="w-[calc(18rem+2px)]"> 
              <div className="flex border-x border-b border-zinc-300 divide-zinc-300">
                <div className="flex-1 py-3 px-4 text-right font-bold text-[14px] bg-white">Subtotal</div>
                <div className="w-32 py-3 px-4 text-right font-bold text-[14px] border-l border-zinc-300">{subTotal.toFixed(2)}</div>
              </div>

              {invoice.taxRate > 0 && (
                <div className="flex border-x border-b border-zinc-300 divide-zinc-300">
                  <div className="flex-1 py-3 px-4 text-right font-bold text-[14px] bg-white">Sales Tax {invoice.taxRate.toFixed(1)}%</div>
                  <div className="w-32 py-3 px-4 text-right font-bold text-[14px] border-l border-zinc-300">{taxAmount.toFixed(2)}</div>
                </div>
              )}

              {invoice.discount > 0 && (
                <div className="flex border-x border-b border-zinc-300 divide-zinc-300 text-red-600">
                  <div className="flex-1 py-3 px-4 text-right font-bold text-[14px]">Discount</div>
                  <div className="w-32 py-3 px-4 text-right font-bold text-[14px] border-l border-zinc-300">-{discountAmount.toFixed(2)}</div>
                </div>
              )}

              <div className="flex border-x border-b-2 border-zinc-300 divide-zinc-300 bg-zinc-50">
                <div className="flex-1 py-4 px-4 text-right font-black text-xl uppercase tracking-tighter">TOTAL</div>
                <div className="w-32 py-4 px-4 text-right font-black text-xl border-l border-zinc-300">
                  {symbol}{total.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Signature Area - Positioned right below Summary */}
        <div className="mt-8 flex justify-end">
           {invoice.signature && (
             <div className="flex flex-col items-center">
                <div className="mb-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={invoice.signature} alt="Signature" className="max-w-[180px] max-h-[100px] object-contain mix-blend-multiply" />
                </div>
                {invoice.signatureName && (
                  <p className="mt-2 text-[18px] font-bold italic font-serif text-zinc-800 tracking-tight">{invoice.signatureName}</p>
                )}
             </div>
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
