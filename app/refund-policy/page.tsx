import type { Metadata } from "next";
import { Shield, Sparkles, Calendar, Mail, FileCheck, RefreshCw, XCircle } from "lucide-react";
import { CopyEmailButton } from "@/components/copy-email-button";

export const metadata: Metadata = {
  title: "Refund Policy | Invoice-Quickly",
  description: "Our 7-day money-back guarantee and transparent refund policy for Invoice-Quickly Pro subscriptions. Your satisfaction is our priority.",
  alternates: { canonical: "https://invoice-quickly.com/refund-policy" },
  openGraph: {
    type: "website",
    title: "Refund Policy | Invoice-Quickly",
    description: "7-day money-back guarantee for Invoice-Quickly Pro. Transparent, no-questions-asked refund policy.",
    url: "https://invoice-quickly.com/refund-policy",
    siteName: "Invoice-Quickly",
  },
};

export default function RefundPolicyPage() {
  const email = "support@invoice-quickly.com";

  return (
    <div className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-screen">
      <main className="container mx-auto px-4 sm:px-8 pt-10 pb-20 sm:pt-16 sm:pb-20 max-w-4xl">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Shield className="w-3.5 h-3.5" />
            Trust & Transparency
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Refund Policy</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-2xl mx-auto">
            We believe in our product and want you to be 100% satisfied. 
            Here is how we handle refunds and cancellations.
          </p>
          <p className="text-zinc-400 dark:text-zinc-500 text-sm mt-6">Last updated: March 17, 2026</p>
        </div>

        <div className="space-y-6">
          
          {/* Main Guarantee Card */}
          <div className="relative overflow-hidden rounded-3xl border-2 border-blue-500/20 dark:border-blue-500/10 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-zinc-900 p-8 shadow-xl shadow-blue-500/5">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Sparkles className="w-24 h-24 text-blue-600" />
            </div>
            <div className="flex flex-col md:flex-row gap-6 items-start relative z-10">
              <div className="p-4 rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/30 text-white flex-shrink-0">
                <Shield className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-3">7-Day Money-Back Guarantee</h2>
                <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
                  We offer a <strong>risk-free 7-day money-back guarantee</strong> for all initial Pro subscription purchases. 
                  Our transactions are processed by <strong>Lemon Squeezy</strong> (Merchant of Record). All refund requests will be reviewed and processed via Lemon Squeezy's system to ensure security and transparency. If Invoice-Quickly doesn't meet your business needs within the first 7 days, we will provide a full refund — <strong>no questions asked.</strong>
                </p>
                <div className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
                   <FileCheck className="w-4 h-4" />
                   100% Risk-Free Trial
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Eligibility Card */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 transition-all hover:shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="font-bold">Eligibility</h3>
              </div>
              <ul className="space-y-3 text-sm text-zinc-500 dark:text-zinc-400">
                <li className="flex gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  Applies only to your first subscription payment.
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  Request must be received within 7 calendar days.
                </li>
                <li className="flex gap-2">
                  <span className="text-zinc-300 dark:text-zinc-700 font-bold">•</span>
                  Note: Renewals are non-refundable.
                </li>
              </ul>
            </div>

            {/* Cancellation Card */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 transition-all hover:shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 flex-shrink-0">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <h3 className="font-bold">Cancellation</h3>
              </div>
              <ul className="space-y-3 text-sm text-zinc-500 dark:text-zinc-400">
                <li className="flex gap-2">
                  <span className="text-orange-500 font-bold">•</span>
                  Cancel anytime via Account Settings.
                </li>
                <li className="flex gap-2">
                  <span className="text-orange-500 font-bold">•</span>
                  Pro features remain active until ends of period.
                </li>
                <li className="flex gap-2">
                  <span className="text-orange-500 font-bold">•</span>
                  Prevents all future automated renewals.
                </li>
              </ul>
            </div>
          </div>

          {/* Refund Process Card */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-8 transition-all hover:shadow-md">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                  <Mail className="w-6 h-6 text-blue-500" />
                  How to get your refund
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                  Simply email our support team with your account email address. We aim to process all approved refunds immediately. 
                  Funds typically arrive in your account within <strong>5–10 business days</strong>.
                </p>
                <CopyEmailButton email={email} />
              </div>
              <div className="w-full md:w-1/3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-6 border border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 mb-4 uppercase tracking-widest">
                  <XCircle className="w-3 h-3" /> Non-Refundable
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed italic">
                  &quot;Refunds are not available for renewal charges or for requests made after the 7-day guarantee window.&quot;
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Link */}
        <div className="mt-16 text-center">
          <p className="text-zinc-500 dark:text-zinc-400 italic text-sm">
            Questions? We&apos;re here to help you grow your business.
          </p>
        </div>
      </main>
    </div>
  );
}
