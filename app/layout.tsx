import { LogUserSession } from "@/components/log-user-session";
import { RtlProvider } from "@/components/rtl-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/contexts/language-context";
import { Toaster } from "sonner";
import type { Metadata, Viewport } from "next";
import {
  Inter,
  Noto_Sans,
  Noto_Sans_Arabic,
  Noto_Sans_Devanagari,
  Noto_Sans_JP,
  Noto_Sans_KR,
  Noto_Sans_SC,
  Noto_Sans_Thai,
} from "next/font/google";
import "./globals.css";



const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const notoGlobal = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["cyrillic"],
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
    default: "Free Invoice Generator — No Sign Up, No Watermark | Invoice-Quickly",
    template: "%s | Invoice-Quickly",
  },
  description:
    "Free invoice generator online. Create professional invoices in seconds — no signup required, no watermark, instant PDF download. The best free invoice maker for freelancers & small businesses.",
  keywords: [
    "free invoice generator",
    "invoice generator",
    "free invoice maker",
    "online invoice generator",
    "create invoice free",
    "invoice maker",
    "free invoice generator no sign up",
    "invoice generator no watermark",
    "pdf invoice generator free",
    "free invoice template",
    "billing software free",
    "freelance invoice maker",
  ],
  metadataBase: new URL("https://invoice-quickly.com"),
  openGraph: {
    type: "website",
    siteName: "Invoice-Quickly",
    title: "Free Invoice Generator Online | No Signup, No Watermark | Invoice-Quickly",
    description: "Free invoice generator online. Create professional PDF invoices in seconds — no signup, no watermark. The best free invoice maker for freelancers & small businesses.",
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
    title: "Free Invoice Generator Online | No Signup, No Watermark | Invoice-Quickly",
    description: "Free invoice generator online. Create professional PDF invoices in seconds — no signup, no watermark. The best free invoice maker for freelancers & small businesses.",
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
  // NOTE: Do NOT set a global canonical here.
  // Each page declares its own `alternates.canonical` to avoid
  // all sub-pages (blog, pricing, etc.) being treated as duplicates of the homepage.
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
import { DataProvider } from "@/contexts/data-context";
import Script from "next/script";

const GA_MEASUREMENT_ID = "G-SHEBZLWDDC";
const GOOGLE_ADS_ID = "AW-17800091853";

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
    <html 
      lang="en" 
      suppressHydrationWarning 
      className={`${inter.variable} ${notoGlobal.variable} ${notoJP.variable} ${notoKR.variable} ${notoSC.variable} ${notoArabic.variable} ${notoDevanagari.variable} ${notoThai.variable} font-sans`}
    >
      <head>
        <ClientMetadata />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      {/* Google Analytics 4 — loads after page render, no performance impact */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
          gtag('config', '${GOOGLE_ADS_ID}');
        `}
      </Script>
      <body className="antialiased min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Toaster
            position="top-right"
            richColors
            closeButton
            offset={{ top: 12, right: 24 }}
            toastOptions={{
              style: { marginTop: "0px" },
            }}
          />
          <AuthProvider>
            <DataProvider>
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
            </DataProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
