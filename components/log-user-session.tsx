"use client";

import { useEffect } from "react";
import { supabase } from "@/utils/supabase/client";

export function LogUserSession() {
  useEffect(() => {
    if (!supabase) return;

    // Check on initial load
    const checkAndLog = async () => {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { logUserLogin } = await import("@/utils/login-logger");
        logUserLogin();
      }
    };
    
    checkAndLog();

    if (!supabase) return;

    // Listen for subsequent logins
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          const { logUserLogin } = await import("@/utils/login-logger");
          logUserLogin();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // This is a strictly logical component, it renders nothing
  return null;
}
