import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

/**
 * @openapi
 * /api/cron/keep-alive:
 *   get:
 *     summary: Ping Supabase to keep the project active
 *     description: This endpoint is called by a cron job to prevent the Supabase project from going into hibernation.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully pinged Supabase
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 latestLogAt:
 *                   type: string
 *                 totalLogs:
 *                   type: integer
 *       401:
 *         description: Unauthorized - missing or invalid CRON_SECRET
 *       500:
 *         description: Internal Server Error - Supabase configuration missing or other error
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return new NextResponse('Supabase configuration missing', { status: 500 });
  }

  // Use service role key to bypass RLS and "get Login Logs" as requested
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  try {
    const { data, error, count } = await supabase
      .from('user_login_logs')
      .select('*', { count: 'exact', head: false })
      .order('logged_in_at', { ascending: false })
      .limit(1);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "Supabase pinged successfully",
      latestLogAt: data?.[0]?.logged_in_at || "No logs found",
      totalLogs: count
    });
  } catch (error: any) {
    console.error("Cron job error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
