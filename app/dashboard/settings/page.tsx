"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2, User, Globe, Moon, Sun, Monitor, Bell, Shield, LogOut } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { ThemeToggle, ThemeSelector } from "@/components/theme-toggle";
import { languages } from "@/components/language-toggle";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function SettingsPage() {
  const { t, lang, setLang } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login?redirect=/dashboard/settings");
        return;
      }
      setUser(session.user);
      setLoading(false);
    };
    checkUser();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    router.push("/");
  };

  const sectionClass = "bg-white dark:bg-zinc-900 rounded-[5px] border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm shadow-zinc-200/50 dark:shadow-none mb-6";
  const headerClass = "px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-100 bg-zinc-50/30 dark:bg-zinc-900/30";
  const itemClass = "px-6 py-4 flex items-center justify-between border-b last:border-0 border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors";

  return (
    <div className="container mx-auto px-4 sm:px-8 py-8 max-w-2xl">
      <div className="mb-8 flex items-center gap-4">
        <Link 
          href="/dashboard"
          className="p-2 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors shadow-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{t.settings}</h1>
          <p className="text-zinc-500 mt-1">{t.accountSettings}</p>
        </div>
      </div>

      {/* Profile Section */}
      <div className={sectionClass}>
        <div className={headerClass}>
          <User className="w-4 h-4 text-blue-500" />
          {"Profile"}
        </div>
        <div className="p-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center bg-pink-500 text-white border-2 border-white dark:border-zinc-800 text-2xl font-black shadow-lg">
            {(() => {
              const name = user?.user_metadata?.full_name || user?.user_metadata?.name || "";
              if (name) {
                const parts = name.split(" ");
                if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
                return name.slice(0, 2).toUpperCase();
              }
              return (user?.email?.[0] || "U").toUpperCase();
            })()}
          </div>
          <div>
            <p className="font-bold text-lg text-zinc-900 dark:text-zinc-100">{user?.user_metadata?.name || user?.user_metadata?.full_name || user?.email?.split('@')[0]}</p>
            <p className="text-zinc-500 text-sm">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Appearance & Language */}
      <div className={sectionClass}>
        <div className={headerClass}>
          <Monitor className="w-4 h-4 text-emerald-500" />
           {t.settings_preferences || "Preferences"}
        </div>
        <div className={itemClass}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
               <Globe className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{t.language || "Language"}</p>
              <p className="text-xs text-zinc-500">{t.language_preference_desc || "Choose your preferred display language"}</p>
            </div>
          </div>
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value as any)}
            className="text-sm font-bold text-blue-600 bg-transparent border-none focus:ring-0 cursor-pointer outline-none"
          >
            {languages.map(l => (
              <option key={l.code} value={l.code}>{l.name}</option>
            ))}
          </select>
        </div>
        <div className={itemClass}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
               <Sun className="w-4 h-4 dark:hidden" />
               <Moon className="w-4 h-4 hidden dark:block" />
            </div>
            <div>
              <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">Theme</p>
              <p className="text-xs text-zinc-500">Switch between light and dark mode</p>
            </div>
          </div>
          <ThemeSelector />
        </div>
      </div>

      {/* Account Security */}
      <div className={sectionClass}>
        <div className={headerClass}>
          <Shield className="w-4 h-4 text-amber-500" />
          Security
        </div>
        <div className={itemClass}>
           <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
               <Bell className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">Notifications</p>
              <p className="text-xs text-zinc-500">Manage your email notifications</p>
            </div>
          </div>
          <div className="w-10 h-5 bg-zinc-200 dark:bg-zinc-800 rounded-full cursor-not-allowed opacity-50 relative">
             <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div>
          </div>
        </div>
        
        {user?.email === "vunguyencapital@gmail.com" && (
          <Link href="/admin" className={itemClass}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-sm text-indigo-900 dark:text-indigo-100">Admin Panel</p>
                <p className="text-xs text-indigo-700/70 dark:text-indigo-400/70">View system login logs and statistics</p>
              </div>
            </div>
            <ChevronLeft className="w-4 h-4 text-zinc-400 rotate-180" />
          </Link>
        )}
        <button 
          onClick={handleLogout}
          className="w-full px-6 py-4 flex items-center gap-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors border-t border-zinc-50 dark:border-zinc-800/50"
        >
          <LogOut className="w-4 h-4" />
          <span className="font-semibold text-sm">Sign Out</span>
        </button>
      </div>

    </div>
  );
}
