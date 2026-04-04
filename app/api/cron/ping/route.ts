import { getServiceSupabase } from "@/utils/supabase/client";
import { NextResponse } from "next/server";
import config from "@/utils/config";

export const dynamic = "force-dynamic";

/**
 * Lightweight cron job to keep Supabase project active.
 * Runs every 10 minutes via GitHub Actions.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  
  // SECURITY: Reject ALL requests if CRON_SECRET is not configured on the server.
  // This prevents the endpoint from being open when env var is accidentally missing.
  if (!config.cron.secret || authHeader !== `Bearer ${config.cron.secret}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const supabase = getServiceSupabase();

  if (!supabase) {
    return new NextResponse("Supabase configuration missing", { status: 500 });
  }

  try {
    // Perform a minimal query to keep the database active
    const { data, error } = await supabase.from("user_login_logs").select("id").limit(1);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "Supabase is awake",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[cron/ping] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
