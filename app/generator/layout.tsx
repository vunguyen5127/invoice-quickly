import type { Metadata } from "next";

export const metadata: Metadata = {
  // Action-intent: user is ready to CREATE — matches "free invoice generator" searches
  title: "Free Invoice Generator — Create & Download PDF Invoices | Invoice-Quickly",
  description:
    "Use our free invoice generator to create professional PDF invoices online in seconds. No signup, no watermark. Fill in details, preview live, and download instantly — the fastest free online invoice maker.",
  alternates: { canonical: "/generator" },
  robots: {
    index: true,
    follow: true,
  },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Invoice-Quickly Free Invoice Generator",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  url: "https://invoice-quickly.com/generator",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free to use. No signup required.",
  },
  featureList: [
    "Free PDF invoice download",
    "No watermark on exports",
    "No account or signup required",
    "Live invoice preview",
    "20+ languages including Arabic RTL",
    "18+ currencies",
    "Shareable invoice links",
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    ratingCount: "2847",
    bestRating: "5",
  },
};

export default function GeneratorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      {children}
    </>
  );
}
