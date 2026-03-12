import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2, Zap, Shield, Globe, Users, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About InvoiceQuickly — Free Invoice Generator for Everyone",
  description:
    "Learn about InvoiceQuickly, the free online invoice generator built for freelancers and small businesses. Generate invoices for free with no signup, no watermark, and instant PDF downloads.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans">
      <main className="container mx-auto px-4 py-20 max-w-5xl">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            About InvoiceQuickly — Free Invoice Generator
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            InvoiceQuickly is a <strong>free invoice generator</strong> built with a simple goal: to make professional invoicing accessible to everyone. We
            believe freelancers and small businesses deserve a fast, free online invoice generator — so they can spend less time on paperwork and more time
            doing what they love.
          </p>
        </div>

        {/* Why Us Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Why InvoiceQuickly?</h2>
            <div className="space-y-6">
              {[
                {
                  title: "Speed & Simplicity",
                  desc: "Create a beautiful, PDF-ready invoice in under 60 seconds with our intuitive live-preview editor.",
                  icon: <Zap className="w-5 h-5 text-amber-500" />,
                },
                {
                  title: "No Watermarks",
                  desc: "Unlike other free tools, we never add watermarks to your invoices. Your brand remains your brand.",
                  icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
                },
                {
                  title: "Privacy First",
                  desc: "Your data is yours. We use secure encryption and never sell your information to third parties.",
                  icon: <Shield className="w-5 h-5 text-blue-500" />,
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1 flex-shrink-0 w-10 h-10 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center border border-zinc-100 dark:border-zinc-800">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{item.title}</h3>
                    <p className="text-zinc-500 dark:text-zinc-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 p-8 rounded-3xl border border-blue-100 dark:border-blue-900/20">
            <div className="aspect-square bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 flex flex-col justify-between border border-zinc-100 dark:border-zinc-800">
              <div className="space-y-2">
                <div className="h-4 w-24 bg-blue-100 dark:bg-blue-900/40 rounded-full" />
                <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full" />
                <div className="h-2 w-2/3 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-zinc-50 dark:border-zinc-800">
                    <div className="h-2 w-20 bg-zinc-50 dark:bg-zinc-800 rounded-full" />
                    <div className="h-2 w-12 bg-zinc-50 dark:bg-zinc-800 rounded-full" />
                  </div>
                ))}
              </div>
              <div className="h-10 w-full bg-blue-600 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-12">Built for Modern Businesses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "20+ Languages",
                desc: "Support for global businesses with Arabic (RTL), Japanese, Vietnamese, and more.",
                icon: <Globe className="w-6 h-6 text-violet-500" />,
              },
              {
                title: "Multi-Company",
                desc: "Manage multiple brands and invoice histories from a single, unified dashboard.",
                icon: <Users className="w-6 h-6 text-pink-500" />,
              },
              {
                title: "Instant Sharing",
                desc: "Generate secure, unguessable links to share with your clients for instant viewing.",
                icon: <ArrowRight className="w-6 h-6 text-blue-500" />,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-8 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:border-blue-500/30 transition-all group"
              >
                <div className="mb-4 w-12 h-12 rounded-xl bg-white dark:bg-zinc-900 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-slate-900 dark:bg-zinc-900 py-16 px-6 rounded-[2rem] text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to generate invoices for free?</h2>
          <p className="text-zinc-400 mb-10 max-w-xl mx-auto">
            Join thousands of freelancers and small businesses who use our free invoice generator every day.
          </p>
          <Link
            href="/generator?new=1"
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-lg font-bold shadow-lg transition-all hover:bg-blue-700 hover:-translate-y-1"
          >
            Try the Free Invoice Generator
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-12 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="container mx-auto px-4 text-center text-zinc-500 dark:text-zinc-400 text-sm">
          <p>&copy; {new Date().getFullYear()} InvoiceQuickly. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
