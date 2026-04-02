"use client";

import { BulkAddItemsModal } from "@/components/bulk-add-items-modal";
import { ConfirmModal } from "@/components/confirm-modal";
import { CreateClientModal } from "@/components/create-client-modal";
import { CreateItemModal } from "@/components/create-item-modal";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";
import { EditClientModal } from "@/components/edit-client-modal";
import { EditItemModal } from "@/components/edit-item-modal";
import { Tooltip } from "@/components/tooltip";
import { UpgradeModal } from "@/components/upgrade-modal";
import { useAuth } from "@/contexts/auth-context";
import { useData } from "@/contexts/data-context";
import { useLanguage } from "@/contexts/language-context";
import { SavedClient } from "@/types/client";
import { SavedItem } from "@/types/item";
import { FREE_ENTITLEMENTS } from "@/types/subscription";
import { deleteItem, deleteSavedClient } from "@/utils/supabase/items-actions";
import { Mail, MapPin, Package, PackageSearch, PenLine, Phone, Plus, Trash2, Users } from "lucide-react";
import { useEffect, useState } from "react";

export default function ItemsPage() {
  const { session } = useAuth();
  
  const { items: globItems, clients: globClients, entitlements: globEnts, loadingData, refreshData } = useData();
  const [activeTab, setActiveTab] = useState<"items" | "clients">("items");
  
  const [isBulkAddItemsModalOpen, setIsBulkAddItemsModalOpen] = useState(false);
  const [isCreateItemModalOpen, setIsCreateItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SavedItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  
  // Clients state
  const [isCreateClientModalOpen, setIsCreateClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<SavedClient | null>(null);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [upgradeTrigger, setUpgradeTrigger] = useState<"general" | "company_limit" | "invoice_limit" | "recurring" | "no_ads" | "csv_export">("general");
  
  const handleCreateNewClick = () => {
    if (activeTab === "items") {
      if (entitlements?.maxSavedItems !== null && totalItemsCount >= (entitlements?.maxSavedItems || 1)) {
        setUpgradeTrigger("general"); // or a specific library trigger if you have one
        setIsUpgradeModalOpen(true);
      } else {
        setIsCreateItemModalOpen(true);
      }
    } else {
      if (entitlements?.maxSavedClients !== null && totalClientsCount >= (entitlements?.maxSavedClients || 1)) {
        setUpgradeTrigger("general");
        setIsUpgradeModalOpen(true);
      } else {
        setIsCreateClientModalOpen(true);
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, activeTab]);

  const entitlements = globEnts || FREE_ENTITLEMENTS;

  // Client-side filtering and pagination
  const filteredItems = (globItems || []).filter((item) => item.description?.toLowerCase().includes(debouncedSearch.toLowerCase()) || item.name?.toLowerCase().includes(debouncedSearch.toLowerCase()));
  const totalItemsCount = filteredItems.length;
  const items = filteredItems.slice((page - 1) * pageSize, page * pageSize);

  const filteredClients = (globClients || []).filter((client) => client.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) || client.email?.toLowerCase().includes(debouncedSearch.toLowerCase()));
  const totalClientsCount = filteredClients.length;
  const clients = filteredClients.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    if (!loadingData && session) {
      setLoading(false);
    }
  }, [loadingData, session]);

  const { t } = useLanguage();

  const handleDeleteItem = async () => {
    if (!itemToDelete || !session) return;
    setIsDeleting(true);
    try {
      await deleteItem(session.access_token, itemToDelete);
      // Refresh context instead of fetching locally
      await refreshData();
    } catch (error) {
      alert("Failed to delete item.");
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
    }
  };

  const handleDeleteClient = async () => {
    if (!clientToDelete || !session) return;
    setIsDeleting(true);
    try {
      await deleteSavedClient(session.access_token, clientToDelete);
      await refreshData();
    } catch (error) {
      alert("Failed to delete client.");
    } finally {
      setIsDeleting(false);
      setClientToDelete(null);
    }
  };

  if (loading && page === 1 && !debouncedSearch && (globItems || []).length === 0 && (globClients || []).length === 0) {
    return <DashboardSkeleton />;
  }

  const currentCount = activeTab === "items" ? totalItemsCount : totalClientsCount;
  const currentList = activeTab === "items" ? items : clients;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-3">
            <Package className="w-8 h-8 text-blue-500 hidden sm:block" />
            {t.library || "Library"}
          </h1>
          <p className="text-zinc-500 text-xs sm:text-sm font-medium">{t.libraryDesc || "Manage your saved items and clients for quick invoicing."}</p>
        </div>
        
        <div className="hidden sm:flex items-center gap-2">
          {activeTab === "items" ? (
            <button
              onClick={() => setIsBulkAddItemsModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          ) : (
            <button
              onClick={handleCreateNewClick}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>{t.newClient || "New Client"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-px">
        <button 
          onClick={() => { setActiveTab("items"); setSearchQuery(""); }}
          className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'items' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
        >
          <Package className="w-4 h-4" />
          {t.items || "Items"}
        </button>
        <button 
          onClick={() => { setActiveTab("clients"); setSearchQuery(""); }}
          className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'clients' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
        >
          <Users className="w-4 h-4" />
          {t.clients || "Clients"}
        </button>
      </div>

      {/* Search Bar */}
      {(currentCount > 0 || searchQuery) && (
        <div className="mb-6 relative">
          <input
            type="text"
            placeholder={activeTab === "items" ? (t.searchItems || "Search items by name or description...") : (t.searchClients || "Search clients by name, email or phone...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-zinc-400 shadow-sm"
          />
          <PackageSearch className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>
      )}

      {/* Lists */}
      {loading && currentList.length === 0 ? (
        <div className="py-20 flex justify-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
      ) : activeTab === "items" ? (
        /* ITEMS TAB */
        items.length === 0 && !searchQuery ? (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-blue-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-blue-500 dark:text-zinc-400" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">{t.emptyLibrary || "Your items library is empty"}</h3>
            <p className="text-zinc-500 max-w-xs mx-auto mb-8 font-medium">{t.saveItemsSpeed || "Save your frequently billed products or services to speed up invoice creation."}</p>
            <button
              onClick={() => setIsBulkAddItemsModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold transition-all shadow-lg shadow-blue-500/25"
            >
              <Plus className="w-5 h-5" />
              <span>Add Items</span>
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
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50 font-medium whitespace-nowrap">
                  {items.map((item) => (
                    <tr key={item.id} className="group hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="px-6 py-5 whitespace-normal">
                        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{item.name}</p>
                      </td>
                      <td className="px-6 py-5 text-zinc-900 dark:text-zinc-100 font-bold">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.rate)}
                      </td>
                      <td className="px-6 py-5 text-sm text-zinc-500">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-1">
                          <Tooltip content={t.editItem || "Edit Item"}>
                            <button onClick={() => setEditingItem(item)} className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/40 rounded-lg transition-colors cursor-pointer">
                              <PenLine className="w-4 h-4" />
                            </button>
                          </Tooltip>
                          <Tooltip content={t.deleteItem || "Delete Item"}>
                            <button onClick={() => setItemToDelete(item.id)} className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40 rounded-lg transition-colors cursor-pointer">
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
        )
      ) : (
        /* CLIENTS TAB */
        clients.length === 0 && !searchQuery ? (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-blue-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-500 dark:text-zinc-400" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">{t.emptyClientsLibrary || "Your clients library is empty"}</h3>
            <p className="text-zinc-500 max-w-xs mx-auto mb-8 font-medium">{t.saveClientsSpeed || "Save your frequently billed clients to speed up invoice creation."}</p>
            <button
              onClick={handleCreateNewClick}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold transition-all shadow-lg shadow-blue-500/25"
            >
              <Plus className="w-5 h-5" />
              <span>{t.newClient || "Create Client"}</span>
            </button>
          </div>
        ) : (
          <div className="overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-zinc-50/50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">{t.clientName || "Client Name"}</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">{t.contactInfo || "Contact Info"}</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">{t.clientAddress || "Address"}</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400 text-right">{t.actions || "Actions"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50 font-medium whitespace-nowrap">
                  {clients.map((client) => (
                    <tr key={client.id} className="group hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="px-6 py-5 whitespace-normal">
                        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{client.name}</p>
                      </td>
                      <td className="px-6 py-5 text-sm">
                        <div className="flex flex-col gap-1.5 text-zinc-600 dark:text-zinc-400">
                           {client.email && <span className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" />{client.email}</span>}
                           {client.phone && <span className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" />{client.phone}</span>}
                           {(!client.email && !client.phone) && <span className="text-zinc-400 italic">No contact info</span>}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-zinc-600 dark:text-zinc-400 whitespace-normal">
                        {client.address ? (
                           <div className="flex items-start gap-2 max-w-[200px]"><MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" /> <span className="line-clamp-2">{client.address}</span></div>
                        ) : (
                           <span className="text-zinc-400 italic">No address</span>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-1">
                          <Tooltip content={t.editClient || "Edit Client"}>
                            <button onClick={() => setEditingClient(client)} className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/40 rounded-lg transition-colors cursor-pointer">
                              <PenLine className="w-4 h-4" />
                            </button>
                          </Tooltip>
                          <Tooltip content={t.deleteClient || "Delete Client"}>
                            <button onClick={() => setClientToDelete(client.id)} className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40 rounded-lg transition-colors cursor-pointer">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {clients.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-zinc-500 bg-zinc-50/30 dark:bg-zinc-800/20">
                        {t.noClientsMatching || "No clients found matching"} "{searchQuery}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {/* Pagination */}
      {currentCount > pageSize && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 py-4 shadow-sm gap-4">
          <p className="text-sm text-zinc-500">
            {t.showing || "Showing"} <span className="font-bold text-zinc-900 dark:text-zinc-100">{(page - 1) * pageSize + 1}</span> {t.to || "to"} <span className="font-bold text-zinc-900 dark:text-zinc-100">{Math.min(page * pageSize, currentCount)}</span> {t.of || "of"} <span className="font-bold text-zinc-900 dark:text-zinc-100">{currentCount}</span> {activeTab === "items" ? (t.items || "items") : (t.clients || "clients")}
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
              disabled={page * pageSize >= currentCount}
              className="px-4 py-2 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-zinc-200 dark:border-zinc-700 shadow-sm"
            >
              {t.next || "Next"}
            </button>
          </div>
        </div>
      )}

      {/* Item Modals */}
      <CreateItemModal isOpen={isCreateItemModalOpen} onClose={() => setIsCreateItemModalOpen(false)} onSuccess={() => refreshData()} />
      {editingItem && <EditItemModal isOpen={!!editingItem} initialData={editingItem} onClose={() => setEditingItem(null)} onSuccess={() => refreshData()} />}
      <BulkAddItemsModal
        isOpen={isBulkAddItemsModalOpen}
        onClose={() => setIsBulkAddItemsModalOpen(false)}
        onSuccess={async () => {
          await refreshData();
          setIsBulkAddItemsModalOpen(false);
        }}
        currentCount={totalItemsCount}
        maxItems={entitlements.maxSavedItems}
      />
      
      {/* Client Modals */}
      <CreateClientModal isOpen={isCreateClientModalOpen} onClose={() => setIsCreateClientModalOpen(false)} onSuccess={() => refreshData()} />
      {editingClient && <EditClientModal isOpen={!!editingClient} initialData={editingClient} onClose={() => setEditingClient(null)} onSuccess={() => refreshData()} />}

      {/* Delete Modals */}
      <ConfirmModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDeleteItem}
        title={t.deleteItem || "Delete Item?"}
        message={t.deleteItemConfirm || "Are you sure you want to delete this item? This action cannot be undone."}
        isProcessing={isDeleting}
      />
      
      <ConfirmModal
        isOpen={!!clientToDelete}
        onClose={() => setClientToDelete(null)}
        onConfirm={handleDeleteClient}
        title={t.deleteClient || "Delete Client?"}
        message={t.deleteClientConfirm || "Are you sure you want to delete this client? This action cannot be undone."}
        isProcessing={isDeleting}
      />

      {/* Floating Action Button (Mobile Only) */}
      <button
        onClick={() => activeTab === "items" ? setIsBulkAddItemsModalOpen(true) : handleCreateNewClick()}
        className="sm:hidden fixed bottom-24 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform z-40 border-4 border-white dark:border-zinc-950"
      >
        <Plus className="w-7 h-7" />
      </button>

      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        trigger={upgradeTrigger}
      />
    </div>
  );
}
