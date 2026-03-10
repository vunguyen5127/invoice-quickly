"use client";

import { useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (!supabase) {
        router.push("/");
        return;
      }

      // Check for session and redirect accordingly
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Auth callback error:", error);
      }

      if (session) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4 text-center">
      <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-6" />
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
        Completing secure sign-in...
      </h1>
      <p className="text-zinc-500 dark:text-zinc-400">
        Please wait while we set up your session.
      </p>
    </div>
  );
}
