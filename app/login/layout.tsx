import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — Invoice Quickly",
  description: "Securely sign in to Invoice Quickly. Create, manage, and send professional invoices in seconds with our cloud-based software for businesses and freelancers.",
  alternates: { canonical: "https://invoice-quickly.com/login" },
  openGraph: {
    title: "Sign In to Invoice Quickly",
    description: "Access your dashboard to create and track professional invoices instantly.",
    url: "https://invoice-quickly.com/login",
    siteName: "Invoice Quickly",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign In — Invoice Quickly",
    description: "Access your dashboard to create and track professional invoices instantly.",
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
