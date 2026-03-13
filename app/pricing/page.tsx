"use client";

import React, { useState, useEffect } from "react";
import { Check, Minus, Zap, ArrowRight, Loader2, Shield, CreditCard, Infinity } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/utils/supabase/client";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Paddle?: any;
  }
}

const comparisons: { feature: string; free: string | boolean; pro: string | boolean }[] = [
  { feature: "Invoice creation & download", free: true, pro: true },
  { feature: "Public invoice sharing", free: true, pro: true },
  { feature: "Companies", free: "1", pro: "Unlimited" },
  { feature: "Invoices per month", free: "50", pro: "Unlimited" },
  { feature: "Ads", free: "Yes", pro: "None" },
  { feature: "Advanced branding (logo, colors, footer)", free: false, pro: true },
  { feature: "Recurring invoices", free: false, pro: true },
  { feature: "Auto payment reminders", free: false, pro: true },
  { feature: "Advanced CSV export", free: false, pro: true },
  { feature: "Priority support", free: false, pro: true },
];

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) setUserId(session.user.id);
    };
    getUser();
  }, []);

  const handleUpgrade = async () => {
    if (!supabase) return;
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { window.location.href = "/login?redirect=/pricing"; return; }
      const priceId = isYearly
        ? process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO_YEARLY
        : process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO_MONTHLY;
      if (window.Paddle) {
        window.Paddle.Checkout.open({
          items: [{ priceId, quantity: 1 }],
          customer: { email: session.user.email },
          customData: { user_id: session.user.id },
          settings: { successUrl: `${window.location.origin}/dashboard?upgraded=1`, displayMode: "overlay" },
        });
      }
    } catch (err) { console.error("Failed to open checkout:", err); }
    finally { setIsLoading(false); }
  };

  const monthlyPrice = 10;
  const yearlyPrice = 99;
  const perMonth = isYearly ? Math.round(yearlyPrice / 12) : monthlyPrice;

  const CellValue = ({ value }: { value: string | boolean }) => {
    if (value === true) return <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 mx-auto" />;
    if (value === false) return <Minus className="w-4 h-4 text-zinc-300 dark:text-zinc-700 mx-auto" />;
    return <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{value}</span>;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-4 py-14 md:py-20 max-w-4xl">

        {/* ── Header ── */}
        <div className="text-center mb-14">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 mb-3">
            Pricing
          </h1>
          <p className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
            Start free, upgrade anytime. Simple pricing, no surprises.
          </p>
        </div>

        {/* ── Pricing Card ── */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">

          {/* ── Plan headers ── */}
          <div className="grid grid-cols-[1fr_1fr_1fr] md:grid-cols-[2fr_1fr_1fr]">
            {/* Toggle cell */}
            <div className="p-5 md:p-8 flex items-end border-b border-zinc-100 dark:border-zinc-800">
              <div className="inline-flex items-center gap-0.5 p-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                <button
                  onClick={() => setIsYearly(false)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    !isYearly
                      ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setIsYearly(true)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                    isYearly
                      ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                  }`}
                >
                  Yearly
                  <span className="px-1.5 py-px text-[9px] font-bold rounded bg-emerald-500 text-white leading-tight">
                    -17%
                  </span>
                </button>
              </div>
            </div>

            {/* Free header */}
            <div className="p-5 md:p-8 text-center border-b border-l border-zinc-100 dark:border-zinc-800">
              <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3">Free</p>
              <div className="flex items-baseline justify-center gap-0.5">
                <span className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-zinc-100">$0</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">forever</p>
              <Link
                href={userId ? "/dashboard" : "/login?redirect=/dashboard"}
                className="mt-4 w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Get started
              </Link>
            </div>

            {/* Pro header */}
            <div className="p-5 md:p-8 text-center border-b border-l border-zinc-100 dark:border-zinc-800 bg-blue-50/50 dark:bg-blue-950/20 relative">
              <div className="absolute top-2 right-2">
                <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-blue-600 text-white uppercase tracking-wider">
                  Popular
                </span>
              </div>
              <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3">Pro</p>
              <div className="flex items-baseline justify-center gap-0.5">
                <span className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-zinc-100">${perMonth}</span>
                <span className="text-zinc-400 text-xs font-medium">/mo</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                {isYearly ? `$${yearlyPrice} billed yearly` : "billed monthly"}
              </p>
              <button
                onClick={handleUpgrade}
                disabled={isLoading}
                className="mt-4 w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <>Upgrade <ArrowRight className="w-3 h-3" /></>}
              </button>
            </div>
          </div>

          {/* ── Comparison rows ── */}
          {comparisons.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-[1fr_1fr_1fr] md:grid-cols-[2fr_1fr_1fr] ${
                i < comparisons.length - 1 ? "border-b border-zinc-100 dark:border-zinc-800/60" : ""
              } ${i % 2 === 0 ? "bg-zinc-50/50 dark:bg-zinc-900/50" : "bg-white dark:bg-zinc-950/30"}`}
            >
              <div className="px-5 md:px-8 py-3 md:py-3.5 text-[13px] text-zinc-600 dark:text-zinc-400 font-medium">
                {row.feature}
              </div>
              <div className="px-5 md:px-8 py-3 md:py-3.5 text-center border-l border-zinc-100 dark:border-zinc-800/60">
                <CellValue value={row.free} />
              </div>
              <div className="px-5 md:px-8 py-3 md:py-3.5 text-center border-l border-zinc-100 dark:border-zinc-800/60 bg-blue-50/30 dark:bg-blue-950/10">
                <CellValue value={row.pro} />
              </div>
            </div>
          ))}
        </div>

        {/* ── Trust bar ── */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-12 text-zinc-400 dark:text-zinc-500 text-[13px]">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>Secure checkout</span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            <span>No credit card for Free</span>
          </div>
          <div className="flex items-center gap-2">
            <Infinity className="w-4 h-4" />
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
    </div>
  );
}
