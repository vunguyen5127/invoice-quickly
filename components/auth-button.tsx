"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { LogIn, LogOut, Loader2, Settings } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { getBaseUrl } from "@/utils/url";
import { useLanguage } from "@/contexts/language-context";
import Link from "next/link";

export function AuthButton() {
  const { t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check active sessions and sets the user
    const getSession = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    if (!supabase) return;

    // Listen for changes on auth state (logged in, signed out, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    if (!supabase) {
      alert("Supabase client not initialized. Check your .env setup.");
      return;
    }

    const currentPath = window.location.pathname;
    const baseUrl = getBaseUrl();
    const redirectTo = `${baseUrl}/auth/callback?next=${encodeURIComponent(currentPath)}`;

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        queryParams: {
          prompt: "select_account",
        },
      },
    });
  };

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <button className="inline-flex items-center justify-center rounded-lg px-3.5 text-[13px] font-medium h-8 text-zinc-400 bg-zinc-100 dark:bg-zinc-800 disabled">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      </button>
    );
  }

  // Close dropdown if clicked outside (simple hack for now, or just toggle)
  const toggleDropdown = () => setIsOpen(!isOpen);

  // Need Settings icon

  if (user) {
    return (
      <div className="relative flex items-center gap-4">
        <button
          onClick={toggleDropdown}
          className="rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700 hover:ring-2 hover:ring-zinc-300 dark:hover:ring-zinc-600 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 w-8 h-8 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 shrink-0"
          aria-label="User menu"
          aria-expanded={isOpen}
        >
          {user.user_metadata?.avatar_url ? (
            <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-pink-500 text-white">
              <span className="text-xs font-bold font-sans">
                {(() => {
                  const name = user.user_metadata?.full_name || user.user_metadata?.name || "";
                  if (name) {
                    const parts = name.split(" ");
                    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
                    return name.slice(0, 2).toUpperCase();
                  }
                  return (user.email?.[0] || "U").toUpperCase();
                })()}
              </span>
            </div>
          )}
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <div className="absolute right-0 top-full mt-2 w-52 rounded-xl bg-white dark:bg-zinc-900 shadow-lg shadow-zinc-900/10 dark:shadow-black/30 ring-1 ring-zinc-200/80 dark:ring-zinc-800 z-50 overflow-hidden text-sm animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
                <p className="text-[13px] text-zinc-900 dark:text-white font-semibold truncate">{user.user_metadata?.name || user.email}</p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate mt-0.5">{user.email}</p>
              </div>

              <div className="py-1 flex flex-col">
                <Link
                  href="/dashboard/settings"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-left px-4 py-2.5 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors duration-150 flex items-center gap-2.5 text-[13px]"
                >
                  <Settings className="w-4 h-4" />
                  {t.settings}
                </Link>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-4 py-2.5 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors duration-150 flex items-center gap-2.5 text-[13px] border-t border-zinc-100 dark:border-zinc-800"
                >
                  <LogOut className="w-4 h-4" />
                  {t.signIn === "Sign In" ? "Sign out" : "Đăng xuất"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={handleLogin}
      className="inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 h-8 text-[13px] font-semibold transition-all duration-150 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white shadow-sm shadow-blue-600/25 shrink-0 whitespace-nowrap"
      aria-label="Sign in with Google"
    >
      <LogIn className="w-4 h-4" />
      <span>{t.signIn}</span>
    </button>
  );
}
