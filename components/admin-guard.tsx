"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardSkeleton } from "./dashboard-skeleton";

export function AdminGuard({ children, adminEmails }: { children: React.ReactNode, adminEmails: readonly string[] }) {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!session) {
        router.replace("/login?redirect=/admin");
      } else {
        const userEmail = session.user?.email || "";
        // Basic check for admin email
        if (!adminEmails.includes(userEmail)) {
          router.replace("/dashboard");
        } else {
          setIsReady(true);
        }
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
