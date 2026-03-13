"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { getInvoiceById } from "./actions";
import { deleteInvoice } from "@/app/dashboard/actions";
import { InvoicePreview } from "@/components/invoice-preview";
import { generatePDF } from "@/utils/generate-pdf";
import { InvoiceState } from "@/types/invoice";
import { ArrowLeft, Download, Trash2, Loader2, Printer, Share2 } from "lucide-react";
import Link from "next/link";
import { ConfirmModal } from "@/components/confirm-modal";

export default function InvoiceViewPage({ params }: { params: Promise<{ id: string }> }) {
  const [invoice, setInvoice] = useState<InvoiceState | null>(null);
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
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
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
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 -ml-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:text-white dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="min-w-0 max-w-full">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 truncate">
              Invoice #{invoice.details.invoiceNumber}
            </h1>
            <div className="group relative inline-block max-w-full mt-0.5">
              <p className="text-sm text-zinc-500 truncate max-w-[250px] sm:max-w-[350px] md:max-w-[500px] cursor-default">
                {invoice.client?.name ? invoice.client.name.replace(/\n/g, ', ') : ""}
              </p>
              {invoice.client?.name && (
                <div className="absolute top-full left-0 mt-2 w-max max-w-[280px] p-2.5 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-200 text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none whitespace-pre-wrap leading-relaxed border border-zinc-200 dark:border-zinc-700">
                  {invoice.client.name}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 font-medium transition-colors border border-red-200 dark:border-red-900/30"
          >
            <Trash2 className="w-4 h-4" /> <span className="hidden sm:inline">Delete</span>
          </button>
          
          
          <button 
            onClick={handleShare}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 font-medium transition-colors border border-zinc-200 dark:border-zinc-800 shadow-sm"
          >
            <Share2 className="w-4 h-4" /> <span className="hidden sm:inline">Share</span>
          </button>
          
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-75 shadow-sm"
          >
            <Download className="w-4 h-4" /> <span className="hidden sm:inline">{isGenerating ? "Gen..." : "Download"}</span>
          </button>
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-2xl shadow-xl ring-1 ring-zinc-900/5 dark:ring-white/10 dark:shadow-none bg-zinc-200/50 dark:bg-zinc-900/80 p-2 sm:p-8 flex justify-center">
        <div className="transform origin-top transition-transform scale-[0.6] sm:scale-75 md:scale-90 lg:scale-100">
          <InvoicePreview invoice={invoice} />
        </div>
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
  );
}
