import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — Manage Your Invoices",
  description: "View and manage all your invoices from one dashboard. Invoice-Quickly's free invoice generator with invoice history and company management.",
  robots: { index: false, follow: false },
};

import { AuthGuard } from "@/components/auth-guard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50/10 dark:bg-zinc-950">
      <main className="pb-8">
        <AuthGuard>{children}</AuthGuard>
      </main>
    </div>
  );
}
