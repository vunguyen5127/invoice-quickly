"use server";

import { createClient } from "@supabase/supabase-js";
import { sendNewUserAlert } from "@/utils/email-service";

// Using service role key to bypass RLS and count logs
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function notifyAdminOnNewUser(userData: {
  id: string;
  email: string;
  name?: string;
  provider?: string;
}) {
  try {
    // Check how many login logs exist for this user
    console.log(`[auth-actions] Checking login logs for user ID: ${userData.id}`);
    const { count, error } = await supabaseAdmin
      .from("user_login_logs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userData.id);

    if (error) {
      console.error("[auth-actions] Error counting user login logs:", error);
      return { success: false, error: error.message };
    }

    console.log(`[auth-actions] Found ${count} logs for user ${userData.email}`);

    // If count is 1, it means this was the first login ever (or at least the first one logged)
    if (count === 1) {
      console.log(`[auth-actions] First login detected for ${userData.email}. Sending admin alert...`);
      const result = await sendNewUserAlert({
        email: userData.email,
        name: userData.name,
        provider: userData.provider,
      });
      console.log(`[auth-actions] Admin alert result:`, result);
      return result;
    }

    console.log(`[auth-actions] Not a new user (${count} logs), skipping notification.`);
    return { success: true, message: "Not a new user login." };
  } catch (err) {
    console.error("Failed to process new user notification:", err);
    return { success: false, error: "Internal server error" };
  }
}
