"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardSkeleton } from "@/components/dashboard-skeleton";
import { Plus, Search, Filter, MoreVertical, Edit, FileText, Share, CheckCircle, XCircle, PenLine, Share2, Eye } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { getCompanyQuotes, bulkUpdateQuoteStatus, bulkDeleteQuotes } from "./actions"
import { getUserCompanies } from "../actions"
import { supabase } from "@/utils/supabase/client"
import { Tooltip } from "@/components/tooltip"

export default function QuotesDashboard() {
  const { t } = useLanguage()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [quotes, setQuotes] = useState<any[]>([])
  const [companies, setCompanies] = useState<any[]>([])
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("")
  const [stats, setStats] = useState({ total: 0, accepted: 0, rejected: 0 })

  // Same logic as invoices dashboard simplified
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    if (!supabase) return;
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const comps = await getUserCompanies(session.access_token)
    if (comps.data && comps.data.length > 0) {
      setCompanies(comps.data)
      const firstCompId = comps.data[0].id
      setSelectedCompanyId(firstCompId)
      
      const res = await getCompanyQuotes(session.access_token, firstCompId, { pageSize: 100 })
      if (res.data) {
         setQuotes(res.data)
         const acc = res.data.filter(q => q.status === 'accepted').length
         const rej = res.data.filter(q => q.status === 'rejected').length
         setStats({ total: res.data.length, accepted: acc, rejected: rej })
      }
    }
    setLoading(false)
  }

  const handleCompanyChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const compId = e.target.value
    setSelectedCompanyId(compId)
    setLoading(true)
    if (!supabase) return;
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
       const res = await getCompanyQuotes(session.access_token, compId, { pageSize: 100 })
       if (res.data) {
         setQuotes(res.data)
         const acc = res.data.filter(q => q.status === 'accepted').length
         const rej = res.data.filter(q => q.status === 'rejected').length
         setStats({ total: res.data.length, accepted: acc, rejected: rej })
       }
    }
    setLoading(false)
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  if (companies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm text-center">
        <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-6">
          <FileText className="w-8 h-8 text-blue-500" />
        </div>
        <h3 className="text-xl font-bold mb-2">No Companies Found</h3>
        <p className="text-zinc-500 dark:text-zinc-400 mb-6">Please create a company first to create quotes.</p>
        <button onClick={() => router.push('/dashboard')} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl">Go to Dashboard</button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-12 gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-3">
             Quotes & Estimates
          </h1>
          <p className="text-zinc-500 text-xs sm:text-sm font-medium">Manage all your project estimates and quotes.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select 
            value={selectedCompanyId} 
            onChange={handleCompanyChange}
            className="flex-1 sm:flex-none h-10 px-4 text-sm font-bold bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {companies.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button 
             onClick={() => router.push(`/quote/new?company=${selectedCompanyId}`)}
             className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98] cursor-pointer"
          >
             <Plus className="w-4 h-4" />
             <span>New Quote</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-8 sm:mb-10">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 sm:p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-center">
           <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1 sm:mb-2 truncate">Total Quotes</h3>
           <p className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">{stats.total}</p>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl p-4 sm:p-6 border border-emerald-100 dark:border-emerald-900/30 shadow-sm flex flex-col justify-center">
           <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-500 mb-1 sm:mb-2 truncate">Accepted</h3>
           <p className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-400">{stats.accepted}</p>
        </div>
        <div className="bg-red-50 dark:bg-red-950/20 rounded-2xl p-4 sm:p-6 border border-red-100 dark:border-red-900/30 shadow-sm flex flex-col justify-center">
           <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-500 mb-1 sm:mb-2 truncate">Rejected</h3>
           <p className="text-2xl sm:text-3xl font-black text-red-700 dark:text-red-400">{stats.rejected}</p>
        </div>
      </div>

      {quotes.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-zinc-400" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">No quotes found</h3>
          <p className="text-zinc-500 max-w-xs mx-auto mb-8 font-medium">Create your first quote to get started estimating projects.</p>
          <button
            onClick={() => router.push(`/quote/new?company=${selectedCompanyId}`)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98]"
          >
            <Plus className="w-5 h-5" />
            <span>Create Quote</span>
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-zinc-50/50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Quote</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Client</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Amount</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Status</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50 font-medium">
                  {quotes.map((quote) => (
                    <tr
                      key={quote.id}
                      onClick={() => router.push(`/quote/${quote.id}`)}
                      className="group hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center border border-blue-100 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{quote.quote_number}</p>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 max-w-[300px] leading-relaxed">
                          {quote.client_name || "Unknown"}
                        </p>
                      </td>
                      <td className="px-6 py-5 font-bold text-sm text-zinc-900 dark:text-zinc-100">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: quote.currency }).format(quote.total_amount)}
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          quote.status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' :
                          quote.status === 'rejected' ? 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800' :
                          quote.status === 'invoiced' ? 'bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800' :
                          'bg-zinc-100 text-zinc-700 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700'
                        }`}>
                          {quote.status}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-1 transition-opacity" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => { e.stopPropagation(); router.push(`/share/quote/${quote.id}`); }}
                            className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/40 rounded-lg transition-colors cursor-pointer"
                            title="Share Quote"
                          >
                            <Share className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); router.push(`/quote/${quote.id}`); }}
                            className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/40 rounded-lg transition-colors cursor-pointer"
                            title="Edit Quote"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
                {/* Mobile Card View */}
                <div className="sm:hidden px-4 py-8 space-y-6">
                  {quotes.map((quote) => (
                    <div 
                      key={quote.id} 
                      onClick={() => router.push(`/quote/${quote.id}`)}
                      className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[24px] shadow-xl shadow-zinc-200/20 dark:shadow-none active:scale-[0.98] transition-all overflow-hidden"
                    >
                       {/* Top Accent Bar */}
                       <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                         quote.status === 'accepted' ? 'bg-emerald-500' : 
                         quote.status === 'rejected' ? 'bg-red-500' : 'bg-zinc-300'
                       }`} />

                       <div className="p-6">
                          <div className="flex items-start justify-between gap-3 mb-5">
                             <div className="flex-1 min-w-0 space-y-1.5">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded-lg border border-blue-100/50 dark:border-blue-800/50">
                                    {quote.quote_number}
                                  </span>
                                  <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-tight">
                                    {new Date(quote.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                                <h4 className="font-bold text-zinc-900 dark:text-zinc-100 truncate text-xl tracking-tight leading-tight">
                                  {quote.client_name?.split(',')[0] || "Unknown Client"}
                                </h4>
                             </div>
                             <div className="shrink-0 pt-1">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  quote.status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' :
                                  quote.status === 'rejected' ? 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800' :
                                  quote.status === 'invoiced' ? 'bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800' :
                                  'bg-zinc-100 text-zinc-700 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700'
                                }`}>
                                  {quote.status}
                                </span>
                             </div>
                          </div>
                          
                          <div className="flex items-baseline gap-2.5 mb-6 py-3 border-y border-zinc-50 dark:border-zinc-800/50">
                             <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest shrink-0">Amount</span>
                             <p className="text-xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight flex items-baseline gap-1">
                               <span className="text-sm font-bold text-zinc-400">
                                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: quote.currency }).format(0).replace(/[0-9.,]/g, '')}
                               </span>
                               {Number(quote.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                             </p>
                          </div>
                          
                          <div className="flex items-center gap-2 p-1.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800" onClick={(e) => e.stopPropagation()}>
                             <Tooltip content="Edit Quote">
                               <button 
                                 onClick={() => router.push(`/quote/${quote.id}/edit`)} 
                                 className="flex-1 flex items-center justify-center p-3 text-zinc-500 hover:text-blue-600 bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-700 rounded-xl active:bg-zinc-50 dark:active:bg-zinc-800 transition-all cursor-pointer"
                               >
                                  <PenLine className="w-4 h-4" />
                               </button>
                             </Tooltip>
                             <Tooltip content="Share Quote">
                               <button 
                                 onClick={() => {
                                   navigator.clipboard.writeText(`${window.location.origin}/quote/${quote.id}/public`);
                                   alert("Public link copied to clipboard!");
                                 }} 
                                 className="flex-1 flex items-center justify-center p-3 text-zinc-500 hover:text-blue-600 bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-700 rounded-xl active:bg-zinc-50 dark:active:bg-zinc-800 transition-all cursor-pointer"
                               >
                                  <Share2 className="w-4 h-4" />
                               </button>
                             </Tooltip>
                             <Tooltip content="View Quote">
                               <button 
                                 onClick={() => router.push(`/quote/${quote.id}`)} 
                                 className="flex-1 flex items-center justify-center p-3 text-zinc-500 hover:text-blue-600 bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-700 rounded-xl active:bg-zinc-50 dark:active:bg-zinc-800 transition-all cursor-pointer"
                               >
                                  <Eye className="w-4 h-4" />
                               </button>
                             </Tooltip>
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
        </>
      )}

      {/* Floating Action Button for Mobile */}
      <button
        onClick={() => router.push(`/quote/new?company=${selectedCompanyId}`)}
        className="sm:hidden fixed bottom-6 right-4 w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-95 transition-transform z-40 border-4 border-white dark:border-zinc-950"
      >
        <Plus className="w-7 h-7" />
      </button>
    </div>
  )
}
