"use client";

import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuthButton } from "@/components/auth-button";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/contexts/language-context";
import { Receipt, ShieldCheck, LayoutDashboard, ChevronDown, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { marketingPages } from "@/data/marketing-pages";

const ADMIN_EMAIL = "vunguyencapital@gmail.com";

export function SiteHeader() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [hasUser, setHasUser] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  // Filter templates for the dropdown (first 4 for compactness)
  const dropdownTemplates = marketingPages.slice(0, 5);

  // Hide global header on editor pages so they can render their own custom sticky header
  if (pathname === "/generator" || pathname.includes("/new") || pathname.includes("/edit")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl">
      <nav aria-label="Main navigation" className="container flex h-16 items-center justify-between px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-bold text-lg tracking-tight text-zinc-900 dark:text-zinc-100 transition-opacity hover:opacity-80"
            aria-label="Invoice-Quickly — Free Invoice Generator"
          >
            <img src="/logo.svg" alt="Invoice-Quickly Logo" className="h-7 w-7 object-contain" width={28} height={28} />
            <span>Invoice-Quickly</span>
          </Link>

          {/* Desktop Nav Hub */}
          <div className="hidden md:flex items-center gap-1">
            <Link 
              href="/about" 
              className="px-4 py-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 rounded-lg transition-all"
            >
              About
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
          {hasUser && (
            <Link
              href="/dashboard"
              className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-all duration-150 flex items-center gap-1.5 rounded-lg px-3 py-1.5 mr-1"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden md:inline">{t.myInvoices}</span>
            </Link>
          )}
          {hasUser && <div className="hidden xs:block w-px h-5 bg-zinc-200 dark:bg-zinc-700 mx-1" />}
          <ThemeToggle />
          <LanguageToggle />
          <div className="ml-1 shrink-0">
            <AuthButton />
          </div>
        </div>
      </nav>
    </header>
  );
}
