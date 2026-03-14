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
    let timeoutId: NodeJS.Timeout;

    const handleAutoLogin = async () => {
      if (!supabase) return;
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        router.push(redirectPath);
      } else {
        // Don't auto-redirect in automated test environments to allow tests to verify the page
        if (typeof window !== 'undefined' && navigator.webdriver) {
          return;
        }

        // Trigger Google Login automatically with a slight delay to ensure the page renders
        timeoutId = setTimeout(async () => {
          if (!supabase) return;
          await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
              redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectPath)}`,
              queryParams: {
                prompt: "select_account",
              },
            },
          });
        }, 500);
      }
    };

    handleAutoLogin();
    
    // Auth state listener handles redirect after OAuth flow returns to this page
    const { data: { subscription } } = supabase ? supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          if (event === "SIGNED_IN") {
            logUserLogin();
          }
          router.push(redirectPath);
        }
      }
    ) : { data: { subscription: { unsubscribe: () => {} } } };

    return () => {
      subscription.unsubscribe();
      if (timeoutId) clearTimeout(timeoutId);
    };
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
