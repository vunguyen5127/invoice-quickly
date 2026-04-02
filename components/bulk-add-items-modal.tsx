"use client";

import React, { useState } from "react";
import { createItemsBulk } from "@/utils/supabase/items-actions";
import { X, Loader2, Plus, Trash2, PackagePlus } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

const MAX_ITEMS = 10;

interface BulkAddItemsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentCount?: number;      // how many items user already has
  maxItems?: number | null;   // null = unlimited (Pro)
}

interface ItemRow {
  id: number;
  name: string;
  rate: string;
}

let rowId = 0;
const newRow = (): ItemRow => ({ id: ++rowId, name: "", rate: "" });

export function BulkAddItemsModal({ isOpen, onClose, onSuccess, currentCount = 0, maxItems = null }: BulkAddItemsModalProps) {
  const { session } = useAuth();

  // Slots remaining for free users; Pro = MAX_ITEMS
  const slotsLeft = maxItems !== null ? Math.max(0, maxItems - currentCount) : MAX_ITEMS;
  const effectiveMax = Math.min(MAX_ITEMS, slotsLeft);
  const atLimit = slotsLeft === 0;

  const [rows, setRows] = useState<ItemRow[]>([newRow()]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const addRow = () => {
    if (rows.length >= effectiveMax) return;
    setRows((p) => [...p, newRow()]);
  };

  const removeRow = (id: number) => {
    if (rows.length === 1) return;
    setRows((p) => p.filter((r) => r.id !== id));
  };

  const updateRow = (id: number, field: "name" | "rate", value: string) =>
    setRows((p) => p.map((r) => (r.id === id ? { ...r, [field]: value } : r)));

  const validRows = rows.filter((r) => r.name.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || validRows.length === 0) { setError("Please enter at least one item name."); return; }
    setError(null);
    setIsSubmitting(true);
    try {
      const created = await createItemsBulk(
        session.access_token,
        validRows.map((r) => ({ name: r.name.trim(), rate: Number(r.rate) || 0 }))
      );
      onSuccess();
      setRows([newRow()]);
      onClose();
    } catch (err: any) {
      setError(err.message?.includes("ITEM_LIMIT_REACHED")
        ? "You've reached the item limit for your plan. Please upgrade to Pro."
        : "Failed to create items. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inp = "rounded-lg border border-border bg-background px-3 py-2 text-[13px] text-foreground placeholder:text-zinc-400 focus:outline-none focus:border-primary/50 transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="px-5 pt-4 pb-4 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-[15px] font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
            <PackagePlus className="w-4 h-4 text-blue-500" />
            Bulk Add Items
            <span className="text-xs font-normal text-zinc-400">({rows.length}/{MAX_ITEMS})</span>
          </h2>
          <button onClick={onClose} className="p-1 rounded-xl text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-5 space-y-2 max-h-[60vh] overflow-y-auto">
            {/* Low slots warning */}
            {!atLimit && maxItems !== null && slotsLeft <= 3 && (
              <div className="text-xs text-amber-500 bg-amber-50 dark:bg-amber-950/20 rounded-lg px-3 py-1.5">
                You can add up to <strong>{slotsLeft}</strong> more item{slotsLeft !== 1 ? "s" : ""} on the Free plan.
              </div>
            )}

            {/* Column headers */}
            <div className="flex gap-2 mb-1 px-5">
              <span className="flex-1 text-[11px] font-medium text-zinc-400 uppercase tracking-wide">Item Name *</span>
              <span className="w-24 text-[11px] font-medium text-zinc-400 uppercase tracking-wide">Rate</span>
              <span className="w-7" />
            </div>

            {rows.map((row, idx) => (
              <div key={row.id} className="flex items-center gap-1.5 sm:gap-2">
                <span className="hidden sm:inline text-[11px] text-zinc-300 dark:text-zinc-600 w-4 text-right shrink-0">{idx + 1}</span>
                <input
                  type="text"
                  placeholder="Item name or description"
                  value={row.name}
                  onChange={(e) => updateRow(row.id, "name", e.target.value)}
                  className={`${inp} flex-1 min-w-0`}
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={row.rate}
                  onChange={(e) => updateRow(row.id, "rate", e.target.value)}
                  className={`${inp} w-16 sm:w-24 shrink-0`}
                />
                <button
                  type="button"
                  onClick={() => removeRow(row.id)}
                  disabled={rows.length === 1}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {maxItems !== null && rows.length >= effectiveMax ? (
              <a href="/pricing"
                className="flex items-center gap-1.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90 rounded-lg px-3 py-2 transition-all w-fit mt-1 ml-1">
                ✨ Upgrade to Pro for unlimited items
              </a>
            ) : rows.length < effectiveMax && (
              <button type="button" onClick={addRow}
                className="flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-600 font-medium transition-colors px-5 pt-1">
                <Plus className="w-3.5 h-3.5" />
                Add row ({effectiveMax - rows.length} remaining)
              </button>
            )}

            {error && (
              <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 rounded-lg px-3 py-2">{error}</p>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 pb-5 pt-3 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-transparent">
            <p className="text-xs text-zinc-400">
              {validRows.length} item{validRows.length !== 1 ? "s" : ""} will be saved
            </p>
            <div className="flex items-center gap-3">
              <button type="button" onClick={onClose} disabled={isSubmitting}
                className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors px-3 py-2">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting || validRows.length === 0 || atLimit}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-primary-foreground bg-primary hover:opacity-90 rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-primary/20 active:scale-[0.98]">
                {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Save {validRows.length > 0 ? validRows.length : ""} Items
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
