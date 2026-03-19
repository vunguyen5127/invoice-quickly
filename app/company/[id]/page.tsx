"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { getCompanyById, getCompanyInvoices, deleteInvoice, getAllCompanyInvoices } from "@/app/dashboard/actions";
import { format } from "date-fns";
import { Loader2, Trash2, Eye, Plus, Search, ArrowUpDown, ChevronLeft, ChevronRight, PenLine, Copy, Download } from "lucide-react";
import Link from "next/link";
import { Tooltip } from "@/components/tooltip";
import dynamic from "next/dynamic";
import { InvoicesSkeleton } from "@/components/invoices-skeleton";
import { exportInvoicesToExcel } from "@/utils/export-excel";
import { UpgradeModal } from "@/components/upgrade-modal";
import { getUserEntitlements } from "@/utils/entitlements";
const EditCompanyModal = dynamic(() => import("@/components/edit-company-modal").then(mod => mod.EditCompanyModal));
const ConfirmModal = dynamic(() => import("@/components/confirm-modal").then(mod => mod.ConfirmModal));
import { use } from "react";
import { getCurrencySymbol, STATUS_CONFIG, InvoiceStatus } from "@/types/invoice";
import { useLanguage } from "@/contexts/language-context";

type SortField = "invoice_number" | "client_name" | "created_at" | "total_amount";
type SortDir = "asc" | "desc";

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

function getDisplayStatus(status: string | null, dueDate: string | null): InvoiceStatus {
  const s = status || 'draft';
  if (s === 'paid') return 'paid';
  if (dueDate && dueDate < new Date().toISOString().split('T')[0]) return 'overdue';
  return s as InvoiceStatus;
}

function StatusBadge({ status, dueDate, t }: { status: string | null; dueDate: string | null; t: any }) {
  const displayStatus = getDisplayStatus(status, dueDate);
  const config = STATUS_CONFIG[displayStatus];
  const label = t[`status${displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}` as keyof typeof t] || displayStatus;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.color} ${config.bg} ${config.darkBg} border ${config.border}`}>
      {label}
    </span>
  );
}

export default function CompanyDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [company, setCompany] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [upgradeTrigger, setUpgradeTrigger] = useState<"company_limit" | "invoice_limit" | "recurring" | "no_ads" | "csv_export" | "general">("general");
  const [canUseAdvancedExport, setCanUseAdvancedExport] = useState(false);
  const { t } = useLanguage();
  const router = useRouter();

  // Search, Sort, Pagination, Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to first page on search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadInvoices = async (showRefreshLoader = false) => {
    if (!supabase) return;
    if (showRefreshLoader) setIsRefreshing(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const result = await getCompanyInvoices(session.access_token, resolvedParams.id, {
      page: currentPage,
      pageSize: itemsPerPage,
      search: debouncedSearch,
      sortField,
      sortDir,
      status: statusFilter
    });

    setInvoices(result.data);
    setTotalCount(result.totalCount);
    if (showRefreshLoader) setIsRefreshing(false);
  };

  useEffect(() => {
    const initLoad = async () => {
      if (!supabase) return;
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login?redirect=/dashboard");
        return;
      }

      const companyData = await getCompanyById(session.access_token, resolvedParams.id);

      if (!companyData) {
        alert("Company not found");
        router.push("/dashboard");
        return;
      }
      
      setCompany(companyData);
      
      const entitlements = await getUserEntitlements(session.access_token);
      setCanUseAdvancedExport(entitlements.canUseAdvancedExport);
      
      await loadInvoices();
      setLoading(false);
    };

    initLoad();
  }, [router, resolvedParams.id]);

  // Handle updates to paging/sorting/searching/filtering
  useEffect(() => {
    if (!loading) {
      loadInvoices(true);
    }
  }, [currentPage, itemsPerPage, debouncedSearch, sortField, sortDir, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
    setCurrentPage(1);
  };

  const handleDeleteClick = (id: string) => {
    setInvoiceToDelete(id);
  };

  const confirmDelete = async () => {
    if (!invoiceToDelete) return;
    setIsDeleting(true);
    const { data: { session } } = await supabase?.auth.getSession() || { data: { session: null }};
    if (session) {
      const success = await deleteInvoice(session.access_token, invoiceToDelete);
      if (success) {
        setInvoices(invoices.filter((inv) => inv.id !== invoiceToDelete));
      } else {
        alert("Failed to delete invoice");
      }
    }
    setIsDeleting(false);
    setInvoiceToDelete(null);
  };
  
  const handleDuplicate = (invoiceId: string) => {
    router.push(`/company/${resolvedParams.id}/new?duplicate=${invoiceId}`);
  };

  const handleCompanyUpdated = (updatedCompany: any) => {
    setCompany({ ...company, ...updatedCompany });
  };

  const SortIcon = ({ field }: { field: SortField }) => (
    <ArrowUpDown className={`w-3.5 h-3.5 inline-block ml-1 transition-colors ${sortField === field ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-300 dark:text-zinc-600'}`} />
  );

  const handleExportExcel = async () => {
    if (canUseAdvancedExport) {
      setIsExporting(true);
      try {
        if (!supabase) return;
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        
        const allInvoices = await getAllCompanyInvoices(session.access_token, resolvedParams.id);
        await exportInvoicesToExcel(allInvoices, company?.name || "Company");
      } catch (error) {
        console.error("Failed to export invoices:", error);
      } finally {
        setIsExporting(false);
      }
    } else {
      setUpgradeTrigger("csv_export");
      setIsUpgradeModalOpen(true);
    }
  };

  if (loading) {
    return <InvoicesSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 sm:px-8 py-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        {/* Breadcrumb & Company Info */}
        <nav className="flex flex-wrap items-center gap-1.5 text-sm">
          <Link href="/dashboard" className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors shrink-0">
            {t.dashboard}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-600 shrink-0" />
          <div className="flex items-center gap-2 group min-w-0">
            <span className="text-zinc-700 dark:text-zinc-200 font-medium truncate max-w-[180px] sm:max-w-[300px]">
              {(company.name || "").split(/,|\n/)[0]}
            </span>
            <Tooltip content="Edit Company Details">
              <button
                 onClick={() => setIsEditModalOpen(true)}
                 className="p-1 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
              >
                <PenLine className="w-3.5 h-3.5" />
              </button>
            </Tooltip>
          </div>
        </nav>

        <div className="flex flex-row items-center gap-2 sm:gap-3.5 w-full sm:w-auto">
          {/* Desktop Only Buttons in Header */}
          <button
            className="hidden"
          >
          </button>
          
          <Tooltip content="Export All Invoices to Excel (Pro Feature)">
            <button
              onClick={handleExportExcel}
              disabled={isExporting}
              className="group hidden sm:flex items-center justify-center gap-2.5 px-8 h-11 bg-white dark:bg-zinc-900 border border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-300 dark:hover:border-emerald-800 font-bold text-sm transition-all shadow-lg shadow-emerald-500/10 active:scale-[0.98] whitespace-nowrap disabled:opacity-50 cursor-pointer overflow-hidden relative"
            >
               {/* Subtle background glow on hover */}
               <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
               
               {isExporting ? (
                 <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
               ) : (
                 <Download className="w-4 h-4 text-emerald-500 transition-transform group-hover:-translate-y-0.5" />
               )}
               <span className="relative">{isExporting ? "Exporting..." : "Export Excel"}</span>
            </button>
          </Tooltip>
          <Link 
            href={`/company/${resolvedParams.id}/new`}
            className="hidden sm:flex items-center justify-center gap-2.5 px-8 h-11 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98] whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Create Invoice</span>
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        {/* Header with search */}
        <div className="px-4 sm:px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100 shrink-0">
            Invoices
            <span className="ml-2 text-sm font-normal text-zinc-400">({totalCount})</span>
          </h2>
          {(totalCount > 0 || statusFilter !== 'all' || debouncedSearch !== '') && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2 text-sm text-zinc-500 shrink-0">
                <span className="hidden xs:inline whitespace-nowrap font-medium text-zinc-400 uppercase text-[10px] tracking-widest mr-1">Show:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer text-xs sm:text-sm font-bold text-zinc-700 dark:text-zinc-300 shadow-sm appearance-none min-w-[65px] text-left"
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.3rem center', backgroundSize: '1rem' }}
                >
                  {PAGE_SIZE_OPTIONS.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <div className="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-700 hidden sm:block mx-1" />
                <select
                  value={statusFilter}
                  onChange={(e) => handleStatusFilterChange(e.target.value)}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer text-xs sm:text-sm font-bold text-zinc-700 dark:text-zinc-300 shadow-sm appearance-none min-w-[100px]"
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1rem' }}
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search invoices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-border bg-background text-foreground placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>
          )}
        </div>

        {invoices.length === 0 && !debouncedSearch ? (
          <div className="p-12 text-center">
            <p className="text-zinc-500 mb-4">No invoices created for this company yet.</p>
            <Link 
              href={`/company/${resolvedParams.id}/new`}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Create your first invoice &rarr;
            </Link>
          </div>
        ) : (
          <div className="relative">
            {isRefreshing && (
              <div className="absolute inset-0 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            )}
            
            {invoices.length === 0 && debouncedSearch ? (
              <div className="p-12 text-center">
                <p className="text-zinc-500">No invoices match &quot;{searchQuery}&quot;</p>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-white dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400">
                      <tr>
                        <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px] cursor-pointer select-none hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors" onClick={() => handleSort("invoice_number")}>
                          <Tooltip content="Sort by Invoice Number">
                             <div className="flex items-center gap-1">
                               Invoice Number <SortIcon field="invoice_number" />
                             </div>
                          </Tooltip>
                        </th>
                        <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px] cursor-pointer select-none hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors" onClick={() => handleSort("client_name")}>
                          <Tooltip content="Sort by Client Name">
                             <div className="flex items-center gap-1">
                               Client <SortIcon field="client_name" />
                             </div>
                          </Tooltip>
                        </th>
                        <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px] cursor-pointer select-none hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors" onClick={() => handleSort("created_at")}>
                          <Tooltip content="Sort by Date Created">
                             <div className="flex items-center gap-1">
                               Date Created <SortIcon field="created_at" />
                             </div>
                          </Tooltip>
                        </th>
                        <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px] text-right cursor-pointer select-none hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors" onClick={() => handleSort("total_amount")}>
                          <Tooltip content="Sort by Total Amount">
                             <div className="flex items-center justify-end gap-1">
                               Amount <SortIcon field="total_amount" />
                             </div>
                          </Tooltip>
                        </th>
                        <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px] text-center">
                          {t.status}
                        </th>
                        <th className="px-6 py-4 font-bold uppercase tracking-wider text-[11px] text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900/10 font-medium">
                      {invoices.map((inv: any) => (
                        <tr key={inv.id} className="group hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30 transition-colors">
                          <td className="px-6 py-5 font-bold text-zinc-900 dark:text-zinc-100">
                            {inv.invoice_number}
                          </td>
                          <td className="px-6 py-5 max-w-[200px] truncate" title={inv.client_name}>
                            {inv.client_name}
                          </td>
                          <td className="px-6 py-5 text-zinc-500">
                            {format(new Date(inv.created_at), "MMM dd, yyyy")}
                          </td>
                          <td className="px-6 py-5 font-bold text-right">
                            {getCurrencySymbol(inv.currency)}{Number(inv.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-6 py-5 text-center">
                            <StatusBadge status={inv.status} dueDate={inv.due_date} t={t} />
                          </td>
                          <td className="px-6 py-5 text-right">
                            <div className="flex items-center justify-end gap-1 transition-opacity">
                               <Tooltip content="Edit Invoice">
                                 <Link
                                    href={`/invoice/${inv.id}/edit`}
                                    className="p-2 text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors cursor-pointer"
                                  >
                                    <PenLine className="w-4 h-4" />
                                  </Link>
                               </Tooltip>
                               <Tooltip content="Duplicate Invoice">
                                  <button
                                    onClick={() => handleDuplicate(inv.id)}
                                    className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all cursor-pointer"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </button>
                               </Tooltip>
                               <Tooltip content="View Invoice">
                                  <Link
                                    href={`/invoice/${inv.id}`}
                                    className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors cursor-pointer"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Link>
                               </Tooltip>
                               <Tooltip content="Delete Invoice">
                                  <button
                                    onClick={() => handleDeleteClick(inv.id)}
                                    className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                               </Tooltip>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="sm:hidden px-4 py-10 space-y-6">
                  {invoices.map((inv: any) => (
                    <div 
                      key={inv.id} 
                      onClick={() => router.push(`/invoice/${inv.id}`)}
                      className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[24px] shadow-xl shadow-zinc-200/20 dark:shadow-none active:scale-[0.98] transition-all overflow-hidden"
                    >
                       {/* Top Accent Bar */}
                       <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                         inv.status === 'paid' ? 'bg-emerald-500' : 
                         inv.status === 'sent' ? 'bg-blue-500' : 'bg-zinc-300'
                       }`} />

                       <div className="p-6">
                          <div className="flex items-start justify-between gap-3 mb-5">
                             <div className="flex-1 min-w-0 space-y-1.5">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded-lg border border-blue-100/50 dark:border-blue-800/50">
                                    {inv.invoice_number}
                                  </span>
                                  <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-tight">
                                    {format(new Date(inv.created_at), "MMM dd, yyyy")}
                                  </span>
                                </div>
                                <h4 className="font-bold text-zinc-900 dark:text-zinc-100 truncate text-xl tracking-tight">
                                  {inv.client_name}
                                </h4>
                             </div>
                             <div className="shrink-0 pt-1">
                                <StatusBadge status={inv.status} dueDate={inv.due_date} t={t} />
                             </div>
                          </div>
                          
                          <div className="mb-6">
                             <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 block">Amount</span>
                             <p className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter flex items-baseline gap-1">
                               <span className="text-lg font-bold text-zinc-400">{getCurrencySymbol(inv.currency)}</span>
                               {Number(inv.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                             </p>
                          </div>
                          
                          <div className="flex items-center gap-2 p-1.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800" onClick={(e) => e.stopPropagation()}>
                             <Tooltip content="Edit">
                               <Link 
                                 href={`/invoice/${inv.id}/edit`} 
                                 className="flex-1 flex items-center justify-center p-3 text-zinc-500 hover:text-blue-600 bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-700 rounded-xl active:bg-zinc-50 dark:active:bg-zinc-800 transition-all"
                               >
                                  <PenLine className="w-4 h-4" />
                               </Link>
                             </Tooltip>
                             <Tooltip content="Duplicate">
                               <button 
                                 onClick={() => handleDuplicate(inv.id)} 
                                 className="flex-1 flex items-center justify-center p-3 text-zinc-500 hover:text-blue-600 bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-700 rounded-xl active:bg-zinc-50 dark:active:bg-zinc-800 transition-all"
                               >
                                  <Copy className="w-4 h-4" />
                               </button>
                             </Tooltip>
                             <Tooltip content="View">
                               <Link 
                                 href={`/invoice/${inv.id}`} 
                                 className="flex-1 flex items-center justify-center p-3 text-zinc-500 hover:text-blue-600 bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-700 rounded-xl active:bg-zinc-50 dark:active:bg-zinc-800 transition-all"
                               >
                                  <Eye className="w-4 h-4" />
                               </Link>
                             </Tooltip>
                             <Tooltip content="Delete">
                               <button 
                                 onClick={() => handleDeleteClick(inv.id)} 
                                 className="flex-1 flex items-center justify-center p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-700 rounded-xl active:bg-red-100 transition-all"
                               >
                                  <Trash2 className="w-4 h-4" />
                               </button>
                             </Tooltip>
                          </div>
                       </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 flex items-center justify-between pb-24 sm:pb-4">
                    <p className="text-xs sm:text-sm text-zinc-500 font-medium">
                      Showing <span className="text-zinc-900 dark:text-zinc-100">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="text-zinc-900 dark:text-zinc-100">{Math.min(currentPage * itemsPerPage, totalCount)}</span> of <span className="text-zinc-900 dark:text-zinc-100">{totalCount}</span>
                    </p>
                    <div className="flex items-center gap-1">
                      <Tooltip content="Previous Page">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1 || isRefreshing}
                          className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                      </Tooltip>
                      <div className="hidden xs:flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${
                            currentPage === page
                              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                              : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          } disabled:opacity-50`}
                          disabled={isRefreshing}
                        >
                          {page}
                        </button>
                      ))}
                      </div>
                      <Tooltip content="Next Page">
                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages || isRefreshing}
                          className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Floating Action Button (Mobile Only) */}
      <button
        onClick={() => router.push(`/company/${resolvedParams.id}/new`)}
        className="sm:hidden fixed bottom-24 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform z-40 border-4 border-white dark:border-zinc-950"
      >
        <Plus className="w-7 h-7" />
      </button>

      <EditCompanyModal
        isOpen={isEditModalOpen}
        initialData={company}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleCompanyUpdated}
      />

      <ConfirmModal
        isOpen={!!invoiceToDelete}
        onClose={() => setInvoiceToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Invoice?"
        message="Are you sure you want to delete this invoice? This action cannot be undone."
        isProcessing={isDeleting}
      />

      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        trigger={upgradeTrigger}
      />
    </div>
  );
}
