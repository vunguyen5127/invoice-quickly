import { FAQItem, FeatureCard, StepCard, TestimonialCard } from "@/components/marketing-components";
import { ArrowRight, CheckCircle2, CreditCard, FileText, Globe, Send, Shield, Sparkles, Users, Zap } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Invoice Generator No Sign Up | No Watermark | Invoice-Quickly",
  description:
    "Create professional invoices online for free. No signup, no watermark, instant PDF export, secure share links, and support for 20+ languages.",
  alternates: { canonical: "/" },
};

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] overflow-x-hidden bg-white dark:bg-zinc-950">
      {/* JSON-LD structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Invoice-Quickly - Free Invoice Generator",
            url: "https://invoice-quickly.com",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Any",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.9",
              ratingCount: "2847",
              bestRating: "5",
              worstRating: "1",
            },
            description:
              "Free online invoice generator. Create and download professional PDF invoices for free. No signup, no watermark. Generate invoices for free in 20+ languages.",
            featureList: [
              "Generate and download professional PDF invoices",
              "No signup required",
              "No watermark on exported documents",
              "20+ languages supported",
              "Live invoice preview as you type",
              "Instant PDF download",
              "Shareable invoice links for clients",
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Is Invoice-Quickly completely free to use?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes, Invoice-Quickly is completely free to use. You can create and download professional invoices with no credit card required, no watermarks, and no account needed.",
                },
              },
              {
                "@type": "Question",
                name: "Do I need to create an account to make an invoice?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "No. You can create and download a professional invoice without signing up or creating an account. An account is only needed if you want to save your invoice history or manage multiple companies.",
                },
              },
              {
                "@type": "Question",
                name: "Can I download a free PDF invoice?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes, our free PDF invoice generator lets you download perfectly formatted, print-ready PDF invoices with zero watermarks.",
                },
              },
              {
                "@type": "Question",
                name: "Does this free invoice generator add a watermark?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "No. There are zero watermarks on any exported PDF — regardless of whether you have an account. It is truly a free invoice generator with no catches.",
                },
              },
              {
                "@type": "Question",
                name: "How does Invoice-Quickly compare to other invoicing tools?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Invoice-Quickly is trusted by thousands of freelancers and small businesses. Unlike many other tools, we never add watermarks, never require signup, support 20+ languages including RTL, and provide instant PDF downloads — all completely free.",
                },
              },
              {
                "@type": "Question",
                name: "Can I use this free invoice generator for my freelance business?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Absolutely! Our free invoice generator is perfect for freelancers, contractors, consultants, and small business owners. Create professional invoices online for free, save your company details, and manage multiple clients.",
                },
              },
              {
                "@type": "Question",
                name: "How is this different from other free invoice generators?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Invoice-Quickly stands out with real-time live preview, 20+ language support including RTL, zero watermarks, no signup required, shareable invoice links, multi-company management, and beautiful PDF exports, all 100% free.",
                },
              },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://invoice-quickly.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Free Invoice Generator",
                item: "https://invoice-quickly.com/generator",
              },
            ],
          }),
        }}
      />

      {/* ══════════════════════════════════════════════
          1. HERO SECTION
      ══════════════════════════════════════════════ */}
      <section className="relative px-4 pt-8 md:pt-12 lg:pt-14 pb-24 sm:px-6 lg:px-8 overflow-hidden">
        {/* Glow blobs */}
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center overflow-hidden">
          <div className="h-[520px] w-[960px] rounded-full bg-gradient-to-br from-blue-400/25 via-indigo-300/15 to-violet-300/10 blur-3xl dark:from-blue-600/20 dark:via-indigo-500/10 dark:to-violet-600/10" />
        </div>

        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700 shadow-sm dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            <Sparkles className="h-4 w-4" />
            Free Forever • No Credit Card Required
          </div>

          {/* H1 */}
          <h1 className="mb-3 text-4xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white md:text-5xl text-center max-w-4xl mx-auto">
            Free Invoice Generator <span className="text-blue-600 dark:text-blue-400">No Sign Up</span>
          </h1>

          {/* Supporting line — value-oriented, not a keyword repeat */}
          <p className="mb-5 text-xl font-semibold text-slate-600 dark:text-slate-400 text-center">
            Create professional invoices in seconds, perfectly formatted and ready to send.
          </p>

          <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-zinc-400">
            Create professional invoices in seconds. No account, no watermark — instant PDF export and secure share links for clients.</p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <Link
              href="/generator?new=1"
              className="group inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-b from-primary to-primary/90 px-10 py-4.5 text-lg font-semibold text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:shadow-2xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              Create Invoice Free
              <ArrowRight className="h-5.5 w-5.5 transition-transform group-hover:translate-x-1.5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-10 py-4.5 text-lg font-semibold text-foreground shadow-sm transition-all hover:bg-secondary hover:scale-[1.02] active:scale-[0.98]"
            >
              Sign In to Dashboard
            </Link>
          </div>

          {/* Feature pills with green checks */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-slate-600 dark:text-zinc-400 mb-10">
            {["No signup needed", "50 Free Invoices/mo", "No watermark", "Instant PDF"].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <svg className="w-5 h-5 text-green-500 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
                {item}
              </span>
            ))}
          </div>

          {/* ── Trust badge: avatar group ── */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="flex -space-x-3">
              {[
                "bg-gradient-to-br from-pink-400 to-rose-500",
                "bg-gradient-to-br from-blue-400 to-indigo-500",
                "bg-gradient-to-br from-amber-400 to-orange-500",
                "bg-gradient-to-br from-emerald-400 to-teal-500",
              ].map((grad, i) => (
                <div
                  key={i}
                  className={`w-9 h-9 rounded-full ring-2 ring-white dark:ring-zinc-900 ${grad} flex items-center justify-center text-white text-xs font-bold shadow-sm`}
                >
                  {["A", "B", "C", "D"][i]}
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium">
              Trusted by <span className="text-slate-900 dark:text-white font-semibold">5,000+</span> freelancers & small businesses
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
              <div className="rounded-[5px] border border-slate-200/80 dark:border-zinc-700/70 shadow-2xl shadow-slate-900/15 overflow-hidden">
                {/* Browser chrome */}
                <div className="bg-slate-100/80 dark:bg-zinc-800 px-4 py-3 flex items-center gap-2 border-b border-slate-200 dark:border-zinc-700">
                  <span className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400" />
                  <span className="w-3 h-3 rounded-full bg-green-400" />
                  <div className="ml-3 flex-1 bg-white dark:bg-zinc-700 rounded-md px-3 py-1 text-xs text-slate-400 dark:text-zinc-400 font-mono text-left">
                    invoice-quickly.com/generator
                  </div>
                </div>
                {/* YouTube video inside browser mockup */}
                <div className="aspect-video relative">
                  <iframe
                    src="https://www.youtube.com/embed/xOE5E9EIDCQ?rel=0&modestbranding=1&autoplay=1&mute=1&loop=1&playlist=xOE5E9EIDCQ"
                    title="Invoice-Quickly — Free Invoice Generator Demo"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            {/* Copy */}
            <div className="w-full lg:w-[42%] order-1 lg:order-2">
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">Official Demo Video</p>
              <h2 className="mb-5 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">See Invoice-Quickly in action</h2>
              <ul className="space-y-5 mb-8">
                {[
                  { title: "Create in under 60 seconds", desc: "From blank form to polished invoice — it's that fast. No learning curve." },
                  { title: "Live preview & instant PDF", desc: "Watch every change reflect in real-time. Download a pixel-perfect PDF instantly." },
                  { title: "Share with a single link", desc: "Send clients a secure, unguessable link to view their invoice online." },
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
                href="/generator?new=1"
                className="group inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:opacity-90 hover:scale-[1.02]"
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
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Loved by thousands of freelancers</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <TestimonialCard
              quote="Invoice-Quickly saved me hours every week. I used to fight with Word templates. Now I hit export in under a minute. The PDF quality is insane."
              name="Sarah L."
              role="Freelance Designer"
              avatar="from-pink-400 to-rose-500"
              initials="SL"
            />
            <TestimonialCard
              quote="No watermarks, no hidden fees, and it actually looks better than what agencies charge $50/mo for. My clients are impressed every time."
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
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Create your invoice in three simple steps.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-16 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-blue-200 via-indigo-200 to-violet-200 dark:from-blue-800 dark:via-indigo-800 dark:to-violet-800" />
            <StepCard
              number="01"
              title="Fill in your details"
              description="Enter your company info and client details. Our smart form auto-fills from your saved companies."
              icon={<FileText className="w-5 h-5" />}
            />
            <StepCard
              number="02"
              title="Preview in real-time"
              description="See your invoice update live as you type. Adjust line items, taxes, and discounts instantly."
              icon={<Zap className="w-5 h-5" />}
            />
            <StepCard
              number="03"
              title="Download or share"
              description="Export as a perfect PDF or share a public link with your client. One click is all it takes."
              icon={<Send className="w-5 h-5" />}
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          5. FEATURES
      ══════════════════════════════════════════════ */}
      <section id="features" className="py-24 bg-slate-50 dark:bg-zinc-900 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="mb-2 text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Features</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Everything you need to create professional invoices.</h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-zinc-400">
              A lightweight billing tool designed to help freelancers and small businesses get paid faster — no complex accounting software required.
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
              description="Download a perfectly clean PDF with zero watermarks and zero signups required. What you see in the preview is exactly what your client receives."
            />
            <FeatureCard
              icon={<FileText className="w-6 h-6" />}
              iconColor="text-blue-600 bg-blue-50 dark:bg-blue-900/20"
              title="Instant PDF Export"
              description="Generate a high-resolution, print-ready PDF invoice with one click. Works perfectly on desktop and mobile."
            />
            <FeatureCard
              icon={<Globe className="w-6 h-6" />}
              iconColor="text-violet-600 bg-violet-50 dark:bg-violet-900/20"
              title="20+ Languages & RTL Support"
              description="Bill clients worldwide in their language. Full support for Arabic RTL, Japanese, Chinese, Vietnamese, Hindi, and more."
            />
            <FeatureCard
              icon={<Users className="w-6 h-6" />}
              iconColor="text-pink-600 bg-pink-50 dark:bg-pink-900/20"
              title="Secure Client Share Links"
              description="Share a private, unguessable link so clients can view their invoice online — no app download or account needed on their end."
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
              question="Do I need an account to create an invoice?"
              answer="No — you can create and download a professional PDF invoice without signing up at all. An account is only needed if you want to save invoice history, manage multiple companies, or access your dashboard across devices."
            />
            <FAQItem
              question="Will my invoice PDF include a watermark?"
              answer="Never. Every PDF you export is completely clean — no logos, no branding, no watermarks from us. What you see in the preview is exactly what your client receives, regardless of whether you have a paid plan."
            />
            <FAQItem
              question="Can I share invoices by link?"
              answer="Yes. After saving an invoice, you get a secure, unguessable public link to send directly to your client. They can view it in any browser with no app or account required on their end."
            />
            <FAQItem
              question="Which languages do you support?"
              answer="Invoice-Quickly supports 20+ languages including English, Vietnamese, Arabic (full RTL layout), French, Spanish, German, Japanese, Chinese, Korean, Thai, Hindi, and more — ideal for freelancers billing international clients."
            />
            <FAQItem
              question="Can freelancers use this for client billing?"
              answer="Absolutely. Invoice-Quickly was built with freelancers, contractors, and consultants in mind. Create and send branded invoices in seconds, reuse company profiles, manage multiple clients, and track payment terms — all without a monthly fee."
            />
            <FAQItem
              question="What details can I customize on an invoice?"
              answer="You can customize your company name, logo, client details, line items, quantities, rates, tax rates, discounts, shipping, payment terms, invoice notes, currency, and language. The live preview updates instantly as you type."
            />
            <FAQItem
              question="Is this tool really free?"
              answer="Yes — the core invoice maker is completely free with no credit card required. You can create, download, and share professional invoices indefinitely. Optional paid plans unlock advanced cloud features like invoice history and multi-company management."
            />
            <FAQItem
              question="Why do freelancers choose Invoice-Quickly?"
              answer="Because it removes every common frustration: no forced signups, no watermarks, no bait-and-switch pricing. You get real-time live preview, 20+ language support, instant PDF export, and a secure client share link — all for free, from any device."
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          7. WHO IT'S FOR
      ══════════════════════════════════════════════ */}
      <section className="py-20 bg-white dark:bg-zinc-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">Built For</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Who uses Invoice-Quickly?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { emoji: "💻", title: "Freelancers", desc: "Send clean, professional invoices to clients without wrestling with complex billing software." },
              { emoji: "🏢", title: "Consultants", desc: "Bill for projects and retainers with custom line items, tax rates, and payment terms." },
              { emoji: "🔧", title: "Contractors", desc: "Generate per-job invoices on the go — from any device, without creating an account." },
              { emoji: "🏪", title: "Small Businesses", desc: "Manage multiple clients and company profiles from a single lightweight dashboard." },
              { emoji: "🎨", title: "Agencies", desc: "Issue branded invoices across multiple projects — with logo upload and shareable client links." },
              { emoji: "🌍", title: "International Sellers", desc: "Invoice in 20+ languages including Arabic RTL, Japanese, and Chinese for global clients." },
            ].map(({ emoji, title, desc }) => (
              <div key={title} className="flex gap-4 p-5 rounded-2xl border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
                <span className="text-2xl shrink-0 mt-0.5">{emoji}</span>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white mb-1">{title}</p>
                  <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          8. INTERNAL LINKING
      ══════════════════════════════════════════════ */}
      <section className="py-16 bg-slate-50 dark:bg-zinc-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">Resources</p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Guides to help you get paid faster</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { href: "/blog/how-to-invoice-clients-as-freelancer", label: "How to invoice clients as a freelancer", desc: "A step-by-step guide for billing clients professionally." },
              { href: "/blog/invoice-payment-terms-net-30-explained", label: "Invoice payment terms explained (Net 30 & more)", desc: "Understand payment terms and how to set them correctly." },
              { href: "/blog/invoice-for-services-rendered", label: "How to write an invoice for services rendered", desc: "Templates and tips for service-based invoicing." },
              { href: "/blog/overdue-invoice-follow-up-email-templates", label: "Overdue invoice follow-up email templates", desc: "What to say when a client misses a payment deadline." },
            ].map(({ href, label, desc }) => (
              <Link
                key={href}
                href={href}
                className="group flex flex-col gap-1 p-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm transition-all"
              >
                <span className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm">{label}</span>
                <span className="text-xs text-slate-500 dark:text-zinc-400">{desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          9. BOTTOM CTA — high contrast dark gradient
      ══════════════════════════════════════════════ */}
      <section className="py-12 px-4 relative z-20">
        <div className="relative mx-auto max-w-6xl rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 px-6 py-24 md:py-32 overflow-hidden text-center shadow-2xl">
          {/* Dot-grid overlay */}
          <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(circle,white_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />

          {/* Floating invoice illustration (CSS-only, lightweight) */}
          <div
            className="absolute right-8 top-1/2 -translate-y-1/2 w-56 lg:w-72 opacity-[0.07] pointer-events-none hidden lg:flex flex-col gap-2 text-white text-left select-none"
            aria-hidden="true"
          >
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
              Create your first invoice in under <span className="text-blue-400">60 seconds</span>
            </h2>
            <p className="text-lg text-slate-400 mb-10">No signup · No watermark · Instant PDF · Secure share link</p>
            <Link
              href="/generator?new=1"
              className="group inline-flex items-center gap-2 rounded-xl bg-white text-slate-900 px-8 py-4 text-base font-bold shadow-lg transition-all hover:bg-slate-50 hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]"
            >
              Create Invoice Free
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <p className="mt-5 text-sm text-slate-500">Free forever · No credit card</p>
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
