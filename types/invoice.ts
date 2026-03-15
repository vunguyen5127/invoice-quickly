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
  shipTo?: string;
}

export interface InvoiceState {
  id?: string;
  company: CompanyDetails;
  client: ClientDetails;
  details: InvoiceDetails;
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

export const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿' },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫' },
];

export const getCurrencySymbol = (code: string) => {
  return CURRENCIES.find(c => c.code === code)?.symbol || '$';
};

export const initialInvoiceState: InvoiceState = {
  company: {
    name: "Bright Studio Design, 742 Evergreen Ave Suite 200, San Francisco CA 94107, hello@brightstudio.io, +1 (415) 555-0192",
    email: "",
    address: "",
    phone: ""
  },
  client: {
    name: "Greenfield Properties LLC, 1200 Market Street, Floor 8 New York, NY 10001, ap@greenfieldproperties.com, (212) 555-0847",
    email: "",
    address: "",
    phone: ""
  },
  details: {
    invoiceNumber: "INV-2026-001",
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  },
  items: [
    {
      id: "1",
      description: "Wireless Bluetooth Headphones",
      quantity: 2,
      rate: 49.99,
    },
    {
      id: "2",
      description: "USB-C Fast Charging Cable (2m)",
      quantity: 5,
      rate: 12.99,
    },
    {
      id: "3",
      description: "Stainless Steel Water Bottle 750ml",
      quantity: 3,
      rate: 24.50,
    },
    {
      id: "4",
      description: "Organic Green Tea — 100 bags",
      quantity: 1,
      rate: 18.75,
    },
    {
      id: "5",
      description: "LED Desk Lamp with USB Port",
      quantity: 2,
      rate: 35.00,
    }
  ],
  taxRate: 10,
  taxLabel: "",
  discount: 0,
  discountLabel: "",
  discountType: 'percentage',
  taxType: 'percentage',
  shipping: 0,
  shippingLabel: "",
  notes: "Thank you for your business! We appreciate your prompt payment.",
  terms: "Payment is due within 14 days of the invoice date. Late payments may incur a 1.5% monthly fee.",
  currency: "USD",
  signature: "",
  signatureName: "",
  showNotes: false,
  showTerms: false
};
