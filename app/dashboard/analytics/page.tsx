"use client";

import React, { useEffect, useState } from "react";
import { getDashboardStats } from "../actions";
import { DollarSign, AlertTriangle, CheckCircle2, FileText, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

export default function AnalyticsPage() {
  const { t } = useLanguage();
  const { session, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [stats, setStats] = useState({ totalOutstanding: 0, overdueCount: 0, paidThisMonth: 0, totalInvoices: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!session) {
      router.push("/login?redirect=/dashboard/analytics");
      return;
    }

    const loadData = async () => {
      try {
        const dashStats = await getDashboardStats(session.access_token);
        setStats(dashStats);
      } catch (error) {
        console.error("Failed to load stats", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [session, authLoading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-8 py-8 max-w-7xl">
      <div className="mb-8 flex items-center gap-4">
        <Link 
          href="/dashboard"
          className="p-2.5 rounded-[5px] hover:bg-white dark:hover:bg-zinc-800 transition-all shadow-sm border border-transparent hover:border-zinc-200 dark:hover:border-white/10 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 bg-zinc-50 dark:bg-zinc-900/50"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Analytics</h1>
          <p className="text-zinc-500 mt-1">Overview of your invoicing data</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Outstanding Card */}
        <div className="group relative bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200/50 dark:border-white/10 rounded-[5px] p-6 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1 hover:border-amber-500/30 dark:hover:border-amber-400/30 transition-all duration-300 flex flex-col gap-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="w-12 h-12 rounded-[5px] bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center border border-amber-100 dark:border-amber-900/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 relative z-10">
            <DollarSign className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="relative z-10">
            <p className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">{t.totalOutstanding || "Total Outstanding"}</p>
            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 break-words">${stats.totalOutstanding.toLocaleString()}</p>
          </div>
        </div>
        
        {/* Overdue Card */}
        <div className="group relative bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200/50 dark:border-white/10 rounded-[5px] p-6 hover:shadow-2xl hover:shadow-red-500/10 hover:-translate-y-1 hover:border-red-500/30 dark:hover:border-red-400/30 transition-all duration-300 flex flex-col gap-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="w-12 h-12 rounded-[5px] bg-red-50 dark:bg-red-900/20 flex items-center justify-center border border-red-100 dark:border-red-900/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 relative z-10">
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div className="relative z-10">
            <p className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">{t.overdueInvoices || "Overdue"}</p>
            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{stats.overdueCount}</p>
          </div>
        </div>
        
        {/* Paid Card */}
        <div className="group relative bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200/50 dark:border-white/10 rounded-[5px] p-6 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1 hover:border-emerald-500/30 dark:hover:border-emerald-400/30 transition-all duration-300 flex flex-col gap-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="w-12 h-12 rounded-[5px] bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 relative z-10">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="relative z-10">
            <p className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">{t.paidThisMonth || "Paid This Month"}</p>
            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 break-words">${stats.paidThisMonth.toLocaleString()}</p>
          </div>
        </div>
        
        {/* Invoices Count Card */}
        <div className="group relative bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200/50 dark:border-white/10 rounded-[5px] p-6 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 hover:border-blue-500/30 dark:hover:border-blue-400/30 transition-all duration-300 flex flex-col gap-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="w-12 h-12 rounded-[5px] bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center border border-blue-100 dark:border-blue-900/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 relative z-10">
            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="relative z-10">
            <p className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">{t.totalInvoices || "Total Invoices"}</p>
            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{stats.totalInvoices}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
