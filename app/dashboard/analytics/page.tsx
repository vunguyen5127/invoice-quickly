"use client";

import React, { useEffect, useState, useMemo } from "react";
import { getDashboardStats, getUserCompanies } from "../actions";
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
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'year', label: 'Year' },
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
    if (paidRate >= 0.85) return { text: 'High', color: 'text-emerald-500' };
    if (paidRate >= 0.6) return { text: 'Medium', color: 'text-amber-500' };
    return { text: 'Low', color: 'text-red-500' };
  }, [stats.totalInvoices, stats.overdueCount]);

  return (
    <div className="min-h-screen bg-zinc-50/30 dark:bg-zinc-950">
    <div className="container mx-auto px-4 sm:px-8 py-10 max-w-7xl animate-in fade-in duration-700">
      
      {/* Header & Filter Bar */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="flex items-center gap-5">
          <Link 
            href="/dashboard"
            className="p-2.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
               <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                 Analytics 
               </h1>
               {statsLoading && <Loader2 className="w-5 h-5 animate-spin text-blue-500 ml-1" />}
            </div>
            <p className="text-zinc-500 font-medium text-sm leading-none pt-0.5">
              Financial breakdown and document performance.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Period Selector */}
          <div className="flex bg-zinc-200/50 dark:bg-zinc-800/80 p-1 rounded-xl border border-zinc-200/50 dark:border-white/5">
            {periods.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={`
                  px-4 h-8 rounded-lg text-[13px] font-bold transition-all duration-200
                  ${period === p.value 
                    ? 'bg-white dark:bg-zinc-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'}
                `}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Company Filter */}
          <div className="relative min-w-[200px] h-10 flex items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl px-0 shadow-sm overflow-hidden">
            <Building2 className="absolute left-3 w-4 h-4 text-zinc-400" />
            <select 
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              className="w-full pl-10 pr-10 h-full bg-transparent border-none text-[13px] font-bold text-zinc-900 dark:text-zinc-100 focus:outline-none appearance-none cursor-pointer"
            >
              <option value="">All Companies</option>
              {companies.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <div className="absolute right-3 pointer-events-none text-zinc-400">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"/></svg>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
        {/* Outstanding Card */}
        <div className="group relative bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-2xl p-6 hover:border-orange-500/30 transition-all duration-300 flex flex-col gap-5 overflow-hidden shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-orange-500/5 flex items-center justify-center border border-orange-500/10 transition-colors">
            <DollarSign className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Outstanding</p>
            <p className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter">${stats.totalOutstanding.toLocaleString()}</p>
          </div>
        </div>
        
        {/* Overdue Card */}
        <div className="group relative bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-2xl p-6 hover:border-red-500/30 transition-all duration-300 flex flex-col gap-5 overflow-hidden shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-red-500/5 flex items-center justify-center border border-red-500/10 transition-colors">
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Overdue</p>
            <p className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter">{stats.overdueCount}</p>
          </div>
          <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mt-1">
             <div className="h-full bg-red-500 rounded-full transition-all duration-700" style={{ width: `${overdueRate}%` }} />
          </div>
        </div>
        
        {/* Paid Card */}
        <div className="group relative bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-2xl p-6 hover:border-emerald-500/30 transition-all duration-300 flex flex-col gap-5 overflow-hidden shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/5 flex items-center justify-center border border-emerald-500/10 transition-colors">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Collection</p>
            <p className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter">${stats.paidThisMonth.toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-1.5 text-[12px] font-bold">
             {collectionGrowth !== null ? (
               <>
                 <TrendingUp className={`w-3.5 h-3.5 ${collectionGrowth >= 0 ? 'text-emerald-500' : 'text-red-400 rotate-180'}`} />
                 <span className={collectionGrowth >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}>
                   {collectionGrowth >= 0 ? '+' : ''}{collectionGrowth.toFixed(1)}% vs prev period
                 </span>
               </>
             ) : (
               <span className="text-zinc-400">No comparison data</span>
             )}
          </div>
        </div>
        
        {/* Invoices Card */}
        <div className="group relative bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300 flex flex-col gap-5 overflow-hidden shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-500/5 flex items-center justify-center border border-blue-500/10 transition-colors">
            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Invoices</p>
            <p className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter">{stats.totalInvoices}</p>
          </div>
          <p className="text-[12px] text-zinc-500 font-medium">Active document cycles</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Revenue Trend Area Chart (Spans 2 columns) */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-8 shadow-sm flex flex-col h-[450px]">
          <div className="flex items-center justify-between mb-8">
             <div className="space-y-0.5">
               <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2.5">
                 <LayoutGrid className="w-5 h-5 text-blue-500" /> Revenue Stream
               </h3>
               <p className="text-zinc-500 text-[13px] font-medium">Collected: <span className="text-emerald-500 font-bold">${totalRevenue.toLocaleString()}</span></p>
             </div>
             <button className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all text-zinc-400 hover:text-zinc-900">
                <Download className="w-4 h-4" />
             </button>
          </div>
          <div className="flex-1 w-full min-h-0">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0070f3" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#0070f3" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#E5E7EB" opacity={0.4} />
                  <XAxis 
                    dataKey="label" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                    dy={15}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                    tickFormatter={(value) => `$${value > 999 ? (value/1000)+'k' : value}`}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#0070f3', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    name="Paid"
                    stroke="#0070f3" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRev)" 
                    animationDuration={1500}
                    dot={{ r: 0 }}
                    activeDot={{ r: 4, strokeWidth: 0, fill: '#0070f3' }}
                  />
                </AreaChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Side Stats Bar Chart */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-8 shadow-sm flex flex-col h-[450px] overflow-hidden relative">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/[0.03] rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
           
           <div className="flex flex-col gap-0.5 mb-8 relative z-10">
             <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Aging Summary</h3>
             <p className="text-zinc-500 text-[13px] font-medium">Comparison across {period}</p>
           </div>

          <div className="flex-1 w-full min-h-0 relative z-10">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={stats.chartData} margin={{ top: 0, right: 0, left: -40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.3} />
                  <XAxis 
                    dataKey="label" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} 
                    hide={period === 'month'}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="revenue" name="Paid Collection" radius={[4, 4, 4, 4]} barSize={period === 'month' ? 3 : 8}>
                     {stats.chartData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill="#3b82f6" />
                     ))}
                  </Bar>
                  <Bar dataKey="overdue" name="Overdue Balance" radius={[4, 4, 4, 4]} barSize={period === 'month' ? 3 : 8}>
                     {stats.chartData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill="#ef4444" />
                     ))}
                  </Bar>
               </BarChart>
             </ResponsiveContainer>
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-white/5 relative z-10 space-y-3">
             <div className="flex justify-between items-center text-[12px] font-bold uppercase tracking-widest text-zinc-400">
                <span>Efficiency</span>
                {efficiencyLabel.text === '—' ? <span className="text-zinc-400">—</span> : <span className={efficiencyLabel.color}>{efficiencyLabel.text}</span>}
             </div>
             <div className="flex justify-between items-center text-[12px] font-bold uppercase tracking-widest text-zinc-400">
                <span>Period Growth</span>
                {monthlyGrowth !== null ? (<span className={monthlyGrowth >= 0 ? "text-blue-500" : "text-red-400"}>{monthlyGrowth >= 0 ? "+" : ""}{monthlyGrowth.toFixed(1)}%</span>) : (<span className="text-zinc-400">—</span>)}
             </div>
          </div>
        </div>

      </div>

    </div>
    </div>
  );
}
