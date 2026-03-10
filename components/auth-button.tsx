"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { LogIn, LogOut, Loader2 } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function AuthButton() {
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
      
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    if (!supabase) return;

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    if (!supabase) {
      alert("Supabase client not initialized. Check your .env setup.");
      return;
    }
    
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
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
      <button className="inline-flex items-center justify-center rounded-[5px] px-4 text-sm font-medium h-9 text-zinc-500 bg-zinc-100 dark:bg-zinc-800 disabled">
        <Loader2 className="w-4 h-4 animate-spin" />
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
          className="rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700 hover:ring-2 hover:ring-zinc-300 dark:hover:ring-zinc-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 w-9 h-9 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 shrink-0"
          aria-label="User menu"
          aria-expanded={isOpen}
        >
          {user.user_metadata?.avatar_url ? (
            <img 
              src={user.user_metadata.avatar_url} 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
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
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 top-full mt-2 w-48 rounded-[5px] bg-white dark:bg-zinc-900 shadow-lg ring-1 ring-zinc-900/5 dark:ring-white/10 z-50 overflow-hidden text-sm animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
                <p className="text-sm text-zinc-900 dark:text-white font-medium truncate">
                  {user.user_metadata?.name || user.email}
                </p>
                <p className="text-xs text-zinc-500 truncate mt-0.5">
                  {user.email}
                </p>
              </div>
              
              <div className="py-1 flex flex-col">
                <Link 
                  href="/dashboard/settings"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-left px-4 py-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                  Settings
                </Link>
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center gap-2 border-t border-zinc-100 dark:border-zinc-800"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
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
      className="inline-flex items-center justify-center gap-2 rounded-[5px] px-4 h-9 text-sm font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white shadow-sm shrink-0 whitespace-nowrap"
      aria-label="Sign in with Google"
    >
      <LogIn className="w-4 h-4" />
      <span>Sign In</span>
    </button>
  );
}
