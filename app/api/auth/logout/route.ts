import { NextResponse } from "next/server";
import { formatSessionClearCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "خروج با موفقیت انجام شد." });
  response.cookies.delete("radar_session");
  response.headers.set("Set-Cookie", formatSessionClearCookie());
  return response;
}
