"use client";

import React, { useState, useEffect } from "react";
import { Check, Minus, Zap, ArrowRight, Loader2, Shield, CreditCard, Infinity } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/utils/supabase/client";
import { createCheckoutTransaction } from "./actions";

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
  const perMonth = isYearly ? Math.round(yearlyPrice / 12) : monthlyPrice;

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 font-sans selection:bg-blue-100 dark:selection:bg-blue-900/40">
      <div className="container mx-auto px-4 py-6 md:py-10 max-w-5xl">
        
        {/* Toggle - Pill style centered */}
        <div className="flex justify-center mb-6">
           <div className="bg-zinc-100 dark:bg-zinc-900 p-0.5 rounded-[7px] inline-flex items-center shadow-inner relative">
              {/* Sliding Background */}
              <div 
                className={`absolute h-[calc(100%-4px)] top-0.5 bottom-0.5 transition-all duration-300 ease-out bg-white dark:bg-zinc-800 rounded-[5px] shadow-sm ring-1 ring-zinc-200/50 dark:ring-white/5 ${!isYearly ? 'left-0.5 w-[calc(50%-2px)]' : 'left-[calc(50%)] w-[calc(50%-2px)]'}`}
              />
              
              <button 
                onClick={() => setIsYearly(false)}
                className={`relative z-10 px-7 py-1.5 rounded-[5px] text-xs font-bold transition-colors duration-200 ${!isYearly ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'}`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setIsYearly(true)}
                className={`relative z-10 px-7 py-1.5 rounded-[5px] text-xs font-bold transition-colors duration-200 flex items-center gap-3 ${isYearly ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'}`}
              >
                Yearly
                <span className="bg-blue-600 text-white text-[9px] px-1.5 py-0.5 rounded-sm ml-0.5">Save 17%</span>
              </button>
           </div>
        </div>

        {/* Grid - Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 max-w-4xl mx-auto items-start">
           
           {/* Free Plan */}
           <div className="flex flex-col group animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mb-1">Free</h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-[13px] leading-relaxed mb-6 min-h-[32px]">
                Try professional invoicing for your startup.
              </p>
              
              <div className="flex items-baseline gap-1.5 mb-6">
                <span className="text-5xl md:text-6xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter">$0</span>
                <span className="text-zinc-400 font-bold text-xs leading-tight">per<br/>month</span>
              </div>

              <div className="flex-1"></div>

              <div className="space-y-3">
                <p className="text-zinc-900 dark:text-zinc-100 font-bold text-[13px]">This includes:</p>
                <ul className="space-y-3">
                   {[
                     "1 Company",
                     "15 Invoices per month",
                     "Invoice creation & download",
                     "Public invoice sharing",
                     "Standard templates",
                     "Ads enabled"
                   ].map((item, i) => (
                     <li key={i} className="flex items-start gap-3 text-zinc-600 dark:text-zinc-400 text-[12px] leading-tight">
                       <div className="mt-0.5 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-sm border border-zinc-200/50 dark:border-white/5 flex-shrink-0">
                         <Check className="w-3 h-3 text-zinc-600 dark:text-zinc-400" strokeWidth={3} />
                       </div>
                       {item}
                     </li>
                   ))}
                </ul>
              </div>
           </div>

           {/* Pro Plan */}
           <div className="flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">Pro</h2>
                <span className="bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider">Popular</span>
              </div>
              <p className="text-zinc-500 dark:text-zinc-400 text-[13px] leading-relaxed mb-6 min-h-[32px]">
                For teams who care about branding and automation.
              </p>
              
              <div className="flex items-baseline gap-1.5 mb-6 relative">
                <span className="text-5xl md:text-6xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter">
                  ${isYearly ? yearlyPrice : monthlyPrice}
                </span>
                <span className="text-zinc-400 font-bold text-xs leading-tight">
                  per<br/>{isYearly ? "year" : "month"}
                </span>
              </div>

              <div className="flex justify-start">
                {userEmail === "vunguyen5127@gmail.com" ? (
                  <button
                    onClick={handleUpgrade}
                    disabled={isLoading}
                    className="w-fit py-2.5 px-10 bg-blue-600 text-white rounded-[5px] font-black text-sm text-center hover:bg-blue-700 transition-all shadow-[0_5px_15px_-5px_rgba(37,99,235,0.4)] active:scale-[0.98] mb-6 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Subscribe</>}
                  </button>
                ) : (
                  <div className="mb-6 py-2.5 px-6 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded-[5px] text-xs font-bold uppercase tracking-wider">
                    Coming Soon
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <p className="text-zinc-900 dark:text-zinc-100 font-bold text-[13px]">This includes:</p>
                <ul className="space-y-3">
                   {[
                     "Everything in Free",
                     "10 Companies (Fair Use)",
                     "500 Invoices per month",
                     "No Advertising",
                     "Advanced Branding (Logo, Colors)",
                     "CSV/Excel Exporting",
                     "Priority Support"
                   ].map((item, i) => (
                     <li key={i} className={`flex items-start gap-3 text-[12px] leading-tight ${i < 3 ? 'text-zinc-900 dark:text-zinc-100 font-bold' : 'text-zinc-600 dark:text-zinc-400'}`}>
                       <div className="mt-0.5 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-sm border border-zinc-200/50 dark:border-white/5 flex-shrink-0">
                         <Check className="w-3 h-3 text-zinc-900 dark:text-zinc-100" strokeWidth={3} />
                       </div>
                       {item}
                     </li>
                   ))}
                </ul>
              </div>
           </div>
        </div>

        {/* Trust features */}
        <div className="mt-16 pt-10 border-t border-zinc-100 dark:border-zinc-900 flex flex-wrap justify-center gap-x-10 gap-y-5 text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
           <div className="flex items-center gap-2">
             <Shield className="w-4 h-4" />
             No hidden fees
           </div>
           <div className="flex items-center gap-2">
             <CreditCard className="w-4 h-4" />
             Secure payments
           </div>
           <div className="flex items-center gap-2">
             <Infinity className="w-4 h-4" />
             Cancel anytime
           </div>
        </div>
      </div>
    </div>
  );
}
