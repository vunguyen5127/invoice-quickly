"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardSkeleton } from "./dashboard-skeleton";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!session) {
        // Encode current pathname as redirect target
        const currentPath = window.location.pathname;
        if (currentPath.startsWith("/dashboard") || currentPath.startsWith("/company") || currentPath.startsWith("/admin")) {
          router.replace(`/login?redirect=${encodeURIComponent(currentPath)}`);
        } else {
          router.replace("/login");
        }
      } else {
        setIsReady(true);
      }
    }
  }, [loading, session, router]);

  if (loading || !isReady) {
    return (
      <div className="min-h-screen bg-zinc-50/10 dark:bg-zinc-950 flex flex-col">
        <DashboardSkeleton />
      </div>
    );
  }

  return <>{children}</>;
}
