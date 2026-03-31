import type { Metadata } from "next";

export const metadata: Metadata = {
  // Action-intent keywords: user is ready to CREATE — not searching/comparing.
  // Keeps this page from cannibalizing the homepage's discovery-intent rankings.
  title: "Create Invoice Online — Free PDF Invoice Maker | Invoice-Quickly",
  description:
    "Create a professional invoice online in seconds. Fill in your details, preview in real-time, and download a clean PDF instantly — no account needed, no watermark.",
  alternates: { canonical: "/generator" },
  robots: {
    // Let Google index this page, but don't include it in image/snippet previews
    // that would compete with the homepage in discovery searches.
    index: true,
    follow: true,
  },
};

export default function GeneratorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
