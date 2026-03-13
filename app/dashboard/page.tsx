"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { getUserCompanies, deleteCompany } from "./actions";
import { getUserEntitlements } from "@/utils/entitlements";
import { format } from "date-fns";
import { Loader2, Trash2, Plus, Building2, ArrowRight, PenLine, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { CreateCompanyModal } from "@/components/create-company-modal";
import { EditCompanyModal } from "@/components/edit-company-modal";
import { ConfirmModal } from "@/components/confirm-modal";

export default function Dashboard() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<any | null>(null);
  const [companyToDelete, setCompanyToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const PAGE_SIZE = 12;

  const loadData = async (showRefreshLoader = false) => {
    if (!supabase) return;
    if (showRefreshLoader) setIsRefreshing(true);
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/login?redirect=/dashboard");
      return;
    }

      const data = await getUserCompanies(session.access_token);
      setCompanies(data);
      setLoading(false);
    };

  useEffect(() => {
    loadData(loading ? false : true);
  }, [router, currentPage]);

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault(); // Prevent navigating to company link
    setCompanyToDelete(id);
  };

  const confirmDelete = async () => {
    if (!companyToDelete) return;
    setIsDeleting(true);
    const { data: { session } } = await supabase?.auth.getSession() || { data: { session: null }};
    if (session) {
      const success = await deleteCompany(session.access_token, companyToDelete);
      if (success) {
        setCompanies(companies.filter((c) => c.id !== companyToDelete));
      } else {
        alert("Failed to delete company");
      }
    }
    setIsDeleting(false);
    setCompanyToDelete(null);
  };

  const handleCompanyCreated = (newCompany: any) => {
    // Re-fetch or simply insert at top. For simplicity, just add to top of array with empty invoices list.
    setCompanies([{ ...newCompany, invoices: [] }, ...companies]);
  };

  const handleCompanyUpdated = (updatedCompany: any) => {
    setCompanies(companies.map(c => c.id === updatedCompany.id ? { ...c, ...updatedCompany } : c));
  };

  const handleEdit = (e: React.MouseEvent, company: any) => {
    e.preventDefault(); // Prevent navigating to company link
    setEditingCompany(company);
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 sm:px-8 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{t.myInvoices}</h1>
          <p className="text-zinc-500 mt-1">Select a company to manage its invoices</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Company</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {companies.length === 0 ? (
        <div className="bg-white/60 backdrop-blur-3xl dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-12 text-center shadow-xl ring-1 ring-zinc-900/5 dark:ring-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full -mr-32 -mt-32 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full -ml-32 -mb-32 pointer-events-none"></div>
          
          <div className="w-20 h-20 bg-gradient-to-tr from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-[5px] flex items-center justify-center mx-auto mb-6 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50 shadow-inner">
            <Building2 className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-3 relative z-10">Create Your First Company</h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-sm mx-auto relative z-10 leading-relaxed">
            Get started by adding your business details. You can create multiple companies to organize your invoices separately.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-[5px] hover:bg-blue-700 font-medium transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 ring-1 ring-black/10 dark:ring-white/10 relative z-10"
          >
            Create Company <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      ) : (
        <div className="relative">
          {isRefreshing && (
            <div className="absolute inset-0 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-3xl">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => {
            const invoicesCount = company.invoices?.length || 0;

            return (
              <Link 
                key={company.id}
                href={`/company/${company.id}`}
                className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[5px] p-5 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700/50 transition-all duration-300 flex flex-col overflow-hidden ring-1 ring-inset ring-transparent hover:ring-blue-500/10"
              >
                <div className="flex justify-between items-start mb-4 relative">
                  <div className="w-12 h-12 bg-zinc-50 dark:bg-zinc-800 rounded-full flex items-center justify-center border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm transition-transform duration-300 overflow-hidden bg-white">
                    {company.logo_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={company.logo_url} alt={`${company.name} logo`} className="max-w-full max-h-full object-contain p-1 mix-blend-multiply dark:mix-blend-normal" />
                    ) : (
                      <Building2 className="w-6 h-6 text-zinc-400 group-hover:text-blue-500 transition-colors" />
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 z-10">
                    <Tooltip content="Edit Company" position="left">
                      <button
                        onClick={(e) => handleEdit(e, company)}
                        className="p-1.5 text-zinc-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-[5px] transition-all"
                      >
                        <PenLine className="w-4 h-4" />
                      </button>
                    </Tooltip>
                    <Tooltip content="Delete Company" position="left">
                      <button
                        onClick={(e) => handleDeleteClick(e, company.id)}
                        className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-[5px] transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </Tooltip>
                  </div>
                </div>
                
                <div className="space-y-0.5 mb-4">
                  <h3 className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                    {company.name}
                  </h3>
                  <p className="text-[13px] text-zinc-500 dark:text-zinc-400 line-clamp-1">
                    {company.email || "No email provided"}
                  </p>
                </div>
 
                <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center relative">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider leading-none">Invoices</span>
                    <span className="text-[15px] font-bold text-zinc-800 dark:text-zinc-200 leading-none">{invoicesCount}</span>
                  </div>
                  <div className="w-8 h-8 rounded-[5px] bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            )
          })}
          </div>
        </div>
      )}

      {/* Pagination */}
      {!loading && totalCount > PAGE_SIZE && (
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-100 dark:border-zinc-800 pt-8">
          <p className="text-sm text-zinc-500">
            Showing {((currentPage - 1) * PAGE_SIZE) + 1}–{Math.min(currentPage * PAGE_SIZE, totalCount)} of {totalCount} businesses
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || isRefreshing}
              className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {Array.from({ length: Math.ceil(totalCount / PAGE_SIZE) }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                disabled={isRefreshing}
                className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                  currentPage === page
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                } disabled:opacity-50`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(Math.ceil(totalCount / PAGE_SIZE), prev + 1))}
              disabled={currentPage === Math.ceil(totalCount / PAGE_SIZE) || isRefreshing}
              className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5 rotate-180 sm:rotate-0" />
            </button>
          </div>
        </div>
      )}

      <CreateCompanyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleCompanyCreated} 
      />

      {editingCompany && (
        <EditCompanyModal
          isOpen={!!editingCompany}
          initialData={editingCompany}
          onClose={() => setEditingCompany(null)}
          onSuccess={handleCompanyUpdated}
        />
      )}

      <ConfirmModal
        isOpen={!!companyToDelete}
        onClose={() => setCompanyToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Company?"
        message="Are you sure you want to delete this company? All invoices associated with it will also be permanently deleted. This action cannot be undone."
        isProcessing={isDeleting}
      />

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        trigger="company_limit"
      />
    </div>
  );
}
