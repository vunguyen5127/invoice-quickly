"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { getLoginLogs } from "@/utils/login-logger";
import { format } from "date-fns";
import { Loader2, ShieldCheck, ChevronLeft, ChevronRight, Monitor, Globe, Play, CheckCircle2, AlertCircle } from "lucide-react";
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

export default function AdminPage() {
  const [logs, setLogs] = useState<LoginLog[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [cronRunning, setCronRunning] = useState(false);
  const [testEmailLoading, setTestEmailLoading] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [cronStatus, setCronStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAccess = async () => {
      if (!supabase) return;

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login?redirect=/admin");
        return;
      }

      if (session.user.email !== ADMIN_EMAIL) {
        router.push("/dashboard");
        return;
      }

      setAuthorized(true);
    };

    checkAccess();
  }, [router]);

  useEffect(() => {
    if (!authorized) return;

    const fetchLogs = async () => {
      setLoading(true);
      const { logs: data, total: count } = await getLoginLogs(currentPage, PAGE_SIZE);
      setLogs(data);
      setTotal(count);
      setLoading(false);
    };

    fetchLogs();
  }, [authorized, currentPage]);

  const handleRunCron = async () => {
    if (cronRunning) return;
    
    setCronRunning(true);
    setCronStatus(null);
    try {
      const result = await triggerInvoiceCheckCron();
      if (result.success) {
        setCronStatus({
          type: "success",
          message: `Cron success: Sent ${result.data?.usersNotified} emails, found ${result.data?.invoicesFound} invoices.`
        });
      } else {
        setCronStatus({
          type: "error",
          message: `Cron failed: ${result.error}`
        });
      }
    } catch (err: any) {
      setCronStatus({
        type: "error",
        message: `Error: ${err.message}`
      });
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
        setCronStatus({
          type: "success",
          message: `Test email sent successfully to ${testEmail}!`
        });
      } else {
        setCronStatus({
          type: "error",
          message: `Test email failed: ${result.error}`
        });
      }
    } catch (err: any) {
      setCronStatus({
        type: "error",
        message: `Error: ${err.message}`
      });
    } finally {
      setTestEmailLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  if (!authorized) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-8 py-10 max-w-6xl">
      <div className="mb-10 flex items-center gap-5">
        <Link 
          href="/dashboard"
          className="p-2.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all shadow-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Admin Panel</h1>
            <p className="text-sm text-zinc-500 font-medium leading-none pt-0.5">User Login Activity</p>
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
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all
              ${cronRunning 
                ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed" 
                : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 active:scale-[0.98] animate-in fade-in slide-in-from-right-2"
              }
            `}
          >
            {cronRunning ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4 fill-current" />
            )}
            {cronRunning ? "Running..." : "Run Invoice Cron"}
          </button>
        </div>
      </div>

      {/* Cron Status Message */}
      {cronStatus && (
        <div className={`
          mb-6 p-4 rounded-xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-2
          ${cronStatus.type === "success" 
            ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-400" 
            : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-400"
          }
        `}>
          {cronStatus.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <p className="text-sm font-medium">{cronStatus.message}</p>
          <button 
            onClick={() => setCronStatus(null)}
            className="ml-auto text-xs font-bold uppercase tracking-wider opacity-60 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
          <p className="text-sm text-zinc-500 mb-1">Total Logins</p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{total}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
          <p className="text-sm text-zinc-500 mb-1">Unique Users</p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {new Set(logs.map(l => l.user_id)).size}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
          <p className="text-sm text-zinc-500 mb-1">Today&apos;s Logins</p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {logs.filter(l => new Date(l.logged_in_at).toDateString() === new Date().toDateString()).length}
          </p>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
            Login Logs
            <span className="ml-2 text-sm font-normal text-zinc-400">({total})</span>
          </h2>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-zinc-500">No login logs found.</p>
          </div>
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
                            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-500 dark:text-zinc-400">
                              {(log.display_name || log.email)?.[0]?.toUpperCase()}
                            </div>
                          )}
                          <span className="font-medium text-zinc-900 dark:text-zinc-100">
                            {log.display_name || "—"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-zinc-500">{log.email}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 capitalize">
                          <Globe className="w-3 h-3" />
                          {log.provider || "email"}
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-between">
                <p className="text-sm text-zinc-500">
                  Showing {((currentPage - 1) * PAGE_SIZE) + 1}–{Math.min(currentPage * PAGE_SIZE, total)} of {total}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 dark:hover:text-zinc-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page: number;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-lg text-sm font-bold transition-all duration-200 ${
                          currentPage === page
                            ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 active:scale-[0.98]"
                            : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 dark:hover:text-zinc-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
