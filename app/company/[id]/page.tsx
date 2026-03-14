"use client";

import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { getCompanyById, getCompanyInvoices, deleteInvoice } from "@/app/dashboard/actions";
import { format } from "date-fns";
import { Loader2, Trash2, Eye, Plus, ArrowLeft, Building2, PenTool, Search, ArrowUpDown, ChevronLeft, ChevronRight, PenLine, Copy } from "lucide-react";
import Link from "next/link";
import { Tooltip } from "@/components/tooltip";
import dynamic from "next/dynamic";
import { InvoicesSkeleton } from "@/components/invoices-skeleton";

const EditCompanyModal = dynamic(() => import("@/components/edit-company-modal").then(mod => mod.EditCompanyModal));
const ConfirmModal = dynamic(() => import("@/components/confirm-modal").then(mod => mod.ConfirmModal));
import { use } from "react";
import { getCurrencySymbol } from "@/types/invoice";
import { useLanguage } from "@/contexts/language-context";

type SortField = "invoice_number" | "client_name" | "created_at" | "total_amount";
type SortDir = "asc" | "desc";

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export default function CompanyDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [company, setCompany] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { t } = useLanguage();
  const router = useRouter();

  // Search, Sort, Pagination state
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const loadData = async () => {
      if (!supabase) return;
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login?redirect=/dashboard");
        return;
      }

      const [companyData, invoiceData] = await Promise.all([
        getCompanyById(session.access_token, resolvedParams.id),
        getCompanyInvoices(session.access_token, resolvedParams.id)
      ]);

      if (!companyData) {
        alert("Company not found");
        router.push("/dashboard");
        return;
      }
      
      setCompany(companyData);
      setInvoices(invoiceData);
      setLoading(false);
    };

    loadData();
  }, [router, resolvedParams.id]);

  // Filtered + sorted invoices
  const filteredInvoices = useMemo(() => {
    let result = invoices;

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (inv) =>
          inv.invoice_number?.toLowerCase().includes(q) ||
          inv.client_name?.toLowerCase().includes(q) ||
          String(inv.total_amount).includes(q)
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === "total_amount") {
        valA = Number(valA) || 0;
        valB = Number(valB) || 0;
      } else if (sortField === "created_at") {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      } else {
        valA = String(valA || "").toLowerCase();
        valB = String(valB || "").toLowerCase();
      }

      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [invoices, searchQuery, sortField, sortDir]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / itemsPerPage));
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortField, sortDir]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
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

  if (loading) {
    return <InvoicesSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 sm:px-8 py-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        {/* Breadcrumb & Company Info */}
        <nav className="flex items-center gap-1.5 text-sm">
          <Link href="/dashboard" className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
            {t.dashboard}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-600" />
          <div className="flex items-center gap-2 group">
            <span className="text-zinc-700 dark:text-zinc-200 font-medium truncate max-w-[300px]">
              {company.name}
            </span>
            <Tooltip content="Edit Company Details">
              <button
                 onClick={() => setIsEditModalOpen(true)}
                 className="p-1 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
              >
                <PenTool className="w-3.5 h-3.5" />
              </button>
            </Tooltip>
          </div>
        </nav>

        <Link 
          href={`/company/${resolvedParams.id}/new`}
          className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-all shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 active:scale-[0.98] whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Invoice</span>
        </Link>
      </div>

      <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-[5px] overflow-hidden shadow-sm">
        {/* Header with search */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
            Invoices
            <span className="ml-2 text-sm font-normal text-zinc-400">({filteredInvoices.length})</span>
          </h2>
          {invoices.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2 text-sm text-zinc-500 w-full sm:w-auto">
                <span className="whitespace-nowrap">Show:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
                >
                  {PAGE_SIZE_OPTIONS.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search invoices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          )}
        </div>

        {invoices.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-zinc-500 mb-4">No invoices created for this company yet.</p>
            <Link 
              href={`/company/${resolvedParams.id}/new`}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Create your first invoice &rarr;
            </Link>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-zinc-500">No invoices match &quot;{searchQuery}&quot;</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-white dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400">
                  <tr>
                    <th className="px-6 py-2.5 font-medium cursor-pointer select-none hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors" onClick={() => handleSort("invoice_number")}>
                      Invoice Number <SortIcon field="invoice_number" />
                    </th>
                    <th className="px-6 py-2.5 font-medium cursor-pointer select-none hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors" onClick={() => handleSort("client_name")}>
                      Client <SortIcon field="client_name" />
                    </th>
                    <th className="px-6 py-2.5 font-medium cursor-pointer select-none hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors" onClick={() => handleSort("created_at")}>
                      Date Created <SortIcon field="created_at" />
                    </th>
                    <th className="px-6 py-2.5 font-medium text-right cursor-pointer select-none hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors" onClick={() => handleSort("total_amount")}>
                      Amount <SortIcon field="total_amount" />
                    </th>
                    <th className="px-6 py-2.5 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900/10">
                  {paginatedInvoices.map((inv) => (
                    <tr key={inv.id} className="even:bg-zinc-50/50 dark:even:bg-zinc-800/20 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors">
                      <td className="px-6 py-2.5 font-medium text-zinc-900 dark:text-zinc-100">
                        {inv.invoice_number}
                      </td>
                      <td className="px-6 py-2.5 max-w-[200px] truncate" title={inv.client_name}>
                        {inv.client_name}
                      </td>
                      <td className="px-6 py-2.5 text-zinc-500">
                        {format(new Date(inv.created_at), "MMM dd, yyyy")}
                      </td>
                      <td className="px-6 py-2.5 font-medium text-right">
                        {getCurrencySymbol(inv.currency)}{Number(inv.total_amount).toFixed(2)}
                      </td>
                      <td className="px-6 py-2.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Tooltip content="Edit Invoice">
                            <Link
                              href={`/invoice/${inv.id}/edit`}
                              className="inline-flex items-center justify-center p-2 text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-md transition-colors"
                            >
                              <PenLine className="w-4 h-4" />
                            </Link>
                          </Tooltip>
                          <Tooltip content="Duplicate Invoice">
                            <button
                              onClick={() => handleDuplicate(inv.id)}
                              className="inline-flex items-center justify-center p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </Tooltip>
                          <Tooltip content="View Invoice">
                            <Link
                              href={`/invoice/${inv.id}`}
                              className="inline-flex items-center justify-center p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                          </Tooltip>
                          <Tooltip content="Delete Invoice">
                            <button
                              onClick={() => handleDeleteClick(inv.id)}
                              className="inline-flex items-center justify-center p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-between">
                <p className="text-sm text-zinc-500">
                  Showing {((currentPage - 1) * itemsPerPage) + 1}–{Math.min(currentPage * itemsPerPage, filteredInvoices.length)} of {filteredInvoices.length}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 dark:hover:text-zinc-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 dark:hover:text-zinc-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

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
    </div>
  );
}
