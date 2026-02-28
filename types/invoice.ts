export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
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
    name: "Acme Corp",
    email: "billing@acme.com",
    address: "123 Business Rd\nTech City, TC 90210",
    phone: "(555) 123-4567"
  },
  client: {
    name: "Globex Inc",
    email: "accounts@globex.com",
    address: "456 Corporate Blvd\nIndustry Town, IT 10001",
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
      description: "Web Design Services",
      quantity: 1,
      rate: 1500
    },
    {
      id: "2",
      description: "Frontend Development (hours)",
      quantity: 40,
      rate: 75
    }
  ],
  taxRate: 10,
  discount: 0,
  discountType: 'percentage',
  notes: "Thank you for your business. It's been a pleasure working with you.",
  terms: "Please pay within 14 days. Make checks payable to Acme Corp.",
  currency: "USD",
  signature: "",
  signatureName: ""
};
