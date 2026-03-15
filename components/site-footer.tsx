"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";
import { ShieldCheck, Zap, Heart } from "lucide-react";
import { marketingPages } from "@/data/marketing-pages";

export function SiteFooter() {
  const { t } = useLanguage();

  const footerTemplates = marketingPages.filter(p => !p.slug.includes('guide')).slice(0, 4);

  const getTranslatedBadge = (slug: string, badge: string) => {
    switch(slug) {
      case "invoice-template": return t.template_invoice || "Invoice Templates";
      case "invoice-template-pdf": return t.template_pdf || "PDF Invoice Generator";
      case "invoice-template-excel": return t.template_excel || "Upgrade from Excel";
      case "free-invoice-template": return t.template_free || "100% Forever";
      default: return badge.replace("Free ", "").replace(" Template", "");
    }
  };

  return (
    <footer className="border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-12 mb-16">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 font-bold text-lg text-slate-900 dark:text-white mb-4">
              <img src="/logo.svg" alt="Logo" className="w-6 h-6" />
              Invoice-Quickly
            </Link>
            <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-sm leading-relaxed mb-6">
              {t.footerTagline}
            </p>
            <div className="flex items-center gap-4 text-slate-400 dark:text-zinc-600">
              <div className="flex items-center gap-1.5 text-xs font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                {t.noWatermark}
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium">
                <Zap className="w-4 h-4 text-amber-500" />
                {t.instantPdf}
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-5 uppercase tracking-wider">
              {t.templates}
            </h4>
            <ul className="space-y-4 text-sm text-slate-500 dark:text-zinc-400 font-medium">
              {footerTemplates.map((page) => (
                <li key={page.slug}>
                  <Link href={`/${page.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {getTranslatedBadge(page.slug, page.hero.badge)}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/how-to-write-an-invoice" className="text-blue-600 dark:text-blue-400 hover:underline">
                  {t.viewAllHub}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-5 uppercase tracking-wider">
              {t.footerLinkProduct}
            </h4>
            <ul className="space-y-4 text-sm text-slate-500 dark:text-zinc-400 font-medium">
              <li>
                <Link href="/generator?new=1" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t.createInvoice}
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t.dashboard}
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t.signIn}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-5 uppercase tracking-wider">
              {t.footerLinkResources}
            </h4>
            <ul className="space-y-4 text-sm text-slate-500 dark:text-zinc-400 font-medium">
              <li>
                <Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t.footerLinkAbout}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t.footerLinkContact}
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t.footerLinkPrivacy}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t.footerLinkTerms}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 dark:text-zinc-500 text-xs font-medium">
            © {new Date().getFullYear()} Invoice-Quickly. {t.footerRightsReserved}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-zinc-600">
            Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline mx-0.5" /> for freelancers worldwide
          </div>
        </div>
      </div>
    </footer>
  );
}
