"use client";

import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuthButton } from "@/components/auth-button";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/contexts/language-context";
import { Receipt, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";

const ADMIN_EMAIL = "vunguyencapital@gmail.com";

export function SiteHeader() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [hasUser, setHasUser] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    const checkUser = async () => {
      if (!supabase) return;
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setHasUser(!!session?.user);
      setUserEmail(session?.user?.email || null);
    };
    checkUser();

    // @ts-ignore
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setHasUser(!!session?.user);
      setUserEmail(session?.user?.email || null);
    });

    return () => subscription?.unsubscribe();
  }, []);

  // Hide global header on editor pages so they can render their own custom sticky header
  if (pathname === "/generator" || pathname.includes("/new") || pathname.includes("/edit")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-[#f6f6f6] dark:bg-zinc-950/80 backdrop-blur-md shadow-sm">
      <nav aria-label="Main navigation" className="container flex h-12 items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg tracking-tight text-zinc-800 dark:text-zinc-100 transition-opacity hover:opacity-80"
          aria-label="Invoice-Quickly — Free Invoice Generator"
        >
          <img src="/logo.svg" alt="Invoice-Quickly Logo — Free Online Invoice Generator" className="h-8 w-8 object-contain" width={32} height={32} />
          <span>Invoice-Quickly</span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2 text-zinc-600 dark:text-zinc-400">
          {hasUser && (
            <>
              <Link
                href="/dashboard"
                className="text-[13px] font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/80 transition-all hidden sm:flex items-center rounded-full px-4 py-1.5 mr-1"
              >
                {t.myInvoices}
              </Link>
            </>
          )}
          <ThemeToggle />
          <LanguageToggle />
          <div className="ml-1 sm:ml-2">
            <AuthButton />
          </div>
        </div>
      </nav>
    </header>
  );
}
