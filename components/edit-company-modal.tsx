"use client";

import React, { useState, useEffect } from "react";
import { updateCompany } from "@/app/dashboard/actions";
import { X, Loader2, PenTool } from "lucide-react";

interface EditCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedCompany: any) => void;
  initialData: {
    id: string;
    name: string;
    email: string;
    address: string;
  } | null;
}

export function EditCompanyModal({ isOpen, onClose, onSuccess, initialData }: EditCompanyModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setEmail(initialData.email || "");
      setAddress(initialData.address || "");
    }
  }, [initialData]);

  if (!isOpen || !initialData) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    const updatedCompany = await updateCompany(initialData.id, { name, email, address });
    setIsSubmitting(false);

    if (updatedCompany) {
      onSuccess(updatedCompany);
      onClose();
    } else {
      alert("Failed to update company. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden ring-1 ring-zinc-200 dark:ring-zinc-800 animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/20">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
            <PenTool className="w-5 h-5 text-blue-600 dark:text-blue-500" />
            Edit Company
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="edit-name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              id="edit-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              placeholder="Acme Corp"
            />
          </div>

          <div>
            <label htmlFor="edit-email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Billing Email
            </label>
            <input
              id="edit-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              placeholder="billing@acme.com"
            />
          </div>

          <div>
            <label htmlFor="edit-address" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Company Address
            </label>
            <textarea
              id="edit-address"
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow resize-none"
              placeholder="123 Business St, City, Country"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim() || (name === initialData.name && email === initialData.email && address === initialData.address)}
              className="inline-flex items-center justify-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
