import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — InvoiceQuickly",
  description: "Get in touch with InvoiceQuickly. Have questions about our free invoice generator? We'd love to hear from you.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
