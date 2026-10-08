import { NextResponse } from "next/server";
import { formatSessionClearCookie, formatOnboardedClearCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "خروج با موفقیت انجام شد." });
  response.headers.append("Set-Cookie", formatSessionClearCookie());
  response.headers.append("Set-Cookie", formatOnboardedClearCookie());
  return response;
}
