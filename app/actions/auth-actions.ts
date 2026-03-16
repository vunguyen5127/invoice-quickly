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
  createdAt?: string;
}) {
  try {
    // Check how many login logs exist for this user
    console.log(`[auth-actions] Checking login logs for user: ${userData.email} (${userData.id})`);
    console.log(`[auth-actions] Account created at: ${userData.createdAt}`);
    
    const { count, error } = await supabaseAdmin
      .from("user_login_logs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userData.id);

    if (error) {
      console.error("[auth-actions] Error counting user login logs:", error);
      return { success: false, error: error.message };
    }

    console.log(`[auth-actions] Found ${count} logs for user ${userData.email}`);

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
        console.log(`[auth-actions] Account created ${Math.round(diffMinutes)}m ago with ${count} logs. Treating as new user.`);
        isNewUser = true;
      }
    }

    if (isNewUser) {
      console.log(`[auth-actions] New user login detected for ${userData.email}. Sending admin alert...`);
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
