"use client";

import React, { useState } from "react";
import { createItem } from "@/app/dashboard/items/actions";
import { X, Loader2, Package, Plus } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

interface CreateItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newItem: any) => void;
}

export function CreateItemModal({ isOpen, onClose, onSuccess }: CreateItemModalProps) {
  const { session } = useAuth();
  const [name, setName] = useState("");
  const [rate, setRate] = useState<number | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fs = "w-full rounded-lg border border-border bg-background px-3 pb-2 pt-0 transition-all focus-within:border-primary/50 hover:border-zinc-300 dark:hover:border-zinc-700 group shadow-sm";
  const lg = "text-[11px] font-medium text-zinc-400 dark:text-zinc-500 px-1 ml-[-4px] group-focus-within:text-primary transition-colors empty:hidden";
  const ic = "w-full bg-transparent text-[13px] font-normal text-foreground placeholder:text-zinc-400 focus:outline-none";

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !session) return;

    setIsSubmitting(true);
    
    try {
      const newItem = await createItem(session.access_token, name, Number(rate) || 0);
      onSuccess(newItem);
      setName("");
      setRate("");
      onClose();
    } catch (error: any) {
      console.error(error);
      if (error.message?.includes("ITEM_LIMIT_REACHED")) {
        alert("You have reached the maximum number of saved items for the Free plan (10). Please upgrade to Pro to save unlimited items.");
        onClose();
      } else {
        alert("Failed to create item.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-5 pt-4 pb-4 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-[15px] font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
            <Plus className="w-4 h-4 text-blue-500" />
            New Item
          </h2>
          <button onClick={onClose} className="p-1 rounded-xl text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-5 space-y-4">
            <fieldset className={fs}>
              <legend className={lg}>Item Name / Description <span className="text-red-500">*</span></legend>
              <textarea required rows={2} value={name} onChange={e => setName(e.target.value)} className={`${ic} resize-none mt-1`} placeholder="Homepage design, 3 revisions" />
            </fieldset>

            <fieldset className={fs}>
              <legend className={lg}>Rate / Price</legend>
              <input type="number" step="0.01" value={rate} onChange={e => setRate(e.target.value ? Number(e.target.value) : "")} className={ic} placeholder="0.00" />
            </fieldset>
          </div>

          <div className="px-5 pb-5 pt-3 flex items-center justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-transparent">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors px-3 py-2">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting || !name.trim()} className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-primary-foreground bg-primary hover:opacity-90 rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-primary/20 active:scale-[0.98]">
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Save Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
