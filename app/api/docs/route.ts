import { getApiDocs } from "@/lib/swagger";
import { NextRequest, NextResponse } from "next/server";
import config from "@/utils/config";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (!config.cron.secret || authHeader !== `Bearer ${config.cron.secret}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const spec = await getApiDocs();
  return NextResponse.json(spec);
}
