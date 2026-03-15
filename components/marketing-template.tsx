import React from "react";
import Link from "next/link";
import { ArrowRight, Zap, Shield, FileText, Globe, Users, CreditCard, Sparkles } from "lucide-react";
import { FeatureCard, FAQItem, StepCard } from "./marketing-components";
import { SEOPageContent } from "@/data/marketing-pages";
import { InvoicePreview } from "@/components/invoice-preview";
import { initialInvoiceState, InvoiceState } from "@/types/invoice";

const icons = {
  zap: <Zap className="w-6 h-6" />,
  shield: <Shield className="w-6 h-6" />,
  fileText: <FileText className="w-6 h-6" />,
  globe: <Globe className="w-6 h-6" />,
  users: <Users className="w-6 h-6" />,
  creditCard: <CreditCard className="w-6 h-6" />,
};

interface MarketingTemplateProps {
  page: SEOPageContent;
}

export function MarketingTemplate({ page }: MarketingTemplateProps) {
  // Merge example data with initial state for preview
  const previewInvoice: InvoiceState = {
    ...initialInvoiceState,
    ...page.exampleInvoice.data,
    company: { ...initialInvoiceState.company, ...page.exampleInvoice.data.company },
    client: { ...initialInvoiceState.client, ...page.exampleInvoice.data.client },
    details: { ...initialInvoiceState.details, ...page.exampleInvoice.data.details },
    items: page.exampleInvoice.data.items || initialInvoiceState.items,
  };

  return (
    <div className="flex flex-col bg-white dark:bg-zinc-950">
      {/* Hero Section */}
      <section className="relative px-4 pt-20 pb-24 sm:px-6 lg:px-8 overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center overflow-hidden">
          <div className="h-[520px] w-[960px] rounded-full bg-gradient-to-br from-blue-400/20 via-indigo-300/10 to-violet-300/5 blur-3xl dark:from-blue-600/15 dark:via-indigo-500/5 dark:to-violet-600/5" />
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700 shadow-sm dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            <Sparkles className="h-4 w-4" />
            {page.hero.badge}
          </div>

          <h1 className="mb-6 text-4xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white md:text-6xl">
            {page.hero.title}
            <span className="text-blue-600 dark:text-blue-400">{page.hero.highlight}</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-slate-600 dark:text-zinc-400 font-medium">
            {page.hero.description}
          </p>

          <Link
            href="/generator?new=1"
            className="group inline-flex items-center gap-2 rounded-full bg-blue-600 px-10 py-4 text-lg font-bold text-white shadow-xl shadow-blue-500/25 transition-all hover:bg-blue-700 hover:scale-105 active:scale-95"
          >
            Create Your Invoice Now
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Overview Content */}
      <section className="py-20 bg-slate-50 dark:bg-zinc-900/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
           <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">{page.overview.title}</h2>
                <div className="text-lg text-slate-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap">
                  {page.overview.content}
                </div>
              </div>
              <div className="w-full md:w-[300px] bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-700 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                    <Zap className="w-8 h-8" />
                  </div>
                  <p className="font-bold text-slate-900 dark:text-white">Instant Setup</p>
                  <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">No signup required. Start billing immediately.</p>
              </div>
           </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">{page.features.title}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {page.features.items.map((item, i) => (
              <FeatureCard
                key={i}
                icon={icons[item.icon]}
                iconColor={item.color}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Example Invoice Section */}
      <section className="py-24 bg-slate-50 dark:bg-zinc-900/60 border-y border-slate-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1">
                 <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">{page.exampleInvoice.title}</h2>
                 <p className="text-lg text-slate-600 dark:text-zinc-400 mb-10 leading-relaxed">
                   {page.exampleInvoice.description}
                 </p>
                 <div className="space-y-4 mb-8">
                    {[
                      "Clean, high-contrast typography",
                      "Professional itemized breakdown",
                      "Clear tax and total calculations",
                      "Mobile-ready responsive design"
                    ].map((bullet, i) => (
                      <div key={i} className="flex items-center gap-3 font-medium text-slate-700 dark:text-zinc-300">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        {bullet}
                      </div>
                    ))}
                 </div>
                 <Link
                    href="/generator?new=1"
                    className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold hover:gap-3 transition-all"
                  >
                    Use this template now
                    <ArrowRight className="h-5 w-5" />
                  </Link>
              </div>
              <div className="w-full lg:w-[60%] shrink-0 shadow-2xl shadow-slate-900/10 rounded-xl overflow-hidden ring-1 ring-zinc-200 dark:ring-zinc-800">
                 <div className="[zoom:0.5] sm:[zoom:0.7] lg:[zoom:0.8] xl:[zoom:1] origin-top-left transition-all">
                    <InvoicePreview invoice={previewInvoice} compact />
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white dark:bg-zinc-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">{page.faq.title}</h2>
          </div>
          <div className="space-y-4">
            {page.faq.items.map((item, i) => (
              <FAQItem key={i} question={item.question} answer={item.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
         <div className="relative mx-auto max-w-5xl rounded-3xl bg-gradient-to-br from-blue-700 to-indigo-800 px-6 py-20 text-center shadow-2xl overflow-hidden">
            <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(circle,white_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Ready to create your professional invoice?</h2>
              <p className="text-blue-100 mb-10 text-lg opacity-90 max-w-xl mx-auto">Join thousands of businesses who trust Invoice-Quickly for their professional billing needs.</p>
              <Link
                href="/generator?new=1"
                className="inline-flex items-center gap-2 rounded-full bg-white text-blue-700 px-10 py-4 text-lg font-bold shadow-lg transition-all hover:bg-slate-50 hover:scale-105 active:scale-95"
              >
                Get Started for Free
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
         </div>
      </section>
    </div>
  );
}
