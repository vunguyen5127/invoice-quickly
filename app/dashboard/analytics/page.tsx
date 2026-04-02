"use client";

import React, { useEffect, useState, useMemo } from "react";
import { getDashboardStats, getUserCompanies } from "@/utils/supabase/dashboard-actions";
import { DollarSign, AlertTriangle, CheckCircle2, FileText, ChevronLeft, Loader2, Building2, TrendingUp, LayoutGrid, Download } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  Cell
} from "recharts";

type Period = 'day' | 'week' | 'month' | 'year';

export default function AnalyticsPage() {
  const { t } = useLanguage();
  const { session, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [stats, setStats] = useState({ totalOutstanding: 0, overdueCount: 0, paidThisMonth: 0, totalInvoices: 0, chartData: [] as any[] });
  const [companies, setCompanies] = useState<any[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [period, setPeriod] = useState<Period>('year');
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);

  // Initial Load
  useEffect(() => {
    if (authLoading) return;
    if (!session) {
      router.push("/login?redirect=/dashboard/analytics");
      return;
    }

    const loadInitialData = async () => {
      try {
        const companiesRes = await getUserCompanies(session.access_token, 1, 100);
        setCompanies(companiesRes.data || []);
        const dashStats = await getDashboardStats(session.access_token, { period: 'year' });
        setStats(dashStats);
      } catch (error) {
        console.error("Failed to load initial data", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [session, authLoading, router]);

  // Load Stats
  useEffect(() => {
    if (!session || loading) return;

    const loadStats = async () => {
      setStatsLoading(true);
      try {
        const dashStats = await getDashboardStats(session.access_token, { 
          companyId: selectedCompanyId || undefined,
          period 
        });
        setStats(dashStats);
      } catch (error) {
        console.error("Failed to load stats", error);
      } finally {
        setStatsLoading(false);
      }
    };

    const debounce = setTimeout(loadStats, 100);
    return () => clearTimeout(debounce);
  }, [selectedCompanyId, period, session, loading]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-3 rounded-xl shadow-lg ring-1 ring-black/5">
          <p className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
             <div key={index} className="flex items-center justify-between gap-6 mb-1 last:mb-0">
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
                   <span className="text-[12px] font-medium text-zinc-600 dark:text-zinc-400">{entry.name}</span>
                </div>
                <span className="text-[12px] font-bold text-zinc-900 dark:text-zinc-100">${entry.value.toLocaleString()}</span>
             </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const periods: { value: Period, label: string }[] = [
    { value: 'day', label: t.day || 'Day' },
    { value: 'week', label: t.week || 'Week' },
    { value: 'month', label: t.month || 'Month' },
    { value: 'year', label: t.year || 'Year' },
  ];

  const totalRevenue = useMemo(() => {
    return stats.chartData.reduce((acc, curr) => acc + curr.revenue, 0);
  }, [stats.chartData]);

  // Computed metrics from real data
  const overdueRate = stats.totalInvoices > 0
    ? Math.min(100, Math.round((stats.overdueCount / stats.totalInvoices) * 100))
    : 0;

  const collectionGrowth = useMemo(() => {
    const data = stats.chartData;
    if (data.length < 2) return null;
    const last = data[data.length - 1]?.revenue ?? 0;
    const prev = data[data.length - 2]?.revenue ?? 0;
    if (prev === 0) return last > 0 ? null : null;
    const pct = ((last - prev) / prev) * 100;
    return pct;
  }, [stats.chartData]);

  const monthlyGrowth = useMemo(() => {
    const data = stats.chartData;
    if (data.length < 2) return null;
    const last = data[data.length - 1]?.revenue ?? 0;
    const prev = data[data.length - 2]?.revenue ?? 0;
    if (prev === 0) return null;
    return ((last - prev) / prev) * 100;
  }, [stats.chartData]);

  const efficiencyLabel = useMemo(() => {
    const total = stats.totalInvoices;
    if (total === 0) return { text: '—', color: 'text-zinc-400' };
    const paidRate = (total - stats.overdueCount) / total;
    if (paidRate >= 0.85) return { text: t.high || 'High', color: 'text-emerald-500' };
    if (paidRate >= 0.6) return { text: t.medium || 'Medium', color: 'text-amber-500' };
    return { text: t.low || 'Low', color: 'text-red-500' };
  }, [stats.totalInvoices, stats.overdueCount, t.high, t.low, t.medium]);

  const Sparkline = ({ data, dataKey, color }: { data: any[], dataKey: string, color: string }) => (
    <div className="h-12 w-full mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Area 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color} 
            strokeWidth={2} 
            fillOpacity={1} 
            fill={`url(#grad-${dataKey})`} 
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#020617] transition-colors duration-500">
      {/* Background radial glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-8 py-10 max-w-7xl relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        
        {/* Header Section */}
        <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <Link 
              href="/dashboard"
              className="group p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm hover:shadow-md hover:-translate-x-0.5"
            >
              <ChevronLeft className="w-5 h-5 transition-transform group-hover:scale-110" />
            </Link>
            <div>
              <div className="flex items-center gap-3 mb-1.5">
                 <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                   {t.analytics || "Analytics"} 
                 </h1>
                 {statsLoading && <Loader2 className="w-6 h-6 animate-spin text-indigo-500 ml-1" />}
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                {t.financialBreakdown || "Financial breakdown and document performance overview."}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Period Selector - Premium Style */}
            <div className="flex bg-slate-200/50 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-slate-200/50 dark:border-white/5 backdrop-blur-md">
              {periods.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPeriod(p.value)}
                  className={`
                    px-5 h-9 rounded-xl text-[13px] font-bold transition-all duration-300
                    ${period === p.value 
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-md ring-1 ring-black/5' 
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}
                  `}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Company Filter - Premium Style */}
            <div className="group relative min-w-[220px] h-12 flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl px-0 shadow-sm hover:shadow-md transition-all overflow-hidden">
              <Building2 className="absolute left-4 w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
              <select 
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
                className="w-full pl-12 pr-10 h-full bg-transparent border-none text-[13px] font-bold text-slate-900 dark:text-slate-100 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="">{t.allCompanies || "All Companies"}</option>
                {companies.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <div className="absolute right-4 pointer-events-none text-slate-400 group-hover:translate-y-0.5 transition-transform">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"/></svg>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          {/* Outstanding Card */}
          <div className="group relative bg-white/80 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200 dark:border-white/5 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1 transition-all duration-500 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-orange-500/10 transition-colors" />
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 group-hover:scale-110 transition-transform">
                <DollarSign className="w-7 h-7 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="text-right">
                <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">{(t as any).totalOutstanding || "Outstanding"}</p>
                <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">${stats.totalOutstanding.toLocaleString()}</p>
              </div>
            </div>
            <Sparkline data={stats.chartData} dataKey="revenue" color="#f97316" />
          </div>
          
          {/* Overdue Card */}
          <div className="group relative bg-white/80 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200 dark:border-white/5 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:shadow-rose-500/10 hover:-translate-y-1 transition-all duration-500 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-rose-500/10 transition-colors" />
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20 group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-7 h-7 text-rose-600 dark:text-rose-400" />
              </div>
              <div className="text-right">
                <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">{(t as any).overdueInvoices || "Overdue"}</p>
                <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stats.overdueCount}</p>
              </div>
            </div>
            <div className="relative h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
               <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-rose-500 to-rose-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(244,63,94,0.4)]" style={{ width: `${overdueRate}%` }} />
            </div>
            <p className="text-[11px] font-bold text-rose-500/80 uppercase tracking-widest">{overdueRate}% {(t as any).overdueRate || "Overdue Rate"}</p>
          </div>
          
          {/* Collection Card */}
          <div className="group relative bg-white/80 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200 dark:border-white/5 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all duration-500 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-colors" />
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-right">
                <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">{(t as any).collection || "Collection"}</p>
                <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">${stats.paidThisMonth.toLocaleString()}</p>
              </div>
            </div>
            <Sparkline data={stats.chartData} dataKey="revenue" color="#10b981" />
            <div className="mt-2 flex items-center gap-1.5 text-[12px] font-bold">
               {collectionGrowth !== null ? (
                 <>
                   <div className={`p-1 rounded-md ${collectionGrowth >= 0 ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
                     <TrendingUp className={`w-3 h-3 ${collectionGrowth >= 0 ? 'text-emerald-500' : 'text-rose-500 rotate-180'}`} />
                   </div>
                   <span className={collectionGrowth >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}>
                     {collectionGrowth >= 0 ? '+' : ''}{collectionGrowth.toFixed(1)}% {(t as any).vsLast || "vs last"}
                   </span>
                 </>
               ) : (
                 <span className="text-slate-400">{(t as any).noGrowthMeta || "New Cycle"}</span>
               )}
            </div>
          </div>
          
          {/* Invoices Card */}
          <div className="group relative bg-white/80 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200 dark:border-white/5 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-500 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-colors" />
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 transition-transform">
                <FileText className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="text-right">
                <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">{(t as any).totalInvoices || "Total Docs"}</p>
                <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stats.totalInvoices}</p>
              </div>
            </div>
            <Sparkline data={stats.chartData} dataKey="revenue" color="#6366f1" />
            <p className="mt-2 text-[11px] text-slate-500 font-bold uppercase tracking-widest">{(t as any).overviewStatus || "System Processed"}</p>
          </div>
        </div>

        {/* Charts & Analytical Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
          
          {/* Main Revenue Stream */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-500 opacity-50" />
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
               <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3 mb-1">
                    <div className="w-2 h-6 bg-indigo-600 rounded-full" />
                    {(t as any).revenueAnalysis || "Revenue Analysis"}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                    {(t as any).collectedThroughout || "Collected volume throughout"} {period}.
                  </p>
               </div>
               <div className="flex items-center gap-6">
                 <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{(t as any).netRevenue || "Net Revenue"}</p>
                    <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">${totalRevenue.toLocaleString()}</p>
                 </div>
               </div>
            </div>

            <div className="h-[320px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#CBD5E1" opacity={0.3} />
                    <XAxis 
                      dataKey="label" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fontWeight: 800, fill: '#64748b' }} 
                      dy={15}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fontWeight: 800, fill: '#64748b' }}
                      tickFormatter={(value) => `$${value >= 1000 ? (value/1000).toFixed(0)+'k' : value}`}
                    />
                    <Tooltip 
                      content={<CustomTooltip />} 
                      cursor={{ stroke: '#4f46e5', strokeWidth: 1.5, strokeDasharray: '6 6' }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      name={t.paidLabel || "Collection"}
                      stroke="#4f46e5" 
                      strokeWidth={4}
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                      animationDuration={2000}
                      dot={false}
                      activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }}
                    />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
          </div>

          {/* Efficiency & Aging Side Column */}
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-10 shadow-sm relative flex flex-col group overflow-hidden">
             <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500/[0.05] rounded-full blur-[100px] -mr-32 -mb-32 pointer-events-none group-hover:bg-indigo-500/[0.08] transition-colors" />
             
             <div className="mb-10 relative z-10">
               <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1.5">{(t as any).performance || "Performance"}</h3>
               <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{(t as any).comparativeAging || "Comparative aging and growth."}</p>
             </div>

            <div className="flex-1 min-h-[180px] w-full relative z-10">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={stats.chartData} margin={{ top: 0, right: 0, left: -40, bottom: 0 }}>
                    <XAxis 
                      dataKey="label" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 800, fill: '#64748B' }} 
                      hide={period === 'month'}
                      dy={10}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(79, 70, 229, 0.05)' }} />
                    <Bar dataKey="revenue" name={(t as any).paid || "Paid"} radius={[6, 6, 0, 0]} barSize={period === 'month' ? 3 : 10}>
                       {stats.chartData.map((entry, index) => (
                         <Cell key={`cell-p-${index}`} fill="#4f46e5" fillOpacity={0.8} />
                       ))}
                    </Bar>
                    <Bar dataKey="overdue" name={(t as any).overdue || "Overdue"} radius={[6, 6, 0, 0]} barSize={period === 'month' ? 3 : 10}>
                       {stats.chartData.map((entry, index) => (
                         <Cell key={`cell-o-${index}`} fill="#f43f5e" fillOpacity={0.8} />
                       ))}
                    </Bar>
                 </BarChart>
               </ResponsiveContainer>
            </div>

            <div className="mt-10 space-y-6 relative z-10">
               <div className="p-5 rounded-[1.5rem] bg-slate-50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-white/5 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{(t as any).efficiencyIndex || "Efficiency Index"}</span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${efficiencyLabel.color} bg-${efficiencyLabel.color.split('-')[1]}-500/10`}>
                      {efficiencyLabel.text}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{t.periodGrowth || "Period Growth"}</span>
                    {monthlyGrowth !== null ? (
                      <span className={`text-[13px] font-black ${monthlyGrowth >= 0 ? "text-indigo-600 dark:text-indigo-400" : "text-rose-500"}`}>
                        {monthlyGrowth >= 0 ? "+" : ""}{monthlyGrowth.toFixed(1)}%
                      </span>
                    ) : (
                      <span className="text-slate-400">Stable</span>
                    )}
                  </div>
               </div>
               
               <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-[0.2em]">
                 Generated by Intelligence
               </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
