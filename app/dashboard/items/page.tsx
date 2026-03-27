"use client";

import React, { useEffect, useState } from "react";
import { getItems, deleteItem } from "./actions";
import { Plus, PenLine, Trash2, PackageSearch, Package } from "lucide-react";
import { CreateItemModal } from "@/components/create-item-modal";
import { EditItemModal } from "@/components/edit-item-modal";
import { ConfirmModal } from "@/components/confirm-modal";
import { Tooltip } from "@/components/tooltip";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";
import { SavedItem } from "@/types/item";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";

export default function ItemsPage() {
  const { session } = useAuth();
  const [items, setItems] = useState<SavedItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SavedItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const loadItems = async () => {
    if (!session) return;
    try {
      setLoading(true);
      const { data, totalCount: count } = await getItems(session.access_token, { page, pageSize, search: debouncedSearch });
      setItems(data);
      setTotalCount(count);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, [session, page, debouncedSearch]);

  const { t } = useLanguage();

  const handleDeleteItem = async () => {
    if (!itemToDelete || !session) return;
    setIsDeleting(true);
    try {
      await deleteItem(session.access_token, itemToDelete);
      loadItems();
    } catch (error) {
      alert("Failed to delete item.");
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-12 gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-3">
            <Package className="w-8 h-8 text-blue-500" />
            {t.itemsLibrary || "Item Library"}
          </h1>
          <p className="text-zinc-500 text-xs sm:text-sm font-medium">{t.itemLibraryDesc || "Manage your products and services for quick invoicing."}</p>
        </div>
        
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="hidden sm:flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>{t.newItem || "New Item"}</span>
        </button>
      </div>

      {/* Search Bar */}
      {items.length > 0 && (
        <div className="mb-6 relative">
          <input
            type="text"
            placeholder={t.searchItems || "Search items by name or description..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-zinc-400"
          />
          <PackageSearch className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>
      )}

      {/* Empty State */}
      {items.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-blue-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-blue-500 dark:text-zinc-400" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">{t.emptyLibrary || "Your library is empty"}</h3>
          <p className="text-zinc-500 max-w-xs mx-auto mb-8 font-medium">{t.saveItemsSpeed || "Save your frequently billed products or services to speed up invoice creation."}</p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold transition-all shadow-lg shadow-blue-500/25"
          >
            <Plus className="w-5 h-5" />
            <span>{t.createItem || t.newItem || "Create Item"}</span>
          </button>
        </div>
      ) : (
        <div className="overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-zinc-50/50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">{t.itemNameDesc || "Item Name & Description"}</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">{t.ratePrice || "Rate / Price"}</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">{t.addedDate || "Added Date"}</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400 text-right">{t.actions || "Actions"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50 font-medium">
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="group hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30 transition-colors"
                  >
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 whitespace-pre-wrap">{item.name}</p>
                    </td>
                    <td className="px-6 py-5 text-zinc-900 dark:text-zinc-100">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.rate)}
                    </td>
                    <td className="px-6 py-5 text-sm text-zinc-500">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-1">
                        <Tooltip content={t.editItem || "Edit Item"}>
                          <button
                            onClick={() => setEditingItem(item)}
                            className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/40 rounded-lg transition-colors cursor-pointer"
                          >
                            <PenLine className="w-4 h-4" />
                          </button>
                        </Tooltip>
                        <Tooltip content={t.deleteItem || "Delete Item"}>
                          <button
                            onClick={() => setItemToDelete(item.id)}
                            className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-zinc-500 bg-zinc-50/30 dark:bg-zinc-800/20">
                      {t.noItemsMatching || "No items found matching"} "{searchQuery}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {totalCount > pageSize && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 py-4 shadow-sm gap-4">
          <p className="text-sm text-zinc-500">
            {t.showing || "Showing"} <span className="font-bold text-zinc-900 dark:text-zinc-100">{(page - 1) * pageSize + 1}</span> {t.to || "to"} <span className="font-bold text-zinc-900 dark:text-zinc-100">{Math.min(page * pageSize, totalCount)}</span> {t.of || "of"} <span className="font-bold text-zinc-900 dark:text-zinc-100">{totalCount}</span> {t.items || "items"}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-zinc-200 dark:border-zinc-700 shadow-sm"
            >
              {t.previous || "Previous"}
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page * pageSize >= totalCount}
              className="px-4 py-2 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-zinc-200 dark:border-zinc-700 shadow-sm"
            >
              {t.next || "Next"}
            </button>
          </div>
        </div>
      )}

      <CreateItemModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSuccess={(newItem) => setItems([newItem, ...items])}
      />

      {editingItem && (
        <EditItemModal
          isOpen={!!editingItem}
          initialData={editingItem}
          onClose={() => setEditingItem(null)}
          onSuccess={(updatedItem) => setItems(items.map(i => i.id === updatedItem.id ? updatedItem : i))}
        />
      )}

      <ConfirmModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDeleteItem}
        title={t.deleteItem || "Delete Item?"}
        message={t.deleteItemConfirm || "Are you sure you want to delete this item? This action cannot be undone."}
        isProcessing={isDeleting}
      />

      {/* Floating Action Button (Mobile Only) */}
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="sm:hidden fixed bottom-24 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform z-40 border-4 border-white dark:border-zinc-950"
      >
        <Plus className="w-7 h-7" />
      </button>
    </div>
  );
}
