"use client";

import React, { useState } from "react";
import { createSavedClient } from "@/utils/supabase/items-actions";
import { X, Loader2, User, Plus } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";

interface CreateClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newClient: any) => void;
}

export function CreateClientModal({ isOpen, onClose, onSuccess }: CreateClientModalProps) {
  const { session } = useAuth();
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
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
      const newClient = await createSavedClient(session.access_token, {
        name,
        email,
        address,
        phone
      });
      onSuccess(newClient);
      setName("");
      setEmail("");
      setAddress("");
      setPhone("");
      onClose();
    } catch (error: any) {
      console.error(error);
      if (error.message?.includes("CLIENT_LIMIT_REACHED")) {
        alert("You have reached the maximum number of saved clients for the Free plan (5). Please upgrade to Pro to save unlimited clients.");
        onClose(); // Optional: close it if they need to upgrade
        // TODO: better to trigger onShowUpgrade if it was passed down, but alert works for now.
      } else {
        alert("Failed to create client.");
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
            {t.newClient || "New Client"}
          </h2>
          <button onClick={onClose} className="p-1 rounded-xl text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-5 space-y-4">
            <fieldset className={fs}>
              <legend className={lg}>{t.clientName || "Client Name"} <span className="text-red-500">*</span></legend>
              <input required type="text" value={name} onChange={e => setName(e.target.value)} className={`${ic} mt-1`} placeholder="Acme Corp" />
            </fieldset>

            <fieldset className={fs}>
              <legend className={lg}>{t.clientEmail || "Email"}</legend>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={ic} placeholder="contact@acme.com" />
            </fieldset>
            
            <fieldset className={fs}>
              <legend className={lg}>{t.clientPhone || "Phone"}</legend>
              <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className={ic} placeholder="+1 234 567 8900" />
            </fieldset>

            <fieldset className={fs}>
              <legend className={lg}>{t.clientAddress || "Address"}</legend>
              <textarea rows={2} value={address} onChange={e => setAddress(e.target.value)} className={`${ic} resize-none`} placeholder="123 Business St..." />
            </fieldset>
          </div>

          <div className="px-5 pb-5 pt-3 flex items-center justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-transparent">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors px-3 py-2">
              {t.cancel || "Cancel"}
            </button>
            <button type="submit" disabled={isSubmitting || !name.trim()} className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-primary-foreground bg-primary hover:opacity-90 rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-primary/20 active:scale-[0.98]">
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {t.saveClient || "Save Client"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
