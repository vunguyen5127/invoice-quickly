import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Invoice Generator — Create & Download PDF Invoices Online",
  description:
    "Use our free invoice generator to create professional invoices online. Generate invoices for free, download as PDF instantly — no signup, no watermark. The best free online invoice generator.",
  alternates: { canonical: "/generator" },
};

export default function GeneratorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
