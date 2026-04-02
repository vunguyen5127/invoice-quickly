"use server";

import { createClient } from "@supabase/supabase-js";
import { sendNewUserAlert } from "@/utils/email-service";

import config from "@/utils/config";

// Using service role key to bypass RLS and count logs
const supabaseAdmin = createClient(
  config.supabase.url,
  config.supabase.serviceRole
);

export async function notifyAdminOnNewUser(userData: {
  id: string;
  email: string;
  name?: string;
  provider?: string;
  createdAt?: string;
}) {
  try {
    const { count, error } = await supabaseAdmin
      .from("user_login_logs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userData.id);

    if (error) {
      console.error("[auth-actions] Error counting user login logs:", error);
      return { success: false, error: error.message };
    }

    // Robust logic: Identify as "new" if:
    // 1. It's the absolute first log (count === 1)
    // 2. OR count is low (<= 5) but the account was created very recently (within 15 minutes)
    // This handles race conditions where multiple logs might be created during the first redirect/mount.
    let isNewUser = count === 1;
    
    if (!isNewUser && count !== null && count <= 5 && userData.createdAt) {
      const createdTime = new Date(userData.createdAt).getTime();
      const now = Date.now();
      const diffMinutes = (now - createdTime) / (1000 * 60);
      
      if (diffMinutes < 15) {
        isNewUser = true;
      }
    }

    if (isNewUser) {
      const result = await sendNewUserAlert({
        email: userData.email,
        name: userData.name,
        provider: userData.provider,
      });
      return result;
    }

    return { success: true, message: "Not a new user login." };
  } catch (err) {
    console.error("Failed to process new user notification:", err);
    return { success: false, error: "Internal server error" };
  }
}
