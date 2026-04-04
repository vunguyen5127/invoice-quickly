import { Session } from "@supabase/supabase-js";

let isLoggingInProgress = false;

export async function logUserLogin(providedSession?: Session | null) {
  if (isLoggingInProgress) return;
  isLoggingInProgress = true;

  try {
    if (!providedSession?.user) return;
    const user = providedSession.user;

    // Rate-limit: at most once every 12 hours per user per browser
    const cacheKey = `last_login_log_${user.id}`;
    const lastLog = localStorage.getItem(cacheKey);
    const now = Date.now();
    if (lastLog && now - parseInt(lastLog, 10) < 12 * 60 * 60 * 1000) return;

    const res = await fetch("/api/log-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId:      user.id,
        email:       user.email ?? "unknown",
        displayName: user.user_metadata?.full_name || user.user_metadata?.name || null,
        avatarUrl:   user.user_metadata?.avatar_url || null,
        provider:    user.app_metadata?.provider || "email",
        userAgent:   typeof navigator !== "undefined" ? navigator.userAgent : null,
      }),
    });

    if (res.ok) {
      localStorage.setItem(cacheKey, now.toString());

      const json = await res.json().catch(() => ({}));
      // Don't notify admin for tester accounts
      if (!json.skipped) {
        try {
          const { notifyAdminOnNewUser } = await import("@/utils/supabase/auth-actions");
          await notifyAdminOnNewUser({
            id:        user.id,
            email:     user.email ?? "unknown",
            name:      user.user_metadata?.full_name || user.user_metadata?.name || undefined,
            provider:  user.app_metadata?.provider || "email",
            createdAt: user.created_at,
          });
        } catch (notifyErr) {
          console.error("Failed to trigger new user notification:", notifyErr);
        }
      }
    } else {
      console.error("[login-logger] API error:", await res.text());
    }

  } catch (err) {
    console.error("Failed to log user login:", err);
  } finally {
    isLoggingInProgress = false;
  }
}



// NOTE: getLoginLogs has been moved to utils/supabase/admin-actions.ts
// It requires "use server" to access the service role key server-side.

