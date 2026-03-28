"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { getLoginLogs } from "@/utils/login-logger";
import { getPaymentLogs } from "./actions";
import { format } from "date-fns";
import {
  Loader2, ShieldCheck, ChevronLeft, ChevronRight,
  Monitor, Globe, Play, CheckCircle2, AlertCircle,
  CreditCard, Users,
} from "lucide-react";
import Link from "next/link";
import { triggerInvoiceCheckCron, triggerTestEmail } from "./actions";

const ADMIN_EMAIL = "vunguyencapital@gmail.com";
const PAGE_SIZE = 20;

interface LoginLog {
  id: string;
  user_id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  provider: string | null;
  user_agent: string | null;
  logged_in_at: string;
}

interface PaymentLog {
  id: string;
  created_at: string;
  request_id: string | null;
  level: "info" | "error" | "warn";
  tag: string | null;
  message: string;
  data: Record<string, unknown> | null;
  user_id: string | null;
  event_name: string | null;
  subscription_id: string | null;
}

function parseBrowser(ua: string | null): string {
  if (!ua) return "Unknown";
  if (ua.includes("Chrome") && !ua.includes("Edg")) return "Chrome";
  if (ua.includes("Edg")) return "Edge";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
  return "Other";
}

function parseOS(ua: string | null): string {
  if (!ua) return "Unknown";
  if (ua.includes("Windows")) return "Windows";
  if (ua.includes("Mac")) return "macOS";
  if (ua.includes("Linux")) return "Linux";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
  return "Other";
}

function LevelBadge({ level }: { level: PaymentLog["level"] }) {
  const styles = {
    info:  "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    error: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    warn:  "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  };
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold uppercase ${styles[level]}`}>
      {level}
    </span>
  );
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"logins" | "payment-logs">("logins");

  // Login logs state
  const [logs, setLogs] = useState<LoginLog[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Payment logs state
  const [paymentLogs, setPaymentLogs] = useState<PaymentLog[]>([]);
  const [paymentTotal, setPaymentTotal] = useState(0);
  const [paymentPage, setPaymentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [cronRunning, setCronRunning] = useState(false);
  const [testEmailLoading, setTestEmailLoading] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [cronStatus, setCronStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAccess = async () => {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/login?redirect=/admin"); return; }
      if (session.user.email !== ADMIN_EMAIL) { router.push("/dashboard"); return; }
      setAuthorized(true);
    };
    checkAccess();
  }, [router]);

  // Load login logs
  useEffect(() => {
    if (!authorized || activeTab !== "logins") return;
    const fetch = async () => {
      setLoading(true);
      const { logs: data, total: count } = await getLoginLogs(currentPage, PAGE_SIZE);
      setLogs(data);
      setTotal(count);
      setLoading(false);
    };
    fetch();
  }, [authorized, activeTab, currentPage]);

  // Load payment logs
  useEffect(() => {
    if (!authorized || activeTab !== "payment-logs") return;
    const fetch = async () => {
      setPaymentLoading(true);
      const { logs: data, total: count } = await getPaymentLogs(paymentPage, PAGE_SIZE);
      setPaymentLogs(data as PaymentLog[]);
      setPaymentTotal(count);
      setPaymentLoading(false);
    };
    fetch();
  }, [authorized, activeTab, paymentPage]);

  const handleRunCron = async () => {
    if (cronRunning) return;
    setCronRunning(true);
    setCronStatus(null);
    try {
      const result = await triggerInvoiceCheckCron();
      if (result.success) {
        setCronStatus({ type: "success", message: `Cron success: Sent ${result.data?.usersNotified} emails, found ${result.data?.invoicesFound} invoices.` });
      } else {
        setCronStatus({ type: "error", message: `Cron failed: ${result.error}` });
      }
    } catch (err: any) {
      setCronStatus({ type: "error", message: `Error: ${err.message}` });
    } finally {
      setCronRunning(false);
    }
  };

  const handleTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (testEmailLoading || !testEmail) return;
    setTestEmailLoading(true);
    setCronStatus(null);
    try {
      const result = await triggerTestEmail(testEmail);
      if (result.success) {
        setCronStatus({ type: "success", message: `Test email sent to ${testEmail}!` });
      } else {
        setCronStatus({ type: "error", message: `Test email failed: ${result.error}` });
      }
    } catch (err: any) {
      setCronStatus({ type: "error", message: `Error: ${err.message}` });
    } finally {
      setTestEmailLoading(false);
    }
  };

  const toggleRow = (id: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const loginTotalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const paymentTotalPages = Math.max(1, Math.ceil(paymentTotal / PAGE_SIZE));

  if (!authorized) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-8 py-10 max-w-7xl">
      {/* Header */}
      <div className="mb-8 flex items-center gap-5">
        <Link
          href="/dashboard"
          className="p-2.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all shadow-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Admin Panel</h1>
            <p className="text-sm text-zinc-500 font-medium leading-none pt-0.5">Internal tools & logs</p>
          </div>
        </div>

        <form onSubmit={handleTestEmail} className="flex items-center gap-2">
          <input
            type="email"
            placeholder="Test email..."
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-zinc-400"
            required
          />
          <button
            type="submit"
            disabled={testEmailLoading}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {testEmailLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Test Email"}
          </button>
        </form>

        <button
          onClick={handleRunCron}
          disabled={cronRunning}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            cronRunning
              ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
              : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
          }`}
        >
          {cronRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
          {cronRunning ? "Running..." : "Run Invoice Cron"}
        </button>
      </div>

      {/* Cron Status */}
      {cronStatus && (
        <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
          cronStatus.type === "success"
            ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-400"
            : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-400"
        }`}>
          {cronStatus.type === "success" ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          <p className="text-sm font-medium">{cronStatus.message}</p>
          <button onClick={() => setCronStatus(null)} className="ml-auto text-xs font-bold uppercase tracking-wider opacity-60 hover:opacity-100">Dismiss</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-zinc-200 dark:border-zinc-800 mb-6">
        <button
          onClick={() => setActiveTab("logins")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 transition-colors -mb-px ${
            activeTab === "logins"
              ? "border-blue-500 text-blue-600 dark:text-blue-400"
              : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          <Users className="w-4 h-4" />
          Login Logs
          <span className="ml-1 text-xs font-normal text-zinc-400">({total})</span>
        </button>
        <button
          onClick={() => setActiveTab("payment-logs")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 transition-colors -mb-px ${
            activeTab === "payment-logs"
              ? "border-blue-500 text-blue-600 dark:text-blue-400"
              : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Payment Logs
          <span className="ml-1 text-xs font-normal text-zinc-400">({paymentTotal})</span>
        </button>
      </div>

      {/* ── LOGIN LOGS TAB ── */}
      {activeTab === "logins" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
              <p className="text-sm text-zinc-500 mb-1">Total Logins</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{total}</p>
            </div>
            <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
              <p className="text-sm text-zinc-500 mb-1">Unique Users</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{new Set(logs.map(l => l.user_id)).size}</p>
            </div>
            <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
              <p className="text-sm text-zinc-500 mb-1">Today&apos;s Logins</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {logs.filter(l => new Date(l.logged_in_at).toDateString() === new Date().toDateString()).length}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
              <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Login Logs</h2>
            </div>
            {loading ? (
              <div className="p-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>
            ) : logs.length === 0 ? (
              <div className="p-12 text-center"><p className="text-zinc-500">No login logs found.</p></div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-white dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400">
                      <tr>
                        <th className="px-6 py-4 font-medium">User</th>
                        <th className="px-6 py-4 font-medium">Email</th>
                        <th className="px-6 py-4 font-medium">Provider</th>
                        <th className="px-6 py-4 font-medium">Browser / OS</th>
                        <th className="px-6 py-4 font-medium">Login Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900/10">
                      {logs.map((log) => (
                        <tr key={log.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {log.avatar_url ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img src={log.avatar_url} alt="" className="w-8 h-8 rounded-full" />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-500">
                                  {(log.display_name || log.email)?.[0]?.toUpperCase()}
                                </div>
                              )}
                              <span className="font-medium text-zinc-900 dark:text-zinc-100">{log.display_name || "—"}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-zinc-500">{log.email}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 capitalize">
                              <Globe className="w-3 h-3" />{log.provider || "email"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5 text-zinc-500">
                              <Monitor className="w-3.5 h-3.5" />
                              {parseBrowser(log.user_agent)} / {parseOS(log.user_agent)}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-zinc-500">
                            {format(new Date(log.logged_in_at), "MMM dd, yyyy HH:mm:ss")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {loginTotalPages > 1 && (
                  <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-between">
                    <p className="text-sm text-zinc-500">
                      Showing {((currentPage - 1) * PAGE_SIZE) + 1}–{Math.min(currentPage * PAGE_SIZE, total)} of {total}
                    </p>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button onClick={() => setCurrentPage(Math.min(loginTotalPages, currentPage + 1))} disabled={currentPage === loginTotalPages} className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}

      {/* ── PAYMENT LOGS TAB ── */}
      {activeTab === "payment-logs" && (
        <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-between">
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
              Payment Logs
              <span className="ml-2 text-sm font-normal text-zinc-400">({paymentTotal})</span>
            </h2>
            <button
              onClick={() => { setPaymentPage(1); setPaymentLogs([]); setActiveTab("logins"); setTimeout(() => setActiveTab("payment-logs"), 0); }}
              className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
            >
              Refresh
            </button>
          </div>

          {paymentLoading ? (
            <div className="p-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>
          ) : paymentLogs.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-zinc-500">No payment logs yet.</p>
              <p className="text-xs text-zinc-400 mt-1">Logs appear here after billing events are processed.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 whitespace-nowrap">
                    <tr>
                      <th className="px-4 py-3 font-medium">Time</th>
                      <th className="px-4 py-3 font-medium">Level</th>
                      <th className="px-4 py-3 font-medium">Tag</th>
                      <th className="px-4 py-3 font-medium">Event</th>
                      <th className="px-4 py-3 font-medium">Message</th>
                      <th className="px-4 py-3 font-medium">Sub ID</th>
                      <th className="px-4 py-3 font-medium">User ID</th>
                      <th className="px-4 py-3 font-medium">Req ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300">
                    {paymentLogs.map((log) => (
                      <React.Fragment key={log.id}>
                        <tr
                          className={`hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors ${log.data ? "cursor-pointer" : ""}`}
                          onClick={() => log.data && toggleRow(log.id)}
                        >
                          <td className="px-4 py-3 text-xs text-zinc-400 whitespace-nowrap">
                            {format(new Date(log.created_at), "MM/dd HH:mm:ss")}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <LevelBadge level={log.level} />
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-zinc-500 whitespace-nowrap">{log.tag}</td>
                          <td className="px-4 py-3 text-xs text-zinc-400 whitespace-nowrap">{log.event_name ?? "—"}</td>
                          <td className="px-4 py-3 text-sm max-w-xs truncate">{log.message}</td>
                          <td className="px-4 py-3 font-mono text-xs text-zinc-400 whitespace-nowrap">
                            {log.subscription_id ? log.subscription_id.slice(0, 10) + "…" : "—"}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-zinc-400 whitespace-nowrap">
                            {log.user_id ? log.user_id.slice(0, 8) + "…" : "—"}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-zinc-400 whitespace-nowrap">{log.request_id ?? "—"}</td>
                        </tr>
                        {expandedRows.has(log.id) && log.data && (
                          <tr className="bg-zinc-50 dark:bg-zinc-800/30">
                            <td colSpan={8} className="px-6 py-3">
                              <pre className="text-xs text-zinc-600 dark:text-zinc-400 overflow-x-auto whitespace-pre-wrap break-all">
                                {JSON.stringify(log.data, null, 2)}
                              </pre>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              {paymentTotalPages > 1 && (
                <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-between">
                  <p className="text-sm text-zinc-500">
                    Showing {((paymentPage - 1) * PAGE_SIZE) + 1}–{Math.min(paymentPage * PAGE_SIZE, paymentTotal)} of {paymentTotal}
                  </p>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setPaymentPage(Math.max(1, paymentPage - 1))} disabled={paymentPage === 1} className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button onClick={() => setPaymentPage(Math.min(paymentTotalPages, paymentPage + 1))} disabled={paymentPage === paymentTotalPages} className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
