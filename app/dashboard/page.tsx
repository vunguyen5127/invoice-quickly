"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { getUserCompanies, deleteCompany } from "./actions";
import { getUserEntitlements } from "@/utils/entitlements";
import { Trash2, Plus, Building2, PenLine, ChevronLeft, ChevronRight, Zap } from "lucide-react";
import Link from "next/link";
import { CreateCompanyModal } from "@/components/create-company-modal";
import { EditCompanyModal } from "@/components/edit-company-modal";
import { ConfirmModal } from "@/components/confirm-modal";
import { Tooltip } from "@/components/tooltip";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";
import { FREE_ENTITLEMENTS } from "@/types/subscription";
import { useLanguage } from "@/contexts/language-context";

import { useAuth } from "@/contexts/auth-context";

export default function Dashboard() {
  const { t } = useLanguage();
  const { session, loading: authLoading } = useAuth();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [companies, setCompanies] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<any | null>(null);
  const [companyToDelete, setCompanyToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [entitlements, setEntitlements] = useState(FREE_ENTITLEMENTS);

  const router = useRouter();

  const PAGE_SIZE = 12;

  const loadData = async (showRefreshLoader = false) => {
    if (!session) return;
    if (showRefreshLoader) setIsRefreshing(true);
    
    setUserEmail(session.user.email || null);
    const data = await getUserCompanies(session.access_token, currentPage, PAGE_SIZE);
    
    // Sort companies by invoice count (highest first)
    const sortedCompanies = [...(data.data || [])].sort((a, b) => {
      const countA = a.invoices?.length || 0;
      const countB = b.invoices?.length || 0;
      return countB - countA;
    });

    setCompanies(sortedCompanies);
    setTotalCount(data.totalCount);

    const ent = await getUserEntitlements(session.access_token);
    setEntitlements(ent);



    setLoading(false);
    setIsRefreshing(false);
  };

  useEffect(() => {
    if (authLoading) return;
    if (!session) {
      router.push("/login?redirect=/dashboard");
      return;
    }
    loadData(loading ? false : true);
  }, [router, currentPage, session, authLoading]);

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent navigating to company link
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
    e.preventDefault();
    e.stopPropagation(); // Prevent navigating to company link
    setEditingCompany(company);
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-12">
      {/* Header Section */}
      <div className="flex flex-row items-center justify-between mb-4 sm:mb-12">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {t.dashboard || "Dashboard"}
          </h1>
          <p className="text-zinc-500 text-xs sm:text-sm font-medium">{t.businessEntities || "Manage your business entities and invoices."}</p>
        </div>
        
        {/* Desktop Create Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.createCompany || "Create Company"}</span>
        </button>

        {/* Mobile Create Button (Alternative header style or hidden for FAB) */}
        <div className="sm:hidden">
           {entitlements.plan === "free" && (
            <Link
               href="/pricing"
               className="group relative flex items-center gap-1.5 px-5 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/25 font-bold transition-all text-[13px] overflow-hidden active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
              <Zap className="w-3.5 h-3.5 relative z-10" />
              <span className="hidden sm:inline relative z-10">{t.upgrade || "Upgrade"}</span>
            </Link>
          )}
        </div>
      </div>

      {/* Company List Content */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : companies.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-zinc-400" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">{t.noCompaniesYet || "No companies yet"}</h3>
          <p className="text-zinc-500 max-w-xs mx-auto mb-8 font-medium">{t.createFirstCompanyDesc || "Create your first company to start generating professional invoices."}</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold transition-all shadow-lg shadow-blue-500/25"
          >
            <Plus className="w-5 h-5" />
            <span>{t.getStarted || "Get Started"}</span>
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
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">{t.company || "Company"}</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">{t.invoices || "Invoices"}</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">{t.created || "Created"}</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400 text-right">{t.actions || "Actions"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50 font-medium">
                  {companies.map((company) => (
                    <tr
                      key={company.id}
                      onClick={() => router.push(`/company/${company.id}`)}
                      className="group hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                            {company.logo_url ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img src={company.logo_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Building2 className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">{company.name}</p>
                            <p className="text-xs text-zinc-500 line-clamp-1">{company.address || (t.noAddressProvided || "No address provided")}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold">
                          <Plus className="w-3 h-3" /> {company.invoices?.length || 0}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-zinc-500">
                        {new Date(company.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-1 transition-opacity" onClick={(e) => e.stopPropagation()}>
                          <Tooltip content={t.edit || "Edit"}>
                            <button
                              onClick={(e) => handleEdit(e, company)}
                              className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/40 rounded-lg transition-colors cursor-pointer"
                            >
                              <PenLine className="w-4 h-4" />
                            </button>
                          </Tooltip>
                          <Tooltip content={t.delete || "Delete"}>
                            <button
                              onClick={(e) => handleDeleteClick(e, company.id)}
                              className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40 rounded-lg transition-colors cursor-pointer"
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
          </div>

          {/* Mobile Card View */}
          <div className="sm:hidden space-y-4 pb-8">
            {companies.map((company) => (
              <div 
                key={company.id} 
                onClick={() => router.push(`/company/${company.id}`)}
                className="group relative bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm active:scale-[0.98] transition-all overflow-hidden"
              >
                 <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                       <div className="w-14 h-14 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-700 overflow-hidden shadow-inner">
                          {company.logo_url ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={company.logo_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Building2 className="w-7 h-7 text-zinc-400" />
                          )}
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md inline-block mb-1">
                            {new Date(company.created_at).toLocaleDateString()}
                          </p>
                          <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-lg tracking-tight leading-none truncate max-w-[150px]">
                            {company.name}
                          </h4>
                       </div>
                    </div>
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                       <Tooltip content={t.edit || "Edit"}>
                         <button 
                           onClick={(e) => handleEdit(e, company)} 
                           className="p-2.5 text-zinc-500 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl active:bg-zinc-100 dark:active:bg-zinc-700 transition-colors cursor-pointer"
                         >
                            <PenLine className="w-4 h-4" />
                         </button>
                       </Tooltip>
                       <Tooltip content={t.delete || "Delete"}>
                         <button 
                           onClick={(e) => handleDeleteClick(e, company.id)} 
                           className="p-2.5 text-red-500 bg-red-50/50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-xl active:bg-red-100 dark:active:bg-red-900/40 transition-colors cursor-pointer"
                         >
                            <Trash2 className="w-4 h-4" />
                         </button>
                       </Tooltip>
                    </div>
                 </div>
                 
                 <div className="flex items-center justify-between pt-4 border-t border-zinc-50 dark:border-zinc-800/50">
                    <div className="flex flex-col">
                       <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter mb-0.5">{t.totalInvoices || "Total Invoices"}</span>
                       <span className="font-bold text-base text-zinc-900 dark:text-zinc-100">{company.invoices?.length || 0}</span>
                    </div>
                    <button className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 cursor-pointer">
                      {t.viewDetails || "View details"} <ChevronRight className="w-3 h-3" />
                    </button>
                 </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalCount > PAGE_SIZE && (
            <div className="mt-8 flex items-center justify-between pb-20 sm:pb-0">
              <p className="text-xs sm:text-sm text-zinc-500 font-medium">
                {t.showing || "Showing"} <span className="text-zinc-900 dark:text-zinc-100">{(currentPage - 1) * PAGE_SIZE + 1}</span> {t.of || "to"} <span className="text-zinc-900 dark:text-zinc-100">{Math.min(currentPage * PAGE_SIZE, totalCount)}</span> {t.of || "of"} <span className="text-zinc-900 dark:text-zinc-100">{totalCount}</span>
              </p>
              <div className="flex items-center gap-2">
                <Tooltip content={t.previousPage || "Previous Page"}>
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1 || isRefreshing}
                    className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </Tooltip>
                <div className="hidden sm:flex items-center gap-1">
                   {Array.from({ length: Math.ceil(totalCount / PAGE_SIZE) }).map((_, i) => (
                     <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        disabled={isRefreshing}
                        className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'} disabled:opacity-50`}
                     >
                       {i + 1}
                     </button>
                   ))}
                </div>
                <Tooltip content={t.nextPage || "Next Page"}>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(Math.ceil(totalCount / PAGE_SIZE), p + 1))}
                    disabled={currentPage === Math.ceil(totalCount / PAGE_SIZE) || isRefreshing}
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
      
      <button
        onClick={() => setIsModalOpen(true)}
        className="sm:hidden fixed bottom-6 right-4 w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-95 transition-transform z-40 border-4 border-white dark:border-zinc-950"
      >
        <Plus className="w-7 h-7" />
      </button>

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
        title={t.deleteCompanyTitle || "Delete Company?"}
        message={t.deleteCompanyConfirm || "Are you sure you want to delete this company? All invoices associated with it will also be deleted."}
        isProcessing={isDeleting}
      />
    </div>
  );
}
