import { supabase } from "@/utils/supabase/client";

export async function logUserLogin() {
  if (!supabase) return;

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const user = session.user;
    
    // Prevent spamming the db on every page load using localStorage
    const cacheKey = `last_login_log_${user.id}`;
    const lastLog = localStorage.getItem(cacheKey);
    const now = Date.now();
    
    // Log at most once every 12 hours per user per browser
    if (lastLog && now - parseInt(lastLog, 10) < 12 * 60 * 60 * 1000) {
      return; 
    }

    const { error } = await supabase.from("user_login_logs").insert({
      user_id: user.id,
      email: user.email || "unknown",
      display_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
      avatar_url: user.user_metadata?.avatar_url || null,
      provider: user.app_metadata?.provider || "email",
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
    });

    if (error) {
      console.error("Supabase insert log error:", error);
    } else {
      console.log("Recorded login for user:", user.email);
      localStorage.setItem(cacheKey, now.toString());

      // Notify admin if it's a new user (first login log)
      try {
        const { notifyAdminOnNewUser } = await import("@/app/actions/auth-actions");
        await notifyAdminOnNewUser({
          id: user.id,
          email: user.email || "unknown",
          name: user.user_metadata?.full_name || user.user_metadata?.name || undefined,
          provider: user.app_metadata?.provider || "email",
        });
      } catch (notifyErr) {
        console.error("Failed to trigger new user notification:", notifyErr);
      }
    }
  } catch (err) {
    console.error("Failed to log user login:", err);
  }
}


export async function getLoginLogs(page = 1, pageSize = 50) {
  if (!supabase) return { logs: [], total: 0 };

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("user_login_logs")
    .select("*", { count: "exact" })
    .order("logged_in_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching login logs:", error);
    return { logs: [], total: 0 };
  }

  return { logs: data || [], total: count || 0 };
}
