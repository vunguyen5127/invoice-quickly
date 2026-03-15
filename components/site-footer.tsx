"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";

export function SiteFooter() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
          <div className="md:col-span-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Invoice-Quickly</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm leading-relaxed">
              {t.footerTagline}
            </p>
          </div>
          <nav aria-label="Product links">
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white mb-2 uppercase tracking-wider">
              {t.footerLinkProduct}
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-500 dark:text-zinc-400">
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
            </ul>
          </nav>
          <nav aria-label="Resource links">
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white mb-2 uppercase tracking-wider">
              {t.footerLinkResources}
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-500 dark:text-zinc-400">
              <li>
                <Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t.footerLinkAbout}
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
              <li>
                <Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t.footerLinkContact}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 text-center">
          <p className="text-slate-400 dark:text-zinc-600 text-xs">
            © {new Date().getFullYear()} Invoice-Quickly. {t.footerRightsReserved}
          </p>
        </div>
      </div>
    </footer>
  );
}
