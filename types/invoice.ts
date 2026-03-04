export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  billingStart?: string;
  billingEnd?: string;
}

export interface InvoiceDetails {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
}

export interface CompanyDetails {
  logo?: string;
  name: string;
  email: string;
  address: string;
  phone: string;
}

export interface ClientDetails {
  name: string;
  email: string;
  address: string;
  phone: string;
}

export interface InvoiceState {
  company: CompanyDetails;
  client: ClientDetails;
  details: InvoiceDetails;
  items: InvoiceItem[];
  taxRate: number; // percentage
  discount: number; // percentage or fixed (we will treat as fixed amount for simplicity, or percent depending on UI)
  discountType: 'percentage' | 'fixed';
  notes: string;
  terms: string;
  currency: string;
  signature?: string;
  signatureName?: string;
}

export const initialInvoiceState: InvoiceState = {
  company: {
    name: "InvoiceQuicklyCorp, 123 Professional Way, San Francisco, CA 94105, billing@InvoiceQuickly.net, +1 (415) 555-0123",
    email: "",
    address: "",
    phone: ""
  },
  client: {
    name: "Globex Inc",
    email: "accounts@globex.com",
    address: "456 Corporate Blvd, Industry Town, IT 10001",
    phone: "(555) 987-6543"
  },
  details: {
    invoiceNumber: "INV-2026-001",
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  },
  items: [
    {
      id: "1",
      description: "InvoiceQuicklySeller Growth Plan (Monthly) — Mar 03, 2026 to Apr 03, 2026",
      quantity: 1,
      rate: 69.00,
      billingStart: "2026-03-03",
      billingEnd: "2026-04-03"
    }
  ],
  taxRate: 0,
  discount: 0,
  discountType: 'percentage',
  notes: "Thank you for subscribing to InvoiceQuickly! Your growth is our priority.",
  terms: "Paid via subscription billing.\nQuestions? Contact support@InvoiceQuickly.net",
  currency: "USD",
  signature: "",
  signatureName: ""
};
