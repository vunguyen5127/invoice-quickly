"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { getCompanyById, getCompanyInvoices, deleteInvoice } from "@/app/dashboard/actions";
import { format } from "date-fns";
import { Loader2, Trash2, Eye, Plus, ArrowLeft, Building2, PenTool } from "lucide-react";
import Link from "next/link";
import { EditCompanyModal } from "@/components/edit-company-modal";
import { use } from "react";

export default function CompanyDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [company, setCompany] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      if (!supabase) return;
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login?redirect=/dashboard");
        return;
      }

      const companyData = await getCompanyById(resolvedParams.id);
      if (!companyData) {
        alert("Company not found");
        router.push("/dashboard");
        return;
      }
      setCompany(companyData);

      const invoiceData = await getCompanyInvoices(resolvedParams.id);
      setInvoices(invoiceData);
      setLoading(false);
    };

    loadData();
  }, [router, resolvedParams.id]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      const success = await deleteInvoice(id);
      if (success) {
        setInvoices(invoices.filter((inv) => inv.id !== id));
      } else {
        alert("Failed to delete invoice");
      }
    }
  };

  const handleCompanyUpdated = (updatedCompany: any) => {
    setCompany({ ...company, ...updatedCompany });
  };

  const getSymbol = (currency: string) => {
    switch (currency) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'AUD': return 'A$';
      case 'CAD': return 'C$';
      default: return '$';
    }
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
      <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Companies
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
              <Building2 className="w-5 h-5 text-zinc-500" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{company.name}</h1>
            <button
               onClick={() => setIsEditModalOpen(true)}
               className="ml-2 p-1.5 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
               title="Edit Company Details"
            >
              <PenTool className="w-4 h-4" />
            </button>
          </div>
          <p className="text-zinc-500 mb-1">{company.email}</p>
          <p className="text-zinc-500 text-sm max-w-sm truncate">{company.address}</p>
        </div>
        <Link 
          href={`/company/${resolvedParams.id}/new`}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors shadow-sm whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Create Invoice
        </Link>
      </div>

      <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Invoices</h2>
        </div>
        {invoices.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-zinc-500 mb-4">No invoices created for this company yet.</p>
            <Link 
              href={`/company/${resolvedParams.id}/new`}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Crate your first invoice &rarr;
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Invoice Number</th>
                  <th className="px-6 py-4 font-medium">Client</th>
                  <th className="px-6 py-4 font-medium">Date Created</th>
                  <th className="px-6 py-4 font-medium text-right">Amount</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900/10">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100">
                      {inv.invoice_number}
                    </td>
                    <td className="px-6 py-4">
                      {inv.client_name}
                    </td>
                    <td className="px-6 py-4 text-zinc-500">
                      {format(new Date(inv.created_at), "MMM dd, yyyy")}
                    </td>
                    <td className="px-6 py-4 font-medium text-right">
                      {getSymbol(inv.currency)}{Number(inv.total_amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/invoice/${inv.id}`}
                          className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                          title="View Invoice"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(inv.id)}
                          className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                          title="Delete Invoice"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <EditCompanyModal
        isOpen={isEditModalOpen}
        initialData={company}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleCompanyUpdated}
      />
    </div>
  );
}
