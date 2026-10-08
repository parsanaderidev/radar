import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await getAuthSession(req);
  return NextResponse.json({
    authenticated: session.isAuthenticated,
    user: session.user,
    isAdmin: session.isAdmin,
    isOnboarded: session.isOnboarded,
  });
}
