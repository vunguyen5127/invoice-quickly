"use client";

import React, { useEffect, useState, useRef } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2, User, Globe, Moon, Sun, Monitor, Bell, Shield, LogOut, Crown, CreditCard, Calendar, ChevronLeft, ShieldCheck, Zap, Settings } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { ThemeSelector } from "@/components/theme-toggle";
import { languages } from "@/components/language-toggle";
import Link from "next/link";
import { getUserSubscription, cancelSubscription, resumeSubscription } from "@/utils/supabase/settings-actions";
import { Subscription } from "@/types/subscription";
import { format } from "date-fns";
import { ConfirmModal } from "@/components/confirm-modal";
import { SettingsSkeleton } from "@/components/settings-skeleton";

export default function SettingsPage() {
  const { t, lang, setLang } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isResuming, setIsResuming] = useState(false);
  const router = useRouter();

  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    
    const checkUser = async () => {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login?redirect=/dashboard/settings");
        return;
      }
      setUser(session.user);
      
      const sub = await getUserSubscription(session.access_token);
      setSubscription(sub);
      
      setLoading(false);
    };
    checkUser();
  }, [router]);

  const handleCancelSubscription = async () => {
    if (!subscription?.subscription_id) return;
    
    setIsCancelling(true);
    const { data: { session } } = await supabase?.auth.getSession() || { data: { session: null }};
    
    if (session) {
      const subId = subscription.subscription_id || '';
      const result = await cancelSubscription(session.access_token, subId);
      if ("success" in result) {
        // Refresh subscription data
        const sub = await getUserSubscription(session.access_token);
        setSubscription(sub);
        setIsCancelModalOpen(false);
        router.refresh(); // Ensure layout-level data is also fresh
      } else {
        alert(result.error);
      }
    }
    setIsCancelling(false);
  };

  const handleResumeSubscription = async () => {
    if (!subscription?.subscription_id) return;
    
    setIsResuming(true);
    const { data: { session } } = await supabase?.auth.getSession() || { data: { session: null }};
    
    if (session) {
      const subId = subscription.subscription_id || '';
      const result = await resumeSubscription(session.access_token, subId);
      if ("success" in result) {
        // Refresh subscription data
        const sub = await getUserSubscription(session.access_token);
        setSubscription(sub);
        router.refresh(); // Ensure layout-level data is also fresh
      } else {
        alert(result.error);
      }
    }
    setIsResuming(false);
  };

  if (loading) {
    return <SettingsSkeleton />;
  }

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    router.push("/");
  };

  const sectionClass = "bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm shadow-zinc-200/50 dark:shadow-none mb-6";
  const headerClass = "px-6 py-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-100 bg-zinc-50/30 dark:bg-zinc-900/30";
  const itemClass = "px-6 py-3 flex items-center justify-between border-b last:border-0 border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors";

  return (
    <div className="container mx-auto px-4 sm:px-8 py-8 max-w-2xl">
      <div className="mb-8 flex items-center gap-4">
        <Link 
          href="/dashboard"
          className="p-2 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors shadow-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{t.settings}</h1>
          <p className="text-zinc-500 mt-1">{t.accountSettings}</p>
        </div>
      </div>

      {/* Profile Section */}
      <div className={sectionClass}>
        <div className={headerClass}>
          <User className="w-4 h-4 text-blue-500" />
          {t.profile || "Profile"}
        </div>
        <div className="p-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center bg-pink-500 text-white border-2 border-white dark:border-zinc-800 text-2xl font-black shadow-lg">
            {(() => {
              const name = user?.user_metadata?.full_name || user?.user_metadata?.name || "";
              if (name) {
                const parts = name.split(" ");
                if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
                return name.slice(0, 2).toUpperCase();
              }
              return (user?.email?.[0] || "U").toUpperCase();
            })()}
          </div>
          <div>
            <p className="font-bold text-lg text-zinc-900 dark:text-zinc-100">{user?.user_metadata?.name || user?.user_metadata?.full_name || user?.email?.split('@')[0]}</p>
            <p className="text-zinc-500 text-sm">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Subscription Section */}
      <div className={sectionClass}>
        <div className={headerClass}>
          <Crown className="w-4 h-4 text-yellow-500" />
          {t.subscriptionPlan || "Subscription"}
        </div>
        <div className={itemClass}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
               <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{t.currentPlan || "Current Plan"}</p>
              <p className="text-xs text-zinc-500 capitalize">{(subscription?.plan === 'free' ? (t.freePlan || "Free") : subscription?.plan === 'pro' ? (t.proPlan || "Pro") : (subscription?.plan || "Free"))} {t.plan || "Plan"}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            {(!subscription || subscription.plan === 'free') ? (
              <Link
                href="/pricing"
                className="px-3 py-1.5 rounded-lg bg-blue-600 text-[11px] font-bold text-white hover:bg-blue-500 active:bg-blue-700 transition-all shadow-sm shadow-blue-600/20 flex items-center gap-1.5"
              >
                <Zap className="w-3 h-3" />
                {t.upgrade || "Upgrade"}
              </Link>
            ) : (
              <>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                  subscription?.status === 'active' 
                    ? (subscription.cancel_at ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 ring-1 ring-amber-200/50 dark:ring-amber-800/50" : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-200/50 dark:ring-emerald-800/50")
                    : subscription?.status === 'canceled'
                    ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 ring-1 ring-amber-200/50 dark:ring-amber-800/50"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 ring-1 ring-zinc-200 dark:ring-zinc-700"
                }`}>
                  {subscription?.status === 'active' && subscription.cancel_at ? (t.cancelsSoon || "Cancels Soon") : (subscription?.status || (t.freePlan || "Free"))}
                </span>

              </>
            )}
          </div>
        </div>

        {subscription?.plan === 'pro' && (
          <>
            <div className={itemClass}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                   <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                    {(subscription.status === 'canceled' || subscription.cancel_at) ? (t.billingExpiresOn || "Expires on") : (t.billingRenewsOn || "Renews on")}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {(subscription.cancel_at || subscription.next_billed_at || subscription.current_period_end) 
                      ? format(new Date(subscription.cancel_at || subscription.next_billed_at || subscription.current_period_end!), "MMMM dd, yyyy") 
                      : (t.nA || "N/A")}
                  </p>
                </div>
              </div>

              {/* Styled Action Buttons */}
          {subscription.status === 'active' && !subscription.cancel_at && (
            <button 
              onClick={() => setIsCancelModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/30 text-[11px] font-bold text-red-500 hover:bg-red-100 dark:hover:bg-red-950/50 transition-all border border-red-100 dark:border-red-900/30 uppercase tracking-wider"
            >
              {t.cancel || "Cancel"}
            </button>
          )}

          {((subscription.status === 'active' && subscription.cancel_at) || subscription.status === 'canceled') && (
            <button 
              onClick={handleResumeSubscription}
              disabled={isResuming}
              className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-[11px] font-bold text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-all border border-blue-100 dark:border-blue-900/30 uppercase tracking-wider flex items-center gap-1.5"
            >
              {isResuming ? <Loader2 className="w-3 h-3 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
              {t.resumeAction || "Resume"}
            </button>
          )}
            </div>
          </>
        )}
        

      </div>

      {/* Appearance & Language */}
      <div className={sectionClass}>
        <div className={headerClass}>
          <Monitor className="w-4 h-4 text-emerald-500" />
           {t.settings_preferences || "Preferences"}
        </div>
        <div className={itemClass}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
               <Globe className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{t.language || "Language"}</p>
              <p className="text-xs text-zinc-500">{t.language_preference_desc || "Choose your preferred display language"}</p>
            </div>
          </div>
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value as any)}
            className="text-sm font-bold text-blue-600 bg-transparent border-none focus:ring-0 cursor-pointer outline-none"
          >
            {languages.map(l => (
              <option key={l.code} value={l.code}>{l.name}</option>
            ))}
          </select>
        </div>
        <div className={itemClass}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
               <Sun className="w-4 h-4 dark:hidden" />
               <Moon className="w-4 h-4 hidden dark:block" />
            </div>
            <div>
              <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{t.theme || "Theme"}</p>
              <p className="text-xs text-zinc-500">{t.theme_desc || "Switch between light and dark mode"}</p>
            </div>
          </div>
          <ThemeSelector />
        </div>
      </div>

      {/* Account Preferences */}
      <div className={sectionClass}>
        <div className={headerClass}>
          <Settings className="w-4 h-4 text-blue-500" />
          {t.settings_preferences || "Preferences"}
        </div>
        <div className={itemClass}>
           <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
               <Bell className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{t.notifications || "Notifications"}</p>
              <p className="text-xs text-zinc-500">{t.notifications_desc || "Manage your email notifications"}</p>
            </div>
          </div>
          <div className="w-10 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full cursor-not-allowed opacity-40 relative shrink-0">
             <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all"></div>
          </div>
        </div>
        
        {user?.email === "vunguyencapital@gmail.com" && (
          <Link href="/admin" className={itemClass}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-sm text-indigo-900 dark:text-indigo-100">{t.admin_panel || "Admin Panel"}</p>
                <p className="text-xs text-indigo-700/70 dark:text-indigo-400/70">{t.admin_panel_desc || "View system login logs and statistics"}</p>
              </div>
            </div>
            <ChevronLeft className="w-4 h-4 text-zinc-400 rotate-180" />
          </Link>
        )}
        <button 
          onClick={handleLogout}
          className="w-full px-6 py-4 flex items-center gap-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors border-t border-zinc-50 dark:border-zinc-800/50"
        >
          <LogOut className="w-4 h-4" />
          <span className="font-semibold text-sm">{t.sign_out || "Sign Out"}</span>
        </button>
      </div>

      <ConfirmModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancelSubscription}
        isProcessing={isCancelling}
        title={t.cancel_subscription || "Cancel Subscription"}
        message={t.cancel_subscription_confirm || "Are you sure you want to cancel your subscription? You will lose access to Pro features at the end of your current billing period."}
        confirmText={t.cancel_subscription || "Cancel Subscription"}
      />
    </div>
  );
}
