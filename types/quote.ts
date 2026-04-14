import { ClientDetails, CompanyDetails, InvoiceItem } from './invoice';

export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'invoiced';

export const QUOTE_STATUS_CONFIG: Record<QuoteStatus, { color: string; bg: string; darkBg: string; border: string }> = {
  draft:    { color: 'text-zinc-600 dark:text-zinc-400',   bg: 'bg-zinc-100',    darkBg: 'dark:bg-zinc-800',    border: 'border-zinc-200 dark:border-zinc-700' },
  sent:     { color: 'text-blue-700 dark:text-blue-300',    bg: 'bg-blue-50',     darkBg: 'dark:bg-blue-900/30', border: 'border-blue-200 dark:border-blue-800' },
  accepted: { color: 'text-emerald-700 dark:text-emerald-300', bg: 'bg-emerald-50', darkBg: 'dark:bg-emerald-900/30', border: 'border-emerald-200 dark:border-emerald-800' },
  rejected: { color: 'text-red-700 dark:text-red-300',      bg: 'bg-red-50',      darkBg: 'dark:bg-red-900/30',  border: 'border-red-200 dark:border-red-800' },
  invoiced: { color: 'text-purple-700 dark:text-purple-300', bg: 'bg-purple-50', darkBg: 'dark:bg-purple-900/30', border: 'border-purple-200 dark:border-purple-800' },
};

export interface QuoteDetails {
  quoteNumber: string;
  issueDate: string;
  dueDate: string; /* Often "Valid Until" for quotes */
}

export interface QuoteState {
  id?: string;
  invoice_id?: string; // If it has been converted
  company: CompanyDetails;
  client: ClientDetails;
  details: QuoteDetails;
  items: InvoiceItem[];
  taxRate: number; // percentage
  discount: number; // percentage or fixed
  shipping: number;
  discountType: 'percentage' | 'fixed';
  taxType: 'percentage' | 'fixed';
  taxLabel?: string;
  discountLabel?: string;
  shippingLabel?: string;
  notes: string;
  terms: string;
  currency: string;
  signature?: string;
  signatureName?: string;
  showNotes: boolean;
  showTerms: boolean;
}

export const initialQuoteState: QuoteState = {
  company: {
    name: "Invoice-Quickly LLC, 742 Evergreen Ave Suite 200, San Francisco CA 94107, vu.nguyen@invoice-quickly.com, +1 (123) 456-7890",
    email: "",
    address: "",
    phone: ""
  },
  client: {
    name: "Greenfield Properties LLC, 1200 Market Street Floor 8 New York NY 10001, billing@greenfield.com, +1(321) 555-7799",
    email: "",
    address: "",
    phone: ""
  },
  details: {
    quoteNumber: "EST-2026-001",
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Valid for 30 days
  },
  items: [
  ],
  taxRate: 10,
  taxLabel: "",
  discount: 0,
  discountLabel: "",
  discountType: 'percentage',
  taxType: 'percentage',
  shipping: 0,
  shippingLabel: "",
  notes: "Thank you for the opportunity to quote. We look forward to working with you.",
  terms: "This quote is valid for 30 days. Prices are subject to change after expiration.",
  currency: "USD",
  signature: "",
  signatureName: "",
  showNotes: false,
  showTerms: false,
};
