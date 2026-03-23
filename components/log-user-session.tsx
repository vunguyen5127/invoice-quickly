"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { logUserLogin } from "@/utils/login-logger";

export function LogUserSession() {
  const { session } = useAuth();

  useEffect(() => {
    if (session) {
      logUserLogin(session);
    }
  }, [session]);

  return null;
}
