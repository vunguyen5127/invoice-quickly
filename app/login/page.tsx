"use client";

import { useEffect, Suspense } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/dashboard";

  useEffect(() => {
    // If they land on /login but are already authenticated, send them away
    const checkUser = async () => {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push(redirectPath);
      }
    };
    checkUser();
    
    // Auth state listener handles redirect after OAuth flow returns to this page
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          if (session) {
            router.push(redirectPath);
          }
        }
      );
      return () => subscription.unsubscribe();
    }
  }, [router, redirectPath]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
      <h1 className="text-xl font-medium text-zinc-900 dark:text-zinc-100">
        Authenticating...
      </h1>
      <p className="text-sm text-zinc-500 mt-2">
        Please use the "Sign In" button in the navigation bar to login.
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
