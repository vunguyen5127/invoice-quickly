"use client";

import React, { useState } from "react";
import { X, Crown, Check, Loader2, Shield } from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import config from "@/utils/config";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Paddle?: any;
  }
}

type UpgradeTrigger = "company_limit" | "invoice_limit" | "recurring" | "no_ads" | "csv_export" | "general";

const TRIGGER_COPY: Record<UpgradeTrigger, { title: string; body: string }> = {
  company_limit: {
    title: "Unlock Multiple Companies with Pro",
    body: "Free plan supports 1 company. Upgrade to Pro to manage unlimited companies and invoices.",
  },
  invoice_limit: {
    title: "You've reached your monthly invoice limit",
    body: "Free plan includes up to 15 invoices/month. Upgrade to Pro for 500 invoices/month and no ads.",
  },
  recurring: {
    title: "Recurring Invoices are a Pro feature",
    body: "Automate your billing by upgrading to Pro. Set up recurring invoices and never miss a payment.",
  },
  no_ads: {
    title: "Remove ads with Pro",
    body: "Enjoy a clean, ad-free experience with Pro — plus unlimited companies, invoices, and more.",
  },
  csv_export: {
    title: "CSV Export is a Pro feature",
    body: "Export your invoices to CSV for easy accounting. Upgrade to Pro to unlock this and more.",
  },
  general: {
    title: "Unlock the full power of InvoiceQuickly",
    body: "Upgrade to Pro for unlimited companies, invoices, advanced branding, and more.",
  },
};

const PRO_HIGHLIGHTS = [
  "10 Companies",
  "500 Invoices / month",
  "No ads",
  "Advanced branding",
  "Priority support",
];

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: UpgradeTrigger;
}

export function UpgradeModal({ isOpen, onClose, trigger = "general" }: UpgradeModalProps) {
  const [isYearly, setIsYearly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const copy = TRIGGER_COPY[trigger];

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    if (!supabase) return;
    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = "/login?redirect=/dashboard";
        return;
      }

      const priceId = isYearly
        ? config.paddle.prices.proYearly
        : config.paddle.prices.proMonthly;

      if (window.Paddle) {
        window.Paddle.Checkout.open({
          items: [{ priceId, quantity: 1 }],
          customer: { email: session.user.email },
          customData: { user_id: session.user.id },
          settings: {
            successUrl: `${window.location.origin}/dashboard?upgraded=1`,
            displayMode: "overlay",
          },
        });
      }
    } catch (err) {
      console.error("Failed to open checkout:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 rounded-[5px] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-zinc-200 dark:border-zinc-800">
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-center">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-[5px] bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="w-14 h-14 bg-white/15 rounded-[5px] flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <Crown className="w-7 h-7 text-yellow-300" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">{copy.title}</h2>
          <p className="text-sm text-blue-100 leading-relaxed">{copy.body}</p>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className={`text-xs font-semibold ${!isYearly ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400"}`}>
              $10/mo
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${isYearly ? "bg-blue-600" : "bg-zinc-300 dark:bg-zinc-700"}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${isYearly ? "translate-x-5.5" : "translate-x-0.5"}`} />
            </button>
            <span className={`text-xs font-semibold ${isYearly ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400"}`}>
              $99/yr
            </span>
            {isYearly && (
              <span className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold">
                SAVE 17%
              </span>
            )}
          </div>

          {/* Features */}
          <div className="space-y-2.5 mb-6">
            {PRO_HIGHLIGHTS.map((feature) => (
              <div key={feature} className="flex items-center gap-2.5 text-sm text-zinc-700 dark:text-zinc-300">
                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                </div>
                {feature}
              </div>
            ))}
          </div>

          {/* CTAs */}
          <button
            onClick={handleUpgrade}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-[5px] font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>Upgrade to Pro</>
            )}
          </button>

          {/* Trust Signal Badge */}
          <p className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 mt-3 uppercase tracking-widest">
            <Shield className="w-3 h-3 text-emerald-500" />
            7-day money-back guarantee
          </p>
          <button
            onClick={onClose}
            className="w-full mt-3 px-6 py-2.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors text-center"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
