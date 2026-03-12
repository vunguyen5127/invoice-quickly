import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — InvoiceQuickly",
  description: "Sign in to InvoiceQuickly to manage your invoices, companies, and dashboard. Free invoice generator with cloud storage.",
  alternates: { canonical: "/login" },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
