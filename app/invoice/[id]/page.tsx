"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { getInvoiceById } from "./actions";
import { deleteInvoice } from "@/app/dashboard/actions";
import { InvoicePreview } from "@/components/invoice-preview";
import { generatePDF } from "@/utils/generate-pdf";
import { InvoiceState } from "@/types/invoice";
import { ArrowLeft, Download, Trash2, Loader2, Printer, Share2, ChevronRight } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { InvoiceViewSkeleton } from "@/components/invoice-view-skeleton";

const ConfirmModal = dynamic(() => import("@/components/confirm-modal").then(mod => mod.ConfirmModal));
import { Tooltip } from "@/components/tooltip";
import { useLanguage } from "@/contexts/language-context";

export default function InvoiceViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { t } = useLanguage();
  const [invoice, setInvoice] = useState<(InvoiceState & { _companyId?: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (!supabase) return;
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login?redirect=/dashboard");
        return;
      }

      const { id } = await params;
      const data = await getInvoiceById(session.access_token, id);
      
      if (data) {
        setInvoice(data);
      }
      setLoading(false);
    };

    fetchData();
  }, [params, router]);

  const handleDownload = async () => {
    if (!invoice) return;
    setIsGenerating(true);
    await generatePDF("invoice-capture-area", `Invoice-${invoice.details.invoiceNumber}`);
    setIsGenerating(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    try {
      const { id } = await params;
      const shareUrl = `${window.location.origin}/share/${id}`;
      
      if (navigator.share) {
        await navigator.share({
          title: `Invoice #${invoice?.details.invoiceNumber}`,
          text: 'Here is my invoice.',
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing", err);
    }
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    const { id } = await params;
    
    let token = "";
    if (supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) token = session.access_token;
    }

    if (!token) {
      alert("Session expired");
      setIsDeleting(false);
      return;
    }

    const success = await deleteInvoice(token, id);
    if (success) {
      router.push("/dashboard");
    } else {
      alert("Failed to delete invoice");
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <InvoiceViewSkeleton />;
  }

  if (!invoice) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-xl">
        <h1 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">Invoice Not Found</h1>
        <p className="text-zinc-500 mb-8">This invoice either doesn't exist or you don't have permission to view it.</p>
        <Link 
          href="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-100 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-4 sm:px-8 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-1.5 text-sm">
          <Link href="/dashboard" className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors shrink-0">
            {t.dashboard}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-600 shrink-0" />
          {invoice._companyId && (
            <>
              <Link 
                href={`/company/${invoice._companyId}`} 
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors truncate max-w-[120px] sm:max-w-[160px]"
              >
                {(invoice.company.name || "").split(/,|\n/)[0] || t.company}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-600 shrink-0" />
            </>
          )}
          <span className="text-zinc-700 dark:text-zinc-200 font-medium truncate max-w-[120px] sm:max-w-[160px]">
            Invoice #{invoice.details.invoiceNumber}
          </span>
        </nav>

        <div className="flex items-center gap-2 w-full sm:w-auto md:justify-end">
          <Tooltip content="Delete Invoice">
            <button
              onClick={() => setShowDeleteModal(true)}
              className="p-2.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </Tooltip>
          
          <Tooltip content="Share Invoice">
            <button 
              onClick={handleShare}
              className="p-2.5 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors border border-transparent hover:border-blue-100 dark:hover:border-blue-900/30"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </Tooltip>
          
          <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 mx-1 hidden sm:block" />

          <Tooltip content={isGenerating ? "Generating..." : "Download PDF"}>
            <button 
              onClick={handleDownload}
              disabled={isGenerating}
              className="p-2.5 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors border border-transparent hover:border-blue-100 dark:hover:border-blue-900/30 disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="rounded-[5px] overflow-hidden">
        <InvoicePreview invoice={invoice} />
      </div>
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Invoice?"
        message="Are you sure you want to delete this invoice? This action cannot be undone."
        isProcessing={isDeleting}
      />
    </div>
    </div>
  );
}
