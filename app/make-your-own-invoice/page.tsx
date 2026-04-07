import { FAQItem, FeatureCard, TestimonialCard } from "@/components/marketing-components";
import { ArrowRight, CheckCircle2, CreditCard, FileText, Globe, Shield, Sparkles, Users, Zap } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Make Your Own Invoice Online — Free, No Sign Up",
  description:
    "Make your own invoice online in 60 seconds. Free PDF download, no watermark, no account required. The easiest way to create your own professional invoice for freelancers and small businesses in Australia & Canada.",
  keywords: [
    "make your own invoice",
    "make my own invoice",
    "create your own invoice",
    "make an invoice online free",
    "make my own invoice free",
    "make your own invoice free",
    "free invoice maker",
    "invoice generator no sign up",
    "free invoice generator australia",
    "free invoice generator canada",
    "GST invoice australia",
    "HST invoice canada",
  ],
  alternates: { canonical: "https://invoice-quickly.com/make-your-own-invoice" },
  robots: { index: true, follow: true },
};

export default function MakeYourOwnInvoicePage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] overflow-x-hidden bg-white dark:bg-zinc-950">

      {/* ══════════════════════════════════════════════
          1. HERO SECTION — 2-column split with video
      ══════════════════════════════════════════════ */}
      <section className="relative px-4 pt-6 md:pt-10 lg:pt-12 pb-12 sm:pb-16 sm:px-6 lg:px-8 overflow-hidden">
        {/* Glow blobs */}
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center overflow-hidden">
          <div className="h-[600px] w-[1200px] rounded-full bg-gradient-to-br from-blue-400/25 via-indigo-300/15 to-violet-300/10 blur-3xl dark:from-blue-600/20 dark:via-indigo-500/10 dark:to-violet-600/10" />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

            {/* ── LEFT: Copy & CTA ── */}
            <div className="w-full lg:w-[46%] shrink-0 text-left">
              {/* Badge */}
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700 shadow-sm dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                <Sparkles className="h-4 w-4" />
                Make Your Own Invoice — Free Forever
              </div>

              {/* H1 */}
              <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white md:text-5xl lg:text-[3.25rem]">
                Make Your Own Invoice{" "}
                <span className="text-blue-600 dark:text-blue-400">No Sign Up</span>
              </h1>

              <p className="mb-3 text-lg font-medium text-slate-600 dark:text-slate-400">
                Create a professional invoice in 60 seconds, download a clean PDF and send it instantly.
              </p>
              <p className="hidden sm:block mb-8 text-base leading-relaxed text-slate-500 dark:text-zinc-400">
                No account, no watermark, instant PDF export and secure share links for clients.
              </p>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-7">
                <Link
                  href="/generator?new=1"
                  id="hero-cta-primary"
                  className="group inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-b from-primary to-primary/90 px-8 py-4 text-lg font-semibold text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:shadow-2xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
                >
                  Make Invoice Free
                  <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1.5" />
                </Link>
                <p className="text-sm text-slate-500 dark:text-zinc-500">No account needed · Instant PDF</p>
              </div>

              {/* Feature pills */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-slate-600 dark:text-zinc-400 mb-7">
                {["No signup needed", "GST-ready (AU & CA)", "No watermark", "Instant PDF"].map((item) => (
                  <span key={item} className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-green-500 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </span>
                ))}
              </div>

              {/* Trust badge — hidden on mobile, shown on desktop in left column */}
              <div className="hidden sm:flex items-center gap-3">
                <div className="flex -space-x-3">
                  {[
                    "bg-gradient-to-br from-pink-400 to-rose-500",
                    "bg-gradient-to-br from-blue-400 to-indigo-500",
                    "bg-gradient-to-br from-amber-400 to-orange-500",
                    "bg-gradient-to-br from-emerald-400 to-teal-500",
                  ].map((grad, i) => (
                    <div key={i} className={`w-9 h-9 rounded-full ring-2 ring-white dark:ring-zinc-900 ${grad} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                      {["A", "B", "C", "D"][i]}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium">
                  Trusted by <span className="text-slate-900 dark:text-white font-semibold">5,000+</span> freelancers in AU & CA
                </p>
              </div>
            </div>

            {/* ── RIGHT: Video mockup ── */}
            <div className="w-full lg:w-[54%] shrink-0">
              <div className="rounded-xl border border-slate-200/80 dark:border-zinc-700/70 shadow-2xl shadow-slate-900/15 overflow-hidden">
                {/* macOS browser chrome */}
                <div className="bg-slate-100/80 dark:bg-zinc-800 px-4 py-3 flex items-center gap-2 border-b border-slate-200 dark:border-zinc-700">
                  <span className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400" />
                  <span className="w-3 h-3 rounded-full bg-green-400" />
                  <div className="ml-3 flex-1 bg-white dark:bg-zinc-700 rounded-md px-3 py-1 text-xs text-slate-400 dark:text-zinc-400 font-mono text-left">
                    invoice-quickly.com
                  </div>
                </div>
                <div className="aspect-video relative">
                  <iframe
                    src="https://www.youtube.com/embed/xOE5E9EIDCQ?rel=0&modestbranding=1&autoplay=1&mute=1&loop=1&playlist=xOE5E9EIDCQ"
                    title="Make Your Own Invoice Free — Invoice-Quickly Demo"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full"
                    loading="eager"
                  />
                </div>
              </div>

              {/* Stats below video */}
              <div className="mt-6 flex items-center justify-center gap-x-8 gap-y-3 flex-wrap">
                <StatItem value="10,000+" label="Invoices Created" />
                <div className="hidden sm:block w-px h-8 bg-slate-200 dark:bg-zinc-700" />
                <StatItem value="AUD & CAD" label="Currencies Supported" />
                <div className="hidden sm:block w-px h-8 bg-slate-200 dark:bg-zinc-700" />
                <StatItem value="100%" label="Free to Use" />
              </div>

              {/* Trust badge — shown only on mobile, below video */}
              <div className="flex sm:hidden items-center justify-center gap-3 mt-5">
                <div className="flex -space-x-3">
                  {[
                    "bg-gradient-to-br from-pink-400 to-rose-500",
                    "bg-gradient-to-br from-blue-400 to-indigo-500",
                    "bg-gradient-to-br from-amber-400 to-orange-500",
                    "bg-gradient-to-br from-emerald-400 to-teal-500",
                  ].map((grad, i) => (
                    <div key={i} className={`w-9 h-9 rounded-full ring-2 ring-white dark:ring-zinc-900 ${grad} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                      {["A", "B", "C", "D"][i]}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium">
                  Trusted by <span className="text-slate-900 dark:text-white font-semibold">5,000+</span> freelancers in AU &amp; CA
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          2. HOW IT WORKS — 3 steps
      ══════════════════════════════════════════════ */}
      <section className="py-16 bg-slate-50 dark:bg-zinc-900/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">Simple process</p>
          <h2 className="mb-10 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Make your own invoice in 3 simple steps
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Fill in your details", desc: "Enter your name, client info, and services. Your invoice updates live as you type." },
              { step: "2", title: "Preview in real-time", desc: "Exactly what you see is what your client receives — a clean, professional PDF." },
              { step: "3", title: "Download or share", desc: "Export as a watermark-free PDF or send clients a secure view link instantly." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-500/30">
                  {step}
                </div>
                <p className="font-semibold text-slate-900 dark:text-white">{title}</p>
                <p className="text-sm text-slate-500 dark:text-zinc-400">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link
              href="/generator?new=1"
              className="group inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:opacity-90 hover:scale-[1.02]"
            >
              Start Now — It&apos;s Free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          3. TESTIMONIALS
      ══════════════════════════════════════════════ */}
      <section className="py-24 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">Testimonials</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Loved by thousands of freelancers</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <TestimonialCard
              quote="I made my first invoice in under a minute. No login, no watermark — just a clean PDF that looked like it came from an agency. Exactly what I needed."
              name="James T."
              role="Freelance Developer · Sydney"
              avatar="from-blue-400 to-indigo-500"
              initials="JT"
            />
            <TestimonialCard
              quote="Finally a tool that lets me make my own invoice that actually looks professional. My clients in Melbourne always ask what software I use."
              name="Sarah M."
              role="Graphic Designer · Melbourne"
              avatar="from-pink-400 to-rose-500"
              initials="SM"
            />
            <TestimonialCard
              quote="I was using Word templates before. This is 10x faster and the PDF looks way more polished. The GST calculation is automatic too — saves me time every week."
              name="Liam K."
              role="Consultant · Toronto"
              avatar="from-emerald-400 to-teal-500"
              initials="LK"
            />
          </div>
        </div>
      </section>



      {/* ══════════════════════════════════════════════
          5. FEATURES
      ══════════════════════════════════════════════ */}
      <section className="py-24 bg-slate-50 dark:bg-zinc-900 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="mb-2 text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Features</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Everything you need to make your own invoice.
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-zinc-400">
              Built for freelancers and small businesses in Australia & Canada who just want to get paid faster.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              iconColor="text-amber-500 bg-amber-50 dark:bg-amber-900/20"
              title="Ready in Under 60 Seconds"
              description="Type into the live form and watch your invoice update in real-time. No learning curve — go from blank to finished in one sitting."
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6" />}
              iconColor="text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20"
              title="No Account, No Watermark"
              description="Download a perfectly clean PDF with zero watermarks and zero signups required. What you see is exactly what your client receives."
            />
            <FeatureCard
              icon={<FileText className="w-6 h-6" />}
              iconColor="text-blue-600 bg-blue-50 dark:bg-blue-900/20"
              title="GST & Tax Built In"
              description="10% GST for Australia, 5% GST/HST for Canada — just set your rate and totals calculate automatically."
            />
            <FeatureCard
              icon={<Globe className="w-6 h-6" />}
              iconColor="text-violet-600 bg-violet-50 dark:bg-violet-900/20"
              title="AUD & CAD Currencies"
              description="Invoice in your local currency. 18+ currencies supported including AUD, CAD, USD, GBP and more."
            />
            <FeatureCard
              icon={<Users className="w-6 h-6" />}
              iconColor="text-pink-600 bg-pink-50 dark:bg-pink-900/20"
              title="Secure Client Share Links"
              description="Share a private, unguessable link so clients can view their invoice online — no app or account needed on their end."
            />
            <FeatureCard
              icon={<CreditCard className="w-6 h-6" />}
              iconColor="text-cyan-600 bg-cyan-50 dark:bg-cyan-900/20"
              title="Smart Invoice Numbering"
              description="Auto-incrementing invoice numbers (INV-2026-001) keep your records organized. Never duplicate or lose track of an invoice again."
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          6. FAQ
      ══════════════════════════════════════════════ */}
      <section className="py-24 bg-slate-50 dark:bg-zinc-900 relative z-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="mb-2 text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest">FAQ</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Common questions</h2>
          </div>
          <div className="space-y-3">
            <FAQItem
              question="How do I make my own invoice for free?"
              answer="Simply visit invoice-quickly.com, enter your business name and client details, add your services and rates, then click Download. Your professional PDF invoice is ready in under 60 seconds — no account or credit card required."
            />
            <FAQItem
              question="Can I make my own invoice without signing up?"
              answer="Yes — you can create and download a professional PDF invoice without creating an account at all. An account is only needed if you want to save invoice history or manage multiple companies across devices."
            />
            <FAQItem
              question="Will my invoice include a watermark?"
              answer="Never. Every PDF you export is completely clean — no logos, no branding, no watermarks from us. What you see in the preview is exactly what your client receives."
            />
            <FAQItem
              question="Does this work for Australian businesses (GST)?"
              answer="Yes. You can add 10% GST to your invoice and it calculates automatically. The invoice shows the subtotal, GST amount, and total clearly — ready for Australian business invoicing."
            />
            <FAQItem
              question="Does this work for Canadian businesses (GST/HST)?"
              answer="Yes. Set your GST or HST rate (5%–15% depending on your province) and the tool handles the calculation. You can also display your ABN or BN number on the invoice."
            />
            <FAQItem
              question="Can I add my logo to make it look professional?"
              answer="Absolutely. Upload your business logo and it appears on your invoice PDF. You can also customize your company name, address, payment terms, and add a personal message or bank transfer details."
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          7. BOTTOM CTA
      ══════════════════════════════════════════════ */}
      <section className="py-12 px-4 relative z-20">
        <div className="relative mx-auto max-w-6xl rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 px-6 py-24 md:py-32 overflow-hidden text-center shadow-2xl">
          {/* Dot-grid overlay */}
          <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(circle,white_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-5 leading-tight">
              Make your own invoice in under{" "}
              <span className="text-blue-400">60 seconds</span>
            </h2>
            <p className="text-lg text-slate-400 mb-10">No signup · No watermark · Instant PDF · GST-ready for AU & CA</p>
            <Link
              href="/generator?new=1"
              id="bottom-cta"
              className="group inline-flex items-center gap-2 rounded-xl bg-white text-slate-900 px-8 py-4 text-base font-bold shadow-lg transition-all hover:bg-slate-50 hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]"
            >
              Make Invoice Free
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <p className="mt-5 text-sm text-slate-500">Free forever · No credit card · Used by 5,000+ freelancers in AU & CA</p>
          </div>
        </div>
      </section>

    </div>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">{value}</p>
      <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">{label}</p>
    </div>
  );
}
