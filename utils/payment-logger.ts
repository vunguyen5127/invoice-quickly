/**
 * Payment Logger — writes structured logs to the `payment_logs` table.
 * Console output is synchronous; DB writes are fire-and-forget (non-blocking).
 */
import { getServiceSupabase } from "@/utils/supabase/client";

type LogLevel = "info" | "error" | "warn";

interface LogPayload {
  requestId?: string;
  tag: string;
  message: string;
  data?: Record<string, unknown>;
  userId?: string;
  eventName?: string;
  subscriptionId?: string;
}

function writeLog(level: LogLevel, payload: LogPayload) {
  const ts = new Date().toISOString();
  const prefix = `[${ts}] [${payload.tag}]${payload.requestId ? ` [${payload.requestId}]` : ""}`;

  // 1. Console is synchronous — zero latency for the caller
  if (level === "error") {
    console.error(`${prefix} ❌ ${payload.message}`, payload.data ? JSON.stringify(payload.data) : "");
  } else {
    console.log(`${prefix} ${payload.message}`, payload.data ? JSON.stringify(payload.data) : "");
  }

  // 2. DB write is fire-and-forget — does NOT block the caller
  const supabase = getServiceSupabase();
  if (supabase) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase.from("payment_logs") as any).insert({
      request_id:      payload.requestId ?? null,
      level,
      tag:             payload.tag,
      message:         payload.message,
      data:            payload.data ?? null,
      user_id:         payload.userId ?? null,
      event_name:      payload.eventName ?? null,
      subscription_id: payload.subscriptionId ?? null,
    }).then(({ error }: { error: { message: string } | null }) => {
      if (error) {
        console.error("[PaymentLogger] DB write failed:", error.message);
      }
    });
  }
}

export const paymentLogger = {
  info:  (payload: LogPayload) => writeLog("info",  payload),
  warn:  (payload: LogPayload) => writeLog("warn",  payload),
  error: (payload: LogPayload) => writeLog("error", payload),
};
