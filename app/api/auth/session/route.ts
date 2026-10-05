import { NextResponse } from "next/server";
import { isAuthenticatedRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const authenticated = await isAuthenticatedRequest(req);
  return NextResponse.json({ authenticated });
}
