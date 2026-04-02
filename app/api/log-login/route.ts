import { NextRequest, NextResponse } from "next/server";
import { isTester } from "@/utils/tester";
import { getServiceSupabase } from "@/utils/supabase/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, email, displayName, avatarUrl, provider, userAgent } = body;

    if (!userId || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Skip if userId is not a valid UUID (e.g. test/mock users in E2E tests)
    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!UUID_REGEX.test(userId)) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    // Skip logging entirely for tester accounts
    if (isTester(email)) {
      return NextResponse.json({ ok: true, skipped: true });
    }


    // Extract IP — Vercel sets x-forwarded-for; fallback to x-real-ip
    const forwarded = request.headers.get("x-forwarded-for");
    const ipAddress = forwarded ? forwarded.split(",")[0].trim() : (request.headers.get("x-real-ip") ?? null);

    // Vercel injects geo headers automatically on Edge/Serverless
    const country = request.headers.get("x-vercel-ip-country") ?? null;

    const supabase = getServiceSupabase();
    if (!supabase) {
      return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("user_login_logs") as any).insert({
      user_id:      userId,
      email,
      display_name: displayName ?? null,
      avatar_url:   avatarUrl ?? null,
      provider:     provider ?? "email",
      user_agent:   userAgent ?? null,
      ip_address:   ipAddress,
      country,
    });

    if (error) {
      console.error("[log-login] DB insert error:", error.message);
      return NextResponse.json({ error: "DB insert failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[log-login] Unexpected error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
