"use client";

import React, { useState, useEffect } from "react";
import { Check, X, ArrowRight, Loader2, Shield, CreditCard, Infinity, Crown, Sparkles } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/utils/supabase/client";
import { createCheckoutTransaction } from "./actions";
import { isTester } from "@/utils/tester";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Paddle?: any;
  }
}

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
        setUserEmail(session.user.email || null);
      }
    };
    getUser();
  }, []);

  const handleUpgrade = async () => {
    if (!supabase) return;
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { 
        window.location.href = "/login?redirect=/pricing"; 
        return; 
      }
      
      const { transactionId } = await createCheckoutTransaction(session.access_token, isYearly);
      
      if (window.Paddle) {
        window.Paddle.Checkout.open({
          transactionId,
          settings: { 
            successUrl: `${window.location.origin}/dashboard?upgraded=1`, 
            displayMode: "overlay" 
          },
        });
      }
    } catch (err: any) { 
      console.error("Failed to open checkout:", err); 
      alert(err.message || "Failed to initialize checkout. Please try again.");
    } finally { 
      setIsLoading(false); 
    }
  };

  const monthlyPrice = 10;
  const yearlyPrice = 99;

  const comparisons = [
    { feature: "Invoice creation & download", free: true, pro: true },
    { feature: "Public invoice sharing", free: true, pro: true },
    { feature: "Companies", free: "1", pro: "Unlimited" },
    { feature: "Invoices per month", free: "15", pro: "500" },
    { feature: "Ads", free: "Yes", pro: "None" },
    { feature: "Advanced branding (logo, colors)", free: false, pro: true },
    { feature: "CSV / Excel export", free: false, pro: true },
    { feature: "Priority support", free: false, pro: true },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 font-sans selection:bg-blue-100 dark:selection:bg-blue-900/40">
      
      {/* Hero Section */}
      <section className="relative pt-16 pb-4 px-4 overflow-hidden">
        {/* Glow */}
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center overflow-hidden">
          <div className="h-[400px] w-[800px] rounded-full bg-gradient-to-br from-blue-400/20 via-indigo-300/10 to-violet-300/5 blur-3xl dark:from-blue-600/15 dark:via-indigo-500/8 dark:to-violet-600/5" />
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700 shadow-sm dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            <Sparkles className="h-4 w-4" />
            Simple, transparent pricing
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-4">
            Start free, <span className="text-blue-600 dark:text-blue-400">upgrade when ready</span>
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
            Create beautiful invoices for free. Unlock powerful features with Pro when your business grows.
          </p>
        </div>
      </section>

      {/* Toggle */}
      <div className="flex justify-center mb-10 mt-8">
        <div className="bg-zinc-100 dark:bg-zinc-900 p-1.5 rounded-xl inline-flex items-center shadow-inner relative">
          <div 
            className={`absolute h-[calc(100%-12px)] top-1.5 bottom-1.5 transition-all duration-300 ease-out bg-white dark:bg-zinc-800 rounded-lg shadow-sm ring-1 ring-zinc-200/60 dark:ring-white/5 ${!isYearly ? 'left-1.5 w-[calc(50%-6px)]' : 'left-[calc(50%+4.5px)] w-[calc(50%-6px)]'}`}
          />
          <button 
            onClick={() => setIsYearly(false)}
            className={`relative z-10 px-8 py-2.5 rounded-lg text-sm font-bold transition-colors duration-200 ${!isYearly ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'}`}
          >
            Monthly
          </button>
          <button 
            onClick={() => setIsYearly(true)}
            className={`relative z-10 px-8 py-2.5 rounded-lg text-sm font-bold transition-colors duration-200 flex items-center gap-2 ${isYearly ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'}`}
          >
            Yearly
            <span className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">-17%</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
        
        {/* Free Plan */}
        <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 flex flex-col shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">Free</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
            Perfect for getting started with professional invoicing.
          </p>
          
          <div className="flex items-baseline gap-1.5 mb-8">
            <span className="text-5xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tighter">$0</span>
            <span className="text-zinc-400 text-sm font-medium">/month</span>
          </div>

          <Link
            href="/generator?new=1"
            className="w-full py-3 px-6 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl font-bold text-sm text-center hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all mb-8 block"
          >
            Get Started Free
          </Link>

          <div className="space-y-4 flex-1">
            <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Includes</p>
            {[
              "1 Company",
              "15 Invoices / month",
              "Invoice creation & download",
              "Public invoice sharing",
              "Standard templates",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  <Check className="w-3 h-3 text-zinc-500 dark:text-zinc-400" strokeWidth={3} />
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Pro Plan */}
        <div className="relative bg-white dark:bg-zinc-900 border-2 border-blue-500/40 dark:border-blue-500/30 rounded-3xl p-8 flex flex-col shadow-lg shadow-blue-500/10">
          {/* Popular badge */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
            <div className="bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-blue-500/30 flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5" />
              Most Popular
            </div>
          </div>

          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1 mt-2">Pro</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
            For growing businesses that need powerful tools.
          </p>
          
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tighter">
              ${isYearly ? yearlyPrice : monthlyPrice}
            </span>
            <span className="text-zinc-400 text-sm font-medium">
              /{isYearly ? "year" : "month"}
            </span>
          </div>
          {isYearly && (
            <p className="text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-6">
              That&apos;s just ~${(yearlyPrice / 12).toFixed(2)}/mo — save ${monthlyPrice * 12 - yearlyPrice}/year
            </p>
          )}
          {!isYearly && <div className="mb-6" />}
          <button
            onClick={handleUpgrade}
            disabled={isLoading || !isTester(userEmail)}
            className="w-full py-3 px-6 bg-blue-600 text-white rounded-xl font-bold text-sm text-center hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/25 active:scale-[0.98] mb-8 flex items-center justify-center gap-2 disabled:opacity-50 group"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isTester(userEmail) ? (
              <>
                Subscribe to Pro
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </>
            ) : (
              "Coming Soon"
            )}
          </button>

          <div className="space-y-4 flex-1">
            <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Everything in Free, plus</p>
            {[
              "10 Companies (Fair Use)",
              "500 Invoices / month",
              "No Advertising",
              "Advanced Branding (Logo, Colors)",
              "CSV / Excel Exporting",
              "Priority Support",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Check className="w-3 h-3 text-blue-400" strokeWidth={3} />
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <section className="max-w-3xl mx-auto px-4 mb-20">
        <h2 className="text-2xl font-bold text-center text-zinc-900 dark:text-zinc-100 mb-8">Compare plans</h2>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          {/* Table Header */}
          <div className="grid grid-cols-3 px-6 py-4 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 text-xs font-bold uppercase tracking-wider text-zinc-500">
            <span>Feature</span>
            <span className="text-center">Free</span>
            <span className="text-center text-blue-600 dark:text-blue-400">Pro</span>
          </div>
          {/* Rows */}
          {comparisons.map((row, i) => (
            <div key={i} className={`grid grid-cols-3 px-6 py-3.5 text-sm items-center ${i < comparisons.length - 1 ? 'border-b border-zinc-100 dark:border-zinc-800/50' : ''}`}>
              <span className="text-zinc-700 dark:text-zinc-300 font-medium">{row.feature}</span>
              <span className="text-center">
                {row.free === true ? (
                  <Check className="w-4 h-4 text-emerald-500 mx-auto" strokeWidth={3} />
                ) : row.free === false ? (
                  <X className="w-4 h-4 text-zinc-300 dark:text-zinc-600 mx-auto" strokeWidth={2} />
                ) : (
                  <span className="text-zinc-500 dark:text-zinc-400 text-xs font-semibold">{row.free}</span>
                )}
              </span>
              <span className="text-center">
                {row.pro === true ? (
                  <Check className="w-4 h-4 text-blue-500 mx-auto" strokeWidth={3} />
                ) : row.pro === false ? (
                  <X className="w-4 h-4 text-zinc-300 dark:text-zinc-600 mx-auto" strokeWidth={2} />
                ) : (
                  <span className="text-blue-600 dark:text-blue-400 text-xs font-bold">{row.pro}</span>
                )}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 text-sm font-semibold text-zinc-400 dark:text-zinc-500">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800">
              <Shield className="w-4 h-4 text-emerald-500" />
            </div>
            No hidden fees
          </div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800">
              <CreditCard className="w-4 h-4 text-blue-500" />
            </div>
            Secure payments by Paddle
          </div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800">
              <Infinity className="w-4 h-4 text-violet-500" />
            </div>
            Cancel anytime
          </div>
        </div>
      </section>
    </div>
  );
}
