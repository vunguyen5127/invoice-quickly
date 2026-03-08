import Link from "next/link";
import {
  ArrowRight, CheckCircle2, FileText, Zap, Shield,
  Globe, Users, Sparkles, Send, CreditCard, Star
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] overflow-x-hidden bg-white dark:bg-zinc-950">

      {/* ══════════════════════════════════════════════
          1. HERO SECTION
      ══════════════════════════════════════════════ */}
      <section className="relative px-4 pt-16 pb-24 sm:px-6 lg:px-8 overflow-hidden">

        {/* Glow blobs */}
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center overflow-hidden">
          <div className="h-[520px] w-[960px] rounded-full bg-gradient-to-br from-blue-400/25 via-indigo-300/15 to-violet-300/10 blur-3xl dark:from-blue-600/20 dark:via-indigo-500/10 dark:to-violet-600/10" />
        </div>

        <div className="max-w-4xl mx-auto text-center">

          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700 shadow-sm dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            <Sparkles className="h-4 w-4" />
            Free Forever — No Credit Card Required
          </div>

          {/* H1 */}
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white md:text-5xl lg:text-6xl text-center max-w-4xl mx-auto">
            Create Professional Invoices{" "}
            <span className="text-blue-600 dark:text-blue-400">for Free</span>
            <br />
            And Get Paid Faster
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-zinc-400">
            The fastest way to generate beautiful, PDF-ready invoices. Manage your companies, track invoices, and share with clients — all from one elegant dashboard.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <Link
              href="/generator"
              className="group inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-700 hover:scale-105 hover:shadow-blue-500/50 active:scale-95"
            >
              Create Invoice Free
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-3.5 text-base font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:scale-105 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Sign In to Dashboard
            </Link>
          </div>

          {/* Feature pills with green checks */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-slate-600 dark:text-zinc-400 mb-10">
            {["No signup needed", "Unlimited invoices", "No watermark", "Instant PDF"].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <svg className="w-5 h-5 text-green-500 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
                {item}
              </span>
            ))}
          </div>

          {/* ── Trust badge: avatar group ── */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="flex -space-x-3">
              {["bg-gradient-to-br from-pink-400 to-rose-500","bg-gradient-to-br from-blue-400 to-indigo-500","bg-gradient-to-br from-amber-400 to-orange-500","bg-gradient-to-br from-emerald-400 to-teal-500"].map((grad, i) => (
                <div key={i} className={`w-9 h-9 rounded-full ring-2 ring-white dark:ring-zinc-900 ${grad} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                  {["A","B","C","D"][i]}
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium">
              Trusted by{" "}
              <span className="text-slate-900 dark:text-white font-semibold">5,000+</span>{" "}
              freelancers & small businesses
            </p>
          </div>

          {/* Social Proof Stats */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-5 border-t border-slate-100 dark:border-zinc-800 pt-10">
            <StatItem value="10,000+" label="Invoices Created" />
            <div className="hidden sm:block w-px h-10 bg-slate-200 dark:bg-zinc-700" />
            <StatItem value="20+" label="Languages Supported" />
            <div className="hidden sm:block w-px h-10 bg-slate-200 dark:bg-zinc-700" />
            <StatItem value="100%" label="Free to Use" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          2. DEMO — macOS browser mockup
      ══════════════════════════════════════════════ */}
      <section className="py-20 bg-slate-50 dark:bg-zinc-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* macOS mockup */}
            <div className="w-full lg:w-[58%] shrink-0 order-2 lg:order-1">
              <div className="rounded-2xl border border-slate-200/80 dark:border-zinc-700/70 shadow-2xl shadow-slate-900/15 overflow-hidden">
                {/* Browser chrome */}
                <div className="bg-slate-100/80 dark:bg-zinc-800 px-4 py-3 flex items-center gap-2 border-b border-slate-200 dark:border-zinc-700">
                  <span className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400" />
                  <span className="w-3 h-3 rounded-full bg-green-400" />
                  <div className="ml-3 flex-1 bg-white dark:bg-zinc-700 rounded-md px-3 py-1 text-xs text-slate-400 dark:text-zinc-400 font-mono text-left">
                    invoicequickly.com/generator
                  </div>
                </div>
                {/* Demo content */}
                <div className="aspect-[16/10] relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/videos/demo.webp"
                    alt="Invoice Quickly Generator Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/4 to-transparent" />
                </div>
              </div>
            </div>

            {/* Copy */}
            <div className="w-full lg:w-[42%] order-1 lg:order-2">
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">Product walkthrough</p>
              <h2 className="mb-5 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">See it in action</h2>
              <ul className="space-y-5 mb-8">
                {[
                  { title: "Live preview as you type", desc: "Watch your invoice build instantly — no lag, no refresh." },
                  { title: "One-click PDF download", desc: "Perfectly formatted and print-ready. Every single time." },
                  { title: "Share a public link", desc: "Send clients a secure, unguessable link to view their invoice." },
                ].map(({ title, desc }) => (
                  <li key={title} className="flex gap-3.5">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40">
                      <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">{title}</p>
                      <p className="text-sm text-slate-500 dark:text-zinc-400 mt-0.5">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <Link
                href="/generator"
                className="group inline-flex items-center gap-2 rounded-full bg-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 hover:scale-105"
              >
                Try it free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          3. TESTIMONIALS (new section)
      ══════════════════════════════════════════════ */}
      <section className="py-24 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">Testimonials</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Loved by thousands of freelancers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <TestimonialCard
              quote="InvoiceQuickly saved me hours every week. I used to fight with Word templates — now I hit export in under a minute. The PDF quality is insane."
              name="Sarah L."
              role="Freelance Designer"
              avatar="from-pink-400 to-rose-500"
              initials="SL"
            />
            <TestimonialCard
              quote="No watermarks, no hidden fees — and it actually looks better than what agencies charge $50/mo for. My clients are impressed every time."
              name="Tom R."
              role="Web Developer"
              avatar="from-blue-400 to-indigo-500"
              initials="TR"
            />
            <TestimonialCard
              quote="The multi-language support is a game-changer for my international clients. Arabic RTL works perfectly and the public share link feature is brilliant."
              name="Amira K."
              role="Marketing Consultant"
              avatar="from-amber-400 to-orange-500"
              initials="AK"
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          4. HOW IT WORKS
      ══════════════════════════════════════════════ */}
      <section className="py-24 bg-slate-50 dark:bg-zinc-900 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="mb-2 text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest">How It Works</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Three steps to get paid.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-16 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-blue-200 via-indigo-200 to-violet-200 dark:from-blue-800 dark:via-indigo-800 dark:to-violet-800" />
            <StepCard number="01" title="Fill in your details" description="Enter your company info and client details. Our smart form auto-fills from your saved companies." icon={<FileText className="w-5 h-5" />} />
            <StepCard number="02" title="Preview in real-time" description="See your invoice update live as you type. Adjust line items, taxes, and discounts instantly." icon={<Zap className="w-5 h-5" />} />
            <StepCard number="03" title="Download or share" description="Export as a perfect PDF or share a public link with your client — one click is all it takes." icon={<Send className="w-5 h-5" />} />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          5. FEATURES
      ══════════════════════════════════════════════ */}
      <section id="features" className="py-24 bg-white dark:bg-zinc-950 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="mb-2 text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Features</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Everything you need to bill clients.
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-zinc-400">
              A streamlined experience designed to help you get paid faster — without the headache of complex accounting software.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FeatureCard icon={<Zap className="w-6 h-6" />} iconColor="text-amber-500 bg-amber-50 dark:bg-amber-900/20" title="Lightning Fast" description="Live preview updates instantly as you type. See exactly what your client will see before you download." />
            <FeatureCard icon={<Shield className="w-6 h-6" />} iconColor="text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" title="Secure & Private" description="Private share links are unguessable. You control what you share. We never sell your data." />
            <FeatureCard icon={<FileText className="w-6 h-6" />} iconColor="text-blue-600 bg-blue-50 dark:bg-blue-900/20" title="Print-Ready PDFs" description="Download perfectly formatted, high-resolution PDFs that look professional and print beautifully." />
            <FeatureCard icon={<Globe className="w-6 h-6" />} iconColor="text-violet-600 bg-violet-50 dark:bg-violet-900/20" title="20+ Languages" description="Create invoices in any language — from English and Vietnamese to Arabic, Japanese, Chinese, and more." />
            <FeatureCard icon={<Users className="w-6 h-6" />} iconColor="text-pink-600 bg-pink-50 dark:bg-pink-900/20" title="Multi-Company" description="Manage multiple businesses from a single dashboard. Each with its own branding, defaults, and invoice history." />
            <FeatureCard icon={<CreditCard className="w-6 h-6" />} iconColor="text-cyan-600 bg-cyan-50 dark:bg-cyan-900/20" title="Auto Numbering" description="Smart invoice numbering (INV-2026-001) that automatically increments. Never duplicate a number again." />
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
            <FAQItem question="Is it really free forever?" answer="Yes — the generator is completely free with no credit card required. We offer paid plans for advanced dashboard features, but the core generator will always be free." />
            <FAQItem question="Do invoices have a watermark?" answer="No. There are zero watermarks on any exported PDF — regardless of whether you have an account." />
            <FAQItem question="Do I need to sign up?" answer="No. You can generate and download invoices without creating an account. Sign up only if you want to save history and manage multiple companies." />
            <FAQItem question="Can I add tax, discounts, and multiple line items?" answer="Yes — the generator supports multiple line items, percentage or fixed discounts, and configurable tax rates. Notes and payment terms are also supported." />
            <FAQItem question="How does sharing work?" answer="Generate a secure public link and share it directly with your client. Only people with the link can view the invoice." />
            <FAQItem question="Which languages are supported?" answer="Over 20 languages including English, Vietnamese, Arabic (RTL), French, Spanish, German, Japanese, Chinese, and more." />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          7. BOTTOM CTA — high contrast dark gradient
      ══════════════════════════════════════════════ */}
      <section className="py-12 px-4 relative z-20">
        <div className="relative mx-auto max-w-6xl rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 px-6 py-24 md:py-32 overflow-hidden text-center shadow-2xl">

          {/* Dot-grid overlay */}
          <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(circle,white_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />

          {/* Floating invoice illustration (CSS-only, lightweight) */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 w-56 lg:w-72 opacity-[0.07] pointer-events-none hidden lg:flex flex-col gap-2 text-white text-left select-none" aria-hidden="true">
            <div className="h-5 w-28 rounded bg-white" />
            <div className="h-3 w-44 rounded bg-white mt-1" />
            <div className="h-px w-full bg-white/40 my-3" />
            {[80, 60, 70, 55].map((w, i) => (
              <div key={i} className="flex gap-3 items-center">
                <div className="h-2.5 rounded bg-white flex-1" style={{ maxWidth: `${w}%` }} />
                <div className="h-2.5 w-12 rounded bg-white" />
              </div>
            ))}
            <div className="h-px w-full bg-white/40 my-3" />
            <div className="self-end h-4 w-20 rounded bg-white" />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-5 leading-tight">
              Create your invoice in under{" "}
              <span className="text-blue-400">60 seconds</span>
            </h2>
            <p className="text-lg text-slate-400 mb-10">
              No signup needed • Unlimited invoices • No watermark • Instant PDF
            </p>
            <Link
              href="/generator"
              className="group inline-flex items-center gap-2 rounded-full bg-white text-slate-900 px-8 py-4 text-base font-bold shadow-lg transition-all hover:bg-slate-50 hover:-translate-y-1 hover:shadow-xl active:scale-95"
            >
              Create Invoice Free
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <p className="mt-5 text-sm text-slate-500">Free forever · No credit card</p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════ */}
      <footer className="border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div className="md:col-span-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">InvoiceQuickly</h3>
              <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-sm leading-relaxed">
                The free, fast, and beautiful invoice generator trusted by freelancers, agencies, and small businesses worldwide.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Product</h4>
              <ul className="space-y-2.5 text-sm text-slate-500 dark:text-zinc-400">
                <li><Link href="/generator" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Invoice Generator</Link></li>
                <li><Link href="/login" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Dashboard</Link></li>
                <li><a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Resources</h4>
              <ul className="space-y-2.5 text-sm text-slate-500 dark:text-zinc-400">
                <li><Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                <li><a href="mailto:support@invoicequickly.com" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact Support</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-100 dark:border-zinc-800 text-center">
            <p className="text-slate-400 dark:text-zinc-600 text-sm">
              © {new Date().getFullYear()} InvoiceQuickly. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}

/* ─────────────── Sub-components ─────────────── */

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">{value}</p>
      <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">{label}</p>
    </div>
  );
}

function TestimonialCard({ quote, name, role, avatar, initials }: {
  quote: string; name: string; role: string; avatar: string; initials: string;
}) {
  return (
    <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 hover:shadow-md transition-shadow flex flex-col">
      {/* Stars */}
      <div className="flex gap-0.5 mb-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
        ))}
      </div>
      {/* Quote */}
      <p className="text-slate-700 dark:text-zinc-300 leading-relaxed mb-6 flex-1">&ldquo;{quote}&rdquo;</p>
      {/* Author */}
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatar} flex items-center justify-center text-white text-sm font-bold shrink-0 ring-2 ring-white dark:ring-zinc-800`}>
          {initials}
        </div>
        <div>
          <p className="font-semibold text-slate-900 dark:text-white text-sm">{name}</p>
          <p className="text-xs text-slate-500 dark:text-zinc-400">{role}</p>
        </div>
      </div>
    </div>
  );
}

function StepCard({ number, title, description, icon }: { number: string; title: string; description: string; icon: React.ReactNode }) {
  return (
    <div className="relative flex flex-col items-center text-center group">
      <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 mb-5 group-hover:scale-110 transition-transform duration-300 relative z-10">
        {icon}
      </div>
      <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1.5">Step {number}</span>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed max-w-xs">{description}</p>
    </div>
  );
}

function FeatureCard({ icon, iconColor, title, description }: { icon: React.ReactNode; iconColor: string; title: string; description: string }) {
  return (
    <div className="bg-white dark:bg-zinc-900 p-7 rounded-2xl border border-slate-100 dark:border-zinc-800/80 hover:shadow-xl hover:shadow-slate-900/5 hover:-translate-y-1 transition-all duration-300 group">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 ${iconColor}`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-slate-600 dark:text-zinc-400 leading-relaxed text-sm">{description}</p>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group rounded-xl border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-5 font-semibold text-slate-900 dark:text-white">
        {question}
        <span className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-500 dark:text-zinc-300 group-open:rotate-45 transition-transform duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </span>
      </summary>
      <p className="px-6 pb-5 text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">{answer}</p>
    </details>
  );
}
