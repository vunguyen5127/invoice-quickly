"use client";

import { useLanguage } from "@/contexts/language-context";
import { getCurrencySymbol } from "@/types/invoice";
import { format } from "date-fns";
import React from "react";

interface InvoicePreviewProps {
  invoice: any;
  isLoggedIn?: boolean;
  compact?: boolean;
  docType?: 'invoice' | 'quote';
}

export function InvoicePreview({ invoice, isLoggedIn = false, compact = false, docType = 'invoice' }: InvoicePreviewProps) {
  const [scale, setScale] = React.useState(1);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!containerRef.current) return;
    
    const updateScale = (width: number) => {
      // 794px is our standard A4 wrapper width minimum
      setScale(Math.min(width / 794, 1));
    };
    
    // Initial 
    updateScale(containerRef.current.clientWidth);

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        updateScale(entry.contentRect.width);
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);
  const { t } = useLanguage();
  const symbol = getCurrencySymbol(invoice.currency);

  const subTotal = invoice.items.filter((item: any) => item.description || item.quantity || item.rate).reduce((acc: number, item: any) => acc + (item.quantity * item.rate), 0);
  
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
    <div ref={containerRef} className="w-full">
      <div 
        className="mx-auto bg-white text-zinc-900 overflow-hidden rounded-[5px] border" 
        style={{
          width: "100%",
          minWidth: "210mm",     // Force A4 width minimum
          maxWidth: "210mm",     // A4 width
          borderColor: '#0070f3',
          ...(scale < 1 ? { zoom: scale } : {}), // dynamically scale down to fit container using zoom
        } as React.CSSProperties}
      >
      <div 
        id="invoice-capture-area" 
        className="w-full bg-white flex flex-col text-zinc-900 relative pb-10" 
        style={{ 
          minHeight: compact ? "auto" : "297mm",    // A4 height or auto
          padding: "12mm 12mm",  // Reduced margins to fit more content
        }}
      >
        {/* Watermark Background — quotes only */}
        {docType === 'quote' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
            <span className="text-[90px] md:text-[90px] font-black tracking-[0.1em] text-zinc-900/[0.03] -rotate-45 whitespace-nowrap">
              Invoice-Quickly
            </span>
          </div>
        )}

        {/* Quote Header Note */}
        {docType === 'quote' && (
          <div className="absolute top-4 left-0 right-0 text-center z-10">
            <span className="text-zinc-400 italic text-[10px] font-medium tracking-wide">
              * {(t as any).quoteNote || "This document is a formal quotation and does not serve as a tax invoice."}
            </span>
          </div>
        )}

        {/* Top Company Logo/Name Row */}
        <div className="flex justify-between items-start mb-8">
           <div className="space-y-1 flex-1 min-w-0">
             <h2 className="text-2xl font-bold tracking-tight text-zinc-900">{invoice.company.name.split(/,|\n/)[0]}</h2>
             <div className="text-[12px] text-zinc-500 max-w-xs">
                {invoice.company.name.split(/,|\n/).slice(1).map((line: string, idx: number) => (
                  <p key={idx}>{line.trim()}</p>
                ))}
             </div>
           </div>
           {invoice.company.logo && (
             <div className="shrink-0 ml-6">
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img src={invoice.company.logo} alt="Company Logo" className="max-w-[240px] max-h-[100px] object-contain rounded-sm" />
             </div>
           )}
        </div>

        {/* 3-Column Header Area - Uses grid for horizontal stability */}
        <div className="grid grid-cols-3 gap-8 mb-8 text-[13px] items-start">
           {/* Column 1: Bill To */}
           <div className="flex-1 min-w-0">
             <p className="font-bold mb-2 uppercase tracking-wide text-zinc-400 text-[11px]">{t.billedTo || "Bill To"}</p>
             <div className="text-zinc-600 space-y-0.5 leading-tight break-words">
               <p className="font-bold text-zinc-900 text-[15px]">{invoice.client.name.split(/,|\n/)[0] || "-"}</p>
               <div className="text-[13px] text-zinc-600">
                  {invoice.client.name.split(/,|\n/).slice(1).map((line: string, idx: number) => (
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
                   <p className="font-bold text-zinc-900 text-[15px]">{invoice.client.shipTo.split(/,|\n/)[0] || "-"}</p>
                   <div className="text-[13px] text-zinc-600">
                      {invoice.client.shipTo.split(/,|\n/).slice(1).map((line: string, idx: number) => {
                        const trimmedLine = line.trim();
                        return trimmedLine ? <p key={idx}>{trimmedLine}</p> : null;
                      })}
                   </div>
                 </div>
               </>
             )}
           </div>

           {/* Column 3: Invoice Details Block */}
            <div className="flex-1 min-w-0 flex justify-end">
              <div>
                <p className="font-bold mb-2 uppercase tracking-wide text-transparent text-[11px] select-none pointer-events-none">{"\u00A0"}</p>
                <div className="grid grid-cols-[auto_auto] gap-x-5 gap-y-2 text-left">
                  <span className="font-medium text-zinc-500 whitespace-nowrap">{docType === 'quote' ? 'Quote Number' : t.invoiceNumber}:{"\u00A0"}</span>
                  <span className="font-semibold text-zinc-900 whitespace-nowrap">#{docType === 'quote' ? invoice.details.quoteNumber : invoice.details.invoiceNumber}</span>
                  
                  <span className="font-medium text-zinc-500 whitespace-nowrap">{t.issueDate}:{"\u00A0"}</span>
                  <span className="font-semibold text-zinc-900 whitespace-nowrap">{formatDate(invoice.details.issueDate)}</span>
                  
                  <span className="font-medium text-zinc-500 whitespace-nowrap">{docType === 'quote' ? 'Valid Until' : t.dueDate}:{"\u00A0"}</span>
                  <span className="font-semibold text-zinc-900 whitespace-nowrap">{formatDate(invoice.details.dueDate)}</span>
                </div>
              </div>
            </div>
        </div>

        {/* Full Grid Table */}
        <div className="mb-0">
          <table className="w-full border-collapse border border-zinc-300">
            <thead>
              <tr className="bg-zinc-100 divide-x divide-zinc-300 border-b border-zinc-300">
                <th className="py-2 px-3 text-left text-[11px] font-bold uppercase tracking-wider text-zinc-500">{t.description}</th>
                <th className="w-20 py-2 px-3 text-center text-[11px] font-bold uppercase tracking-wider text-zinc-500">{t.qty}</th>
                <th className="w-28 py-2 px-3 text-right text-[11px] font-bold uppercase tracking-wider text-zinc-500">{t.rate}</th>
                <th className="w-28 py-2 px-3 text-right text-[11px] font-bold uppercase tracking-wider text-zinc-500">{t.lineTotal || "Total"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-300">
              {invoice.items.filter((item: any) => item.description || item.quantity || item.rate).map((item: any) => (
                <tr key={item.id} className="divide-x divide-zinc-300">
                  <td className="py-3 px-3 text-left align-top whitespace-pre-wrap text-[13px] font-medium text-zinc-700">{item.description || "-"}</td>
                  <td className="py-3 px-3 text-center align-top text-[13px] text-zinc-700">{item.quantity}</td>
                  <td className="py-3 px-3 text-right align-top text-[13px] text-zinc-700">{formatAmount(item.rate)}</td>
                  <td className="py-3 px-3 text-right align-top text-[13px] font-bold text-zinc-900">{formatAmount(item.quantity * item.rate)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Table Summary Section - Numeric Boxed Style */}
          <div className="flex justify-end mt-0">
            <div className="w-[calc(19rem+2px)]">
              <div className="flex">
                <div className="flex-1 py-2 px-4 text-right font-medium text-[13px] text-zinc-600">{t.subtotal}</div>
                <div className="w-28 py-2 px-4 text-right font-bold text-[13px] border-l border-r border-t border-b border-zinc-300 text-zinc-900">{formatAmount(subTotal)}</div>
              </div>

              {invoice.discount > 0 && (
                <div className="flex">
                  <div className="flex-1 py-1 px-4 text-right font-medium text-[13px] text-zinc-600">
                    {(invoice.discountLabel === 'Discount' ? '' : invoice.discountLabel) || t.discount} {invoice.discountType === 'percentage' && invoice.discount > 0 ? `(${invoice.discount.toFixed(1)}%)` : ""}
                  </div>
                  <div className="w-28 py-1 px-4 text-right font-bold text-[13px] border-l border-r border-b border-zinc-300 text-zinc-900">-{formatAmount(discountAmount)}</div>
                </div>
              )}

              {invoice.taxRate > 0 && (
                <div className="flex">
                  <div className="flex-1 py-1 px-4 text-right font-medium text-[13px] text-zinc-600">
                    {(invoice.taxLabel === 'Tax' ? '' : invoice.taxLabel) || t.tax} {invoice.taxType === 'percentage' && invoice.taxRate > 0 ? `(${invoice.taxRate.toFixed(1)}%)` : ""}
                  </div>
                   <div className="w-28 py-1 px-4 text-right font-bold text-[13px] border-l border-r border-b border-zinc-300 text-zinc-900">{formatAmount(taxAmount)}</div>
                </div>
              )}

              {invoice.shipping > 0 && (
                <div className="flex">
                  <div className="flex-1 py-1 px-4 text-right font-medium text-[13px] text-zinc-600">{(invoice.shippingLabel === 'Shipping' ? '' : invoice.shippingLabel) || t.shipping}</div>
                   <div className="w-28 py-1 px-4 text-right font-bold text-[13px] border-l border-r border-b border-zinc-300 text-zinc-900">{formatAmount(invoice.shipping || 0)}</div>
                </div>
              )}

              <div className="flex">
                <div className="flex-1 py-4 px-4 text-right font-bold text-[15px] text-zinc-900">{t.totalDue}</div>
                <div className="w-28 py-4 px-4 text-right font-bold text-[15px] border-l border-r border-b-2 border-zinc-300 text-zinc-900">
                  {symbol}{formatAmount(total)}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Side-by-Side Footer: Notes/Terms on left, Signature on right */}
        <div className={`mt-8 py-4 flex flex-row justify-between items-end gap-12 ${compact ? 'pb-2' : ''}`}>
          {/* Left: Notes & Terms */}
          <div className="flex-1 min-w-0">
            {invoice.notes && invoice.showNotes && (
              <div className="mb-2">
                <p className="font-bold text-zinc-900 mb-0 uppercase tracking-widest text-[10px] inline-block pr-8">{t.notes}</p>
                <p className="text-[10px] text-zinc-600 whitespace-pre-wrap leading-snug">{invoice.notes}</p>
              </div>
            )}
            {invoice.terms && invoice.showTerms && (
              <div className="mb-0">
                <p className="font-bold text-zinc-900 mb-0 uppercase tracking-widest text-[10px] inline-block pr-8">{t.termsConditions}</p>
                <p className="text-[10px] text-zinc-600 whitespace-pre-wrap leading-snug">{invoice.terms}</p>
              </div>
            )}
          </div>

          {/* Right: Signature Area Area */}
          <div className="shrink-0">
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
        </div>

      </div>
    </div>
  </div>
  );
}
