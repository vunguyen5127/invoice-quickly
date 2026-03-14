"use client";

import { useEffect, Suspense } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { logUserLogin } from "@/utils/login-logger";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/dashboard";

  useEffect(() => {
    const handleAutoLogin = async () => {
      if (!supabase) return;
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        router.push(redirectPath);
      } else {
        // Trigger Google Login automatically
        const baseUrl = window.location.origin;
        const redirectTo = `${baseUrl}/auth/callback?next=${encodeURIComponent(redirectPath)}`;
        
        await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo,
            queryParams: {
              prompt: "select_account",
            },
          },
        });
      }
    };

    handleAutoLogin();
    
    // Auth state listener handles redirect after OAuth flow returns to this page
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (session) {
            if (event === "SIGNED_IN") {
              logUserLogin();
            }
            router.push(redirectPath);
          }
        }
      );
      return () => subscription.unsubscribe();
    }
  }, [router, redirectPath]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4 text-center">
      <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-6" />
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
        Authenticating...
      </h1>
      <p className="text-zinc-500 dark:text-zinc-400">
        Redirecting you to the secure login screen.
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
