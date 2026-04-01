import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2, Zap, Shield, Globe, Users, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About Invoice-Quickly — Free Invoice Generator for Everyone",
  description:
    "Learn about Invoice-Quickly, the free online invoice generator built for freelancers and small businesses. Generate invoices for free with no signup, no watermark, and instant PDF downloads.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans">
      <main className="container mx-auto px-4 sm:px-8 pt-10 pb-20 sm:pt-16 sm:pb-20 max-w-5xl">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            About Invoice-Quickly — Free Invoice Generator
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            Invoice-Quickly is a <strong>free invoice generator</strong> built with a simple goal: to make professional invoicing accessible to everyone. We
            believe freelancers and small businesses deserve a fast, free online invoice generator — so they can spend less time on paperwork and more time
            doing what they love.
          </p>
        </div>

        {/* Why Us Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Why Invoice-Quickly?</h2>
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

        {/* Trust Signals & Editorial Policy */}
        <div className="mb-24 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Editorial Policy */}
          <div className="bg-slate-50 dark:bg-zinc-900/40 p-10 rounded-3xl border border-slate-100 dark:border-zinc-800">
             <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Our Editorial Policy</h2>
             <p className="text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
               At Invoice-Quickly, we believe in radical transparency. Our guides, reviews, and invoice templates are created by financial professionals and edited for absolute neutrality.
             </p>
             <ul className="space-y-3 mb-6 font-medium text-slate-700 dark:text-zinc-300">
               <li className="flex gap-3 items-start"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5"/> We do not accept paid reviews.</li>
               <li className="flex gap-3 items-start"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5"/> We independently test every tool we compare.</li>
               <li className="flex gap-3 items-start"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5"/> Our content is regularly vetted for legal and financial accuracy.</li>
             </ul>
             <Link href="/blog" className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-2">
                Read our Educational Hub <ArrowRight className="w-4 h-4"/>
             </Link>
          </div>

          {/* How We Make Money */}
          <div className="bg-blue-50 dark:bg-blue-900/10 p-10 rounded-3xl border border-blue-100 dark:border-blue-900/20">
             <h2 className="text-2xl font-bold mb-6 text-blue-900 dark:text-blue-100">How We Keep It Free</h2>
             <p className="text-zinc-700 dark:text-zinc-300 mb-4 leading-relaxed">
               We hate hidden fees as much as you do. Invoice-Quickly offers a genuinely free tier that covers 90% of a freelancer's needs without watermarks or time limits.
             </p>
             <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4">
               <strong>So, how do we make money?</strong> We are supported by our Pro subscribers—larger teams and agencies who pay a transparent monthly fee (currently $10/mo) for advanced features like multi-company management, unlimited history, and priority support. 
             </p>
             <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
               This freemium model ensures that the core generator remains accessible to everyone forever, subsidized by power users who need enterprise-grade scale.
             </p>
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
    </div>
  );
}
