"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardSkeleton } from "@/components/dashboard-skeleton";
import { Plus, Search, Filter, MoreVertical, Edit, FileText, Share, CheckCircle, XCircle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { getCompanyQuotes, bulkUpdateQuoteStatus, bulkDeleteQuotes } from "./actions"
import { getUserCompanies } from "../actions"
import { supabase } from "@/utils/supabase/client"

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-12 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-3">
             Quotes & Estimates
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage all your project estimates and quotes.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select 
            value={selectedCompanyId} 
            onChange={handleCompanyChange}
            className="h-11 px-4 text-sm font-bold bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl"
          >
            {companies.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button 
             onClick={() => router.push(`/quote/new?company=${selectedCompanyId}`)}
             className="flex-1 sm:flex-none h-11 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> New Quote
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800">
           <h3 className="text-sm font-bold text-zinc-500 mb-2">Total Quotes</h3>
           <p className="text-3xl font-black">{stats.total}</p>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl p-6 border border-emerald-100 dark:border-emerald-800/30">
           <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-2">Accepted</h3>
           <p className="text-3xl font-black text-emerald-700 dark:text-emerald-300">{stats.accepted}</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl p-6 border border-red-100 dark:border-red-800/30">
           <h3 className="text-sm font-bold text-red-600 dark:text-red-400 mb-2">Rejected</h3>
           <p className="text-3xl font-black text-red-700 dark:text-red-300">{stats.rejected}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
          <h2 className="text-lg font-bold">Recent Quotes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800/50 text-[11px] uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                <th className="p-4 font-bold">Quote</th>
                <th className="p-4 font-bold">Client</th>
                <th className="p-4 font-bold">Amount</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {quotes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-zinc-500 font-medium">
                    No quotes found. Create your first quote to get started!
                  </td>
                </tr>
              ) : (
                quotes.map(quote => (
                  <tr key={quote.id} className="border-b border-zinc-100 dark:border-zinc-800/60 hover:bg-zinc-50 dark:hover:bg-zinc-800/20">
                    <td className="p-4 font-bold text-zinc-900 dark:text-zinc-100">{quote.quote_number}</td>
                    <td className="p-4 text-zinc-600 dark:text-zinc-400">{quote.client_name || "Unknown"}</td>
                    <td className="p-4 font-bold text-blue-600 dark:text-blue-400">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: quote.currency }).format(quote.total_amount)}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        quote.status === 'accepted' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        quote.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        quote.status === 'invoiced' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                        'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
                      }`}>
                        {quote.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => router.push(`/share/quote/${quote.id}`)} className="p-2 text-zinc-400 hover:text-blue-600 transition-colors">
                          <Share className="w-4 h-4" />
                        </button>
                        <button onClick={() => router.push(`/quote/${quote.id}`)} className="p-2 text-zinc-400 hover:text-blue-600 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
