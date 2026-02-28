"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { getUserCompanies, deleteCompany } from "./actions";
import { format } from "date-fns";
import { Loader2, Trash2, Plus, Building2, ArrowRight, PenTool } from "lucide-react";
import Link from "next/link";
import { CreateCompanyModal } from "@/components/create-company-modal";
import { EditCompanyModal } from "@/components/edit-company-modal";

export default function Dashboard() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<any | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      if (!supabase) return;
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login?redirect=/dashboard");
        return;
      }

      const data = await getUserCompanies();
      setCompanies(data);
      setLoading(false);
    };

    loadData();
  }, [router]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault(); // Prevent navigating to company link
    if (confirm("Are you sure you want to delete this company and ALL its invoices? This cannot be undone.")) {
      const success = await deleteCompany(id);
      if (success) {
        setCompanies(companies.filter((c) => c.id !== id));
      } else {
        alert("Failed to delete company");
      }
    }
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
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Businesses</h1>
          <p className="text-zinc-500 mt-1">Select a company to manage its invoices</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Company
        </button>
      </div>

      {companies.length === 0 ? (
        <div className="bg-white/60 backdrop-blur-3xl dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-12 text-center shadow-xl ring-1 ring-zinc-900/5 dark:ring-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full -mr-32 -mt-32 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full -ml-32 -mb-32 pointer-events-none"></div>
          
          <div className="w-20 h-20 bg-gradient-to-tr from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50 shadow-inner">
            <Building2 className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-3 relative z-10">Create Your First Company</h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-sm mx-auto relative z-10 leading-relaxed">
            Get started by adding your business details. You can create multiple companies to organize your invoices separately.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 ring-1 ring-black/10 dark:ring-white/10 relative z-10"
          >
            Create Company <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => {
            const invoicesCount = company.invoices?.length || 0;
            const totalRevenue = company.invoices?.reduce((acc: number, inv: any) => acc + Number(inv.total_amount), 0) || 0;

            return (
              <Link 
                key={company.id}
                href={`/company/${company.id}`}
                className="group relative bg-white/60 backdrop-blur-2xl dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-6 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 hover:border-blue-300 dark:hover:border-blue-700/50 transition-all duration-300 flex flex-col overflow-hidden ring-1 ring-inset ring-transparent hover:ring-blue-500/20"
              >
                {/* Decorative blob */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 blur-2xl rounded-full -mr-16 -mt-16 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="flex justify-between items-start mb-6 relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-800/50 rounded-2xl flex items-center justify-center border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm group-hover:scale-105 transition-transform duration-300">
                     <Building2 className="w-7 h-7 text-zinc-700 dark:text-zinc-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                  </div>
                  <div className="flex items-center gap-1 z-10 transition-opacity">
                    <button
                      onClick={(e) => handleEdit(e, company)}
                      className="p-2.5 text-blue-500 hover:text-blue-600 bg-blue-50/50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-900/10 dark:hover:bg-blue-900/30 rounded-xl transition-all"
                      title="Edit Company"
                    >
                      <PenTool className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, company.id)}
                      className="p-2.5 text-red-500 hover:text-red-600 bg-red-50/50 hover:bg-red-100 dark:text-red-400 dark:bg-red-900/10 dark:hover:bg-red-900/30 rounded-xl transition-all"
                      title="Delete Company"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-1.5 line-clamp-1 relative">
                  {company.name}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-1 mb-6 relative">
                  {company.email || "No email provided"}
                </p>

                <div className="mt-auto pt-6 border-t border-zinc-100 dark:border-zinc-800/80 flex justify-between items-end relative">
                  <div>
                    <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Total Invoices</p>
                    <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{invoicesCount}</p>
                  </div>
                  <div className="text-right">
                     <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-md transition-all duration-300">
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                     </div>
                  </div>
                </div>
              </Link>
            )
          })}
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
    </div>
  );
}
