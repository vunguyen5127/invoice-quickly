"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Zap, Shield, FileText, Globe, Users, CreditCard, Sparkles, ChevronRight } from "lucide-react";
import { FeatureCard, FAQItem } from "./marketing-components";
import { SEOPageContent, marketingPages } from "@/data/marketing-pages";
import { InvoicePreview } from "@/components/invoice-preview";
import { initialInvoiceState, InvoiceState } from "@/types/invoice";
import { Breadcrumbs } from "./breadcrumbs";

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

  // Select 3 related templates (stably, to avoid hydration mismatch)
  const currentIndex = marketingPages.findIndex(p => p.slug === page.slug);
  const relatedTemplates = [
    marketingPages[(currentIndex + 1) % marketingPages.length],
    marketingPages[(currentIndex + 2) % marketingPages.length],
    marketingPages[(currentIndex + 3) % marketingPages.length],
  ];

  return (
    <div className="flex flex-col bg-white dark:bg-zinc-950">
      {/* Breadcrumbs Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-6 -mb-8 relative z-20">
        <Breadcrumbs 
          items={[
            { label: "Templates", href: "/how-to-write-an-invoice" },
            { label: page.hero.badge.replace("Free ", "") }
          ]} 
        />
      </div>

      {/* Hero Section */}
      <section className="relative px-4 pt-14 pb-24 sm:px-6 lg:px-8 overflow-hidden">
        {/* Modern Mesh Gradient Background */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_var(--tw-gradient-stops))] from-blue-100/40 via-indigo-50/20 to-transparent dark:from-blue-900/10 dark:via-indigo-950/5" />
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-6xl">
           <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 dark:bg-blue-600/5 rounded-full blur-[100px] animate-pulse" />
           <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-indigo-400/10 dark:bg-indigo-600/5 rounded-full blur-[80px]" />
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700 shadow-sm dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            <Sparkles className="h-4 w-4" />
            {page.hero.badge}
          </div>

          <h1 className="mb-8 text-5xl font-black tracking-tight leading-[1.05] text-slate-900 dark:text-white md:text-7xl">
            {page.hero.title}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">{page.hero.highlight}</span>
          </h1>

          <p className="mx-auto mb-12 max-w-2xl text-xl leading-relaxed text-slate-600 dark:text-zinc-400 font-medium">
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
              <div className="w-full lg:w-[60%] shrink-0 relative group">
                 <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                 <div className="relative bg-white dark:bg-zinc-950 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden ring-1 ring-black/5 dark:ring-white/10 transition-transform duration-500 group-hover:scale-[1.01]">
                    <div className="[zoom:0.5] sm:[zoom:0.7] lg:[zoom:0.8] xl:[zoom:1] origin-top-left transition-all">
                       <InvoicePreview invoice={previewInvoice} compact />
                    </div>
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

      {/* In-Depth Guide Section — addresses AdSense thin content */}
      {page.content && (
        <section className="py-24 bg-white dark:bg-zinc-950 border-t border-slate-100 dark:border-zinc-800">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-slate dark:prose-invert prose-lg max-w-none">
              {page.content.trim().split(/\n\n+/).map((block, i) => {
                if (block.startsWith("## ")) {
                  return (
                    <h2 key={i} className="text-2xl font-bold text-slate-900 dark:text-white mt-12 mb-4 first:mt-0">
                      {block.replace("## ", "")}
                    </h2>
                  );
                }
                if (block.startsWith("### ")) {
                  return (
                    <h3 key={i} className="text-xl font-semibold text-slate-800 dark:text-zinc-200 mt-8 mb-3">
                      {block.replace("### ", "")}
                    </h3>
                  );
                }
                if (block.startsWith("- ")) {
                  const items = block.split("\n").filter(l => l.startsWith("- "));
                  return (
                    <ul key={i} className="list-disc list-inside space-y-2 text-slate-600 dark:text-zinc-400 my-4">
                      {items.map((item, j) => (
                        <li key={j}>{item.replace("- ", "")}</li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={i} className="text-slate-600 dark:text-zinc-400 leading-relaxed my-4">
                    {block}
                  </p>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Related Templates - Internal Linking Hub */}
      <section className="py-24 bg-slate-50 dark:bg-zinc-900/20 border-t border-slate-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Explore More Templates</h2>
            <Link href="/how-to-write-an-invoice" className="text-sm font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 group">
              View All Hub
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedTemplates.map((template) => (
              <Link 
                key={template.slug} 
                href={`/${template.slug}`}
                className="group flex flex-col bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-2 mb-4">
                   <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <FileText className="w-4 h-4" />
                   </div>
                   <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                      {template.hero.badge.replace("Free ", "").replace(" Template", "")}
                   </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                  {template.hero.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-zinc-500 line-clamp-3 leading-relaxed mb-6">
                  {template.metadata.description}
                </p>
                <div className="mt-auto flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                  Read Guide
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final Summary & Tool Link */}
      <section className="py-16 bg-white dark:bg-zinc-950 border-t border-slate-100 dark:border-zinc-800">
         <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Start using our free templates</h2>
            <p className="text-slate-600 dark:text-zinc-400 mb-8 max-w-xl mx-auto">
              Skip the spreadsheets. Use our browser-based generator to customize this template and export a professional PDF instantly.
            </p>
            <Link
              href="/generator?new=1"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 px-8 py-3 text-base font-bold transition-all hover:bg-blue-100 dark:hover:bg-blue-900/40"
            >
              Open Invoice Generator
              <ArrowRight className="h-4 w-4" />
            </Link>
         </div>
      </section>
    </div>
  );
}
