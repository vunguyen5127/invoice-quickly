import { LogUserSession } from "@/components/log-user-session";
import { RtlProvider } from "@/components/rtl-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/contexts/language-context";
import type { Metadata, Viewport } from "next";
import {
  Be_Vietnam_Pro,
  Geist,
  Geist_Mono,
  Noto_Sans,
  Noto_Sans_Arabic,
  Noto_Sans_Devanagari,
  Noto_Sans_JP,
  Noto_Sans_KR,
  Noto_Sans_SC,
  Noto_Sans_Thai,
} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const notoGlobal = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin", "latin-ext", "cyrillic", "vietnamese"],
  weight: ["400", "500", "700", "800", "900"],
  display: "swap",
});

const notoJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const notoKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const notoSC = Noto_Sans_SC({
  variable: "--font-noto-sans-sc",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const notoArabic = Noto_Sans_Arabic({
  variable: "--font-noto-sans-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const notoDevanagari = Noto_Sans_Devanagari({
  variable: "--font-noto-sans-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const notoThai = Noto_Sans_Thai({
  variable: "--font-noto-sans-thai",
  subsets: ["thai"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Free Invoice Generator Online — Create & Download PDF Invoices | Invoice-Quickly",
    template: "%s | Invoice-Quickly",
  },
  description:
    "Generate invoices for free with Invoice-Quickly — the free online invoice generator. Create professional PDF invoices in seconds, no signup required. Free forever, no watermark.",
  keywords: [
    "invoice generator free",
    "free invoice generator",
    "invoice generator online free",
    "free online invoice generator",
    "online free invoice generator",
    "invoice generator for free",
    "free invoice generators",
    "generate invoice for free",
    "free pdf invoice generator",
    "invoice maker free",
    "free invoice template",
    "create invoice online",
    "invoice pdf download free",
  ],
  metadataBase: new URL("https://invoice-quickly.com"),
  openGraph: {
    type: "website",
    siteName: "Invoice-Quickly",
    title: "Free Invoice Generator Online — Create & Download PDF Invoices | Invoice-Quickly",
    description: "Generate invoices for free with Invoice-Quickly. Create professional PDF invoices in seconds — no signup, no watermark, free forever.",
    url: "https://invoice-quickly.com",
    images: [
      {
        url: "https://invoice-quickly.com/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "Invoice-Quickly Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Invoice Generator Online | Invoice-Quickly",
    description: "Create and download professional PDF invoices for free. No signup, no watermark — the best free online invoice generator.",
    images: ["https://invoice-quickly.com/android-chrome-512x512.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://invoice-quickly.com",
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon.ico", sizes: "48x48" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
    ],
    shortcut: "/favicon-32x32.png",
    other: [
      { rel: "manifest", url: "/site.webmanifest" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
};

import BillingScript from "@/components/billing-script";
import ClientMetadata from "@/components/client-metadata";
import { AuthProvider } from "@/contexts/auth-context";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Invoice-Quickly",
  url: "https://invoice-quickly.com",
  logo: {
    "@type": "ImageObject",
    url: "https://invoice-quickly.com/android-chrome-512x512.png",
    width: 512,
    height: 512,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ClientMetadata />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${beVietnam.variable} ${notoGlobal.variable} ${notoJP.variable} ${notoKR.variable} ${notoSC.variable} ${notoArabic.variable} ${notoDevanagari.variable} ${notoThai.variable} antialiased min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <LanguageProvider>
              <RtlProvider />
              <BillingScript />
              <LogUserSession />
              <div className="flex flex-col min-h-screen">
                <SiteHeader />
                <main className="flex-1">{children}</main>
                <SiteFooter />
              </div>
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
