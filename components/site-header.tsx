"use client";

import { usePathname } from 'next/navigation';
import { ThemeToggle } from "@/components/theme-toggle";
import { AuthButton } from "@/components/auth-button";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/contexts/language-context";
import { Receipt, Settings } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from 'react';
import { supabase } from "@/utils/supabase/client";

export function SiteHeader() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [hasUser, setHasUser] = useState(false);
  
  useEffect(() => {
    if (!supabase) return;
    const checkUser = async () => {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      setHasUser(!!session?.user);
    };
    checkUser();

    // @ts-ignore
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setHasUser(!!session?.user);
    });

    return () => subscription?.unsubscribe();
  }, []);

  // Hide global header on editor pages so they can render their own custom sticky header
  if (pathname === '/generator' || pathname.includes('/new')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-zinc-800 dark:text-zinc-100 transition-opacity hover:opacity-80">
          <Receipt className="h-6 w-6 text-blue-600 dark:text-blue-500" />
          <span>InvoiceQuickly</span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2 text-zinc-600 dark:text-zinc-400">
          {hasUser && (
            <>
              <Link 
                href="/dashboard" 
                className="text-[13px] font-semibold text-zinc-700 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 bg-zinc-100 hover:bg-blue-50 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 border border-zinc-200/50 dark:border-zinc-700/50 transition-all hidden sm:flex items-center rounded-full px-4 py-1.5 mr-1 sm:mr-2 shadow-sm"
              >
                {t.myInvoices}
              </Link>
              <Link 
                href="/dashboard/settings" 
                className="p-2 text-zinc-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 bg-zinc-100 hover:bg-blue-50 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 border border-zinc-200/50 dark:border-zinc-700/50 transition-all flex items-center rounded-full shadow-sm mr-1 sm:mr-2"
                title={t.settings}
              >
                <Settings className="h-4 w-4" />
              </Link>
            </>
          )}
          <ThemeToggle />
          <LanguageToggle />
          <div className="ml-1 sm:ml-2">
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  );
}
