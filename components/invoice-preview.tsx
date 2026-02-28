"use client";

import React from "react";
import { InvoiceState } from "@/types/invoice";
import { format } from "date-fns";

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
      className="bg-white text-zinc-900 mx-auto overflow-hidden sm:rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] ring-1 ring-zinc-900/5 transition-transform duration-100" 
      style={{
        width: "100%",
        maxWidth: "210mm",     // A4 width
        minHeight: "297mm",    // A4 height
        padding: "40mm 20mm 40mm 20mm", // standard margins
      }}
    >
      <div id="invoice-capture-area" className="w-full h-full bg-white print:p-0 flex flex-col" style={{ padding: '0 20px' }}>
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-zinc-200 pb-8 mb-8">
          <div className="flex-1">
            <h1 className="text-4xl font-light text-zinc-900 tracking-tight mb-2">INVOICE</h1>
            <p className="text-sm font-medium text-zinc-500 uppercase tracking-widest">
              #{invoice.details.invoiceNumber}
            </p>
          </div>
          <div className="text-right flex-1 min-w-0 flex flex-col items-end">
            {invoice.company.logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={invoice.company.logo} alt="Company Logo" className="max-w-[150px] max-h-[80px] object-contain mb-4 mix-blend-multiply" />
            )}
            <h2 className="text-2xl font-semibold text-zinc-900 mb-2 truncate max-w-full">{invoice.company.name}</h2>
            <div className="text-sm text-zinc-600 space-y-1">
              <p className="whitespace-pre-wrap">{invoice.company.address}</p>
              <p>{invoice.company.email}</p>
              {invoice.company.phone && <p>{invoice.company.phone}</p>}
            </div>
          </div>
        </div>

        {/* Client & Dates */}
        <div className="flex justify-between mb-12">
          <div className="flex-1">
            <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-2">Billed To</p>
            <h3 className="text-lg font-semibold text-zinc-900 mb-1">{invoice.client.name}</h3>
            <div className="text-sm text-zinc-600 space-y-1">
              <p className="whitespace-pre-wrap">{invoice.client.address}</p>
              <p>{invoice.client.email}</p>
              {invoice.client.phone && <p>{invoice.client.phone}</p>}
            </div>
          </div>
          <div className="text-right flex-1 space-y-4">
            <div>
              <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-1">Date of Issue</p>
              <p className="text-sm font-semibold text-zinc-900">{formatDate(invoice.details.issueDate)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-1">Due Date</p>
              <p className="text-sm font-semibold text-zinc-900">{formatDate(invoice.details.dueDate)}</p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-12 flex-1">
          <div className="w-full text-left">
            <div className="border-b-2 border-zinc-900 pb-3 mb-3 flex px-2">
              <div className="font-semibold text-sm uppercase tracking-wider flex-1">Description</div>
              <div className="font-semibold text-sm uppercase tracking-wider w-24 text-right">Rate</div>
              <div className="font-semibold text-sm uppercase tracking-wider w-20 text-right">Qty</div>
              <div className="font-semibold text-sm uppercase tracking-wider w-28 text-right">Line Total</div>
            </div>
            
            <div className="space-y-3">
              {invoice.items.filter(item => item.description || item.quantity || item.rate).map((item) => (
                <div key={item.id} className="flex px-2 py-2 border-b border-zinc-100 last:border-0 hover:bg-zinc-50 transition-colors rounded-sm">
                  <div className="text-sm text-zinc-900 flex-1 pr-4">{item.description || "-"}</div>
                  <div className="text-sm text-zinc-600 w-24 text-right">{symbol}{item.rate.toFixed(2)}</div>
                  <div className="text-sm text-zinc-600 w-20 text-right">{item.quantity}</div>
                  <div className="text-sm font-medium text-zinc-900 w-28 text-right">{symbol}{(item.quantity * item.rate).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Calculations */}
        <div className="flex justify-end mb-12">
          <div className="w-full max-w-sm space-y-3 bg-white rounded-lg p-6 ring-1 ring-zinc-900/5">
            <div className="flex justify-between text-sm text-zinc-600">
              <span>Subtotal</span>
              <span>{symbol}{subTotal.toFixed(2)}</span>
            </div>
            
            {invoice.discount > 0 && (
              <div className="flex justify-between text-sm text-red-500">
                <span>Discount {invoice.discountType === 'percentage' ? `(${invoice.discount}%)` : ''}</span>
                <span>-{symbol}{discountAmount.toFixed(2)}</span>
              </div>
            )}
            
            {invoice.taxRate > 0 && (
              <div className="flex justify-between text-sm text-zinc-600">
                <span>Tax ({invoice.taxRate}%)</span>
                <span>{symbol}{taxAmount.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center text-[22px] font-extrabold border-t border-zinc-200 pt-4 mt-2 text-zinc-950 bg-blue-50/50 px-4 py-3 rounded-xl">
              <span>Total Due</span>
              <span className="text-blue-700">{symbol}{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer & Signature */}
        <div className="mt-auto border-t border-zinc-200 pt-8 pt-auto flex flex-col sm:flex-row justify-between items-end gap-8">
          <div className="text-sm text-zinc-500 max-w-sm text-left">
            {invoice.notes && (
              <div className="mb-4">
                <strong className="text-zinc-700 block mb-1">Notes</strong>
                <p className="whitespace-pre-wrap">{invoice.notes}</p>
              </div>
            )}
            {invoice.terms && (
              <div>
                <strong className="text-zinc-700 block mb-1">Terms</strong>
                <p className="whitespace-pre-wrap">{invoice.terms}</p>
              </div>
            )}
          </div>
          
          {/* Signature Zone */}
          {invoice.signature && (
             <div className="flex flex-col items-center">
               <div className="w-48 h-24 flex flex-col items-center justify-end">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img src={invoice.signature} alt="Signature" className="max-w-full max-h-[80px] object-contain mix-blend-multiply" />
               </div>
               
               {/* Only show the text if a name is actually provided */}
               {invoice.signatureName && invoice.signatureName.trim() !== "" && (
                 <div className="w-48 mt-2 text-center text-sm font-semibold text-zinc-900">
                   {invoice.signatureName}
                 </div>
               )}
             </div>
          )}
        </div>
        
        {/* Watermark Section */}
        {!isLoggedIn && (
           <div className="text-center pb-6 mt-8">
             <span className="text-xs font-medium text-zinc-300 pointer-events-none select-none">
               Created with InvoiceQuickly
             </span>
           </div>
        )}
      </div>
    </div>
  );
}
