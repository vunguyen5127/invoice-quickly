import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — Manage Your Invoices",
  description: "View and manage all your invoices from one dashboard. InvoiceQuickly's free invoice generator with invoice history and company management.",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
