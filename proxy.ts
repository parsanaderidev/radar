import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { validateSessionToken } from "./lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /settings and its subpaths
  if (pathname.startsWith("/settings")) {
    const sessionCookie = request.cookies.get("radar_session")?.value;
    const isValid = await validateSessionToken(sessionCookie);

    if (!isValid) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/settings/:path*"],
};
