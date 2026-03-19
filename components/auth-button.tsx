"use client";

import { useLanguage } from "@/contexts/language-context";
import { supabase } from "@/utils/supabase/client";
import { getBaseUrl } from "@/utils/url";
import { BarChart2, CreditCard, Loader2, LogIn, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

import { useAuth } from "@/contexts/auth-context";

export function AuthButton() {
  const { t } = useLanguage();
  const { user, loading, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

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
    await signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <button className="inline-flex items-center justify-center rounded-[5px] px-3.5 text-[13px] font-medium h-8 text-zinc-400 bg-zinc-100 dark:bg-zinc-800 disabled">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      </button>
    );
  }

  // Close dropdown if clicked outside (simple hack for now, or just toggle)
  const toggleDropdown = () => setIsOpen(!isOpen);

  // Need Settings icon

  if (user) {
    const userInitials = (() => {
      const name = user.user_metadata?.full_name || user.user_metadata?.name || "";
      if (name) {
        const parts = name.split(" ");
        if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
        return name.slice(0, 2).toUpperCase();
      }
      return (user.email?.[0] || "U").toUpperCase();
    })();

    return (
      <div className="relative flex items-center gap-4" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="relative rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/50 hover:shadow-md hover:shadow-blue-500/10 dark:hover:border-blue-400/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 dark:focus:ring-offset-zinc-950 w-9 h-9 flex items-center justify-center bg-white dark:bg-zinc-800 shrink-0 shadow-sm group"
          aria-label="User menu"
          aria-expanded={isOpen}
        >
          {user.user_metadata?.avatar_url ? (
            <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white transition-transform duration-300 group-hover:scale-110">
              <span className="text-[11px] font-bold font-sans tracking-wide">
                {userInitials}
              </span>
            </div>
          )}
        </button>

        {isOpen && (
          <>
            <div className="absolute right-0 top-full mt-3 w-[280px] rounded-[5px] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl shadow-2xl shadow-black/10 dark:shadow-black/50 border border-zinc-200/50 dark:border-white/10 z-50 overflow-hidden text-sm animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right">
              
              {/* Header */}
              <div className="px-5 py-4 border-b border-zinc-100/50 dark:border-white/5 bg-zinc-50/30 dark:bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden border border-zinc-200 shadow-sm bg-white dark:bg-zinc-800 dark:border-white/10">
                    {user.user_metadata?.avatar_url ? (
                      <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                        <span className="text-sm font-bold font-sans">
                          {userInitials}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <p className="text-[14px] text-zinc-900 dark:text-white font-semibold truncate leading-none mb-1.5">
                      {user.user_metadata?.name || user.user_metadata?.full_name || "User"}
                    </p>
                    <p className="text-[12px] text-zinc-500 dark:text-zinc-400 truncate leading-none font-medium">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Links */}
              <div className="p-2 space-y-0.5">
                <Link
                  href="/dashboard/analytics"
                  onClick={() => setIsOpen(false)}
                  className="group w-full text-left px-3 py-2.5 rounded-[5px] text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100/80 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white transition-all duration-200 flex items-center gap-3 text-[13px] font-medium"
                >
                  <BarChart2 className="w-4 h-4 text-zinc-400 group-hover:text-blue-500 transition-colors" />
                  Analytics
                </Link>

                <Link
                  href="/pricing"
                  onClick={() => setIsOpen(false)}
                  className="group w-full text-left px-3 py-2.5 rounded-[5px] text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100/80 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white transition-all duration-200 flex items-center gap-3 text-[13px] font-medium"
                >
                  <CreditCard className="w-4 h-4 text-zinc-400 group-hover:text-blue-500 transition-colors" />
                  {t.pricing || "Pricing"}
                </Link>

                <Link
                  href="/dashboard/settings"
                  onClick={() => setIsOpen(false)}
                  className="group w-full text-left px-3 py-2.5 rounded-[5px] text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100/80 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white transition-all duration-200 flex items-center gap-3 text-[13px] font-medium"
                >
                  <Settings className="w-4 h-4 text-zinc-400 group-hover:text-blue-500 transition-colors" />
                  {t.settings || "Settings"}
                </Link>
              </div>
              
              {/* Footer */}
              <div className="p-2 border-t border-zinc-100/50 dark:border-white/5 bg-zinc-50/30 dark:bg-transparent">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="group w-full text-left px-3 py-2.5 rounded-[5px] text-zinc-600 dark:text-zinc-300 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 flex items-center gap-3 text-[13px] font-medium"
                >
                  <LogOut className="w-4 h-4 text-zinc-400 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors" />
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
      className="group relative inline-flex items-center justify-center gap-2 rounded-[5px] px-4 h-9 text-[13px] font-semibold transition-all duration-300 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 overflow-hidden shadow-md shadow-zinc-900/10 dark:shadow-white/10"
      aria-label="Sign in"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <LogIn className="w-4 h-4 relative z-10" />
      <span className="relative z-10">{t.signIn}</span>
    </button>
  );
}
