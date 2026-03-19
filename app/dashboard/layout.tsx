import type { Metadata } from "next";
import Link from "next/link";
import { LayoutGrid, PieChart, Settings, CreditCard } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard — Manage Your Invoices",
  description: "View and manage all your invoices from one dashboard. Invoice-Quickly's free invoice generator with invoice history and company management.",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50/10 dark:bg-zinc-950">
      <main className="pb-24 sm:pb-8">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="sm:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm h-16 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-2xl border border-zinc-200/50 dark:border-white/10 rounded-full shadow-2xl z-50 flex items-center justify-around px-4">
        <Link href="/dashboard" className="flex flex-col items-center gap-1 group">
          <div className="p-1 rounded-xl group-active:scale-95 transition-transform">
            <LayoutGrid className="w-5 h-5 text-zinc-400 group-hover:text-blue-500 transition-colors" />
          </div>
          <span className="text-[10px] font-bold text-zinc-400 group-hover:text-blue-500">Home</span>
        </Link>
        <Link href="/dashboard/analytics" className="flex flex-col items-center gap-1 group">
          <div className="p-1 rounded-xl group-active:scale-95 transition-transform">
            <PieChart className="w-5 h-5 text-zinc-400 group-hover:text-blue-500 transition-colors" />
          </div>
          <span className="text-[10px] font-bold text-zinc-400 group-hover:text-blue-500">Stats</span>
        </Link>
        <Link href="/pricing" className="flex flex-col items-center gap-1 group">
          <div className="p-1 rounded-xl group-active:scale-95 transition-transform">
            <CreditCard className="w-5 h-5 text-zinc-400 group-hover:text-blue-500 transition-colors" />
          </div>
          <span className="text-[10px] font-bold text-zinc-400 group-hover:text-blue-500">Plan</span>
        </Link>
        <Link href="/dashboard/settings" className="flex flex-col items-center gap-1 group">
          <div className="p-1 rounded-xl group-active:scale-95 transition-transform">
            <Settings className="w-5 h-5 text-zinc-400 group-hover:text-blue-500 transition-colors" />
          </div>
          <span className="text-[10px] font-bold text-zinc-400 group-hover:text-blue-500">Settings</span>
        </Link>
      </nav>
    </div>
  );
}
