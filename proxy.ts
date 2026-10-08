import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "radar_session";
const ONBOARDED_COOKIE_NAME = "radar_onboarded";

/**
 * Lightweight Base64URL JWT payload parser for Edge runtime. Zero external dependencies.
 */
function parseEdgeJwtPayload(token: string): { exp?: number; id?: string } | null {
  try {
    if (!token || typeof token !== "string") return null;
    const parts = token.split(".");
    if (parts.length < 2) return null;
    let base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, (m) => m.charCodeAt(0));
    const decoder = new TextDecoder("utf-8");
    return JSON.parse(decoder.decode(bytes));
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip static assets, Next.js internal bundles, public icons, and webhook APIs
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/ingest") ||
    pathname.startsWith("/api/auth") ||
    pathname === "/icon.svg" ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const onboardedCookie = request.cookies.get(ONBOARDED_COOKIE_NAME)?.value;

  let isAuthenticated = false;
  let isAdmin = false;

  if (sessionCookie) {
    // Check if PocketBase JWT token
    const payload = parseEdgeJwtPayload(sessionCookie);
    if (payload && payload.exp && payload.exp * 1000 > Date.now()) {
      isAuthenticated = true;
    } else {
      // Check if Admin HMAC token (timestamp.sigHex)
      const parts = sessionCookie.split(".");
      if (parts.length === 2) {
        const timestamp = parseInt(parts[0], 10);
        if (!isNaN(timestamp) && Date.now() - timestamp < 30 * 24 * 60 * 60 * 1000) {
          isAuthenticated = true;
          isAdmin = true;
        }
      }
    }
  }

  const isOnboarded = isAdmin || onboardedCookie === "1" || onboardedCookie === "true";

  // Case A: Auth routes (/login, /register)
  if (pathname === "/login" || pathname === "/register") {
    if (isAuthenticated) {
      const target = isOnboarded ? "/leads" : "/onboarding";
      return NextResponse.redirect(new URL(target, request.url));
    }
    return NextResponse.next();
  }

  // Case B: Onboarding route (/onboarding)
  if (pathname === "/onboarding") {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login?from=/onboarding", request.url));
    }
    if (isOnboarded) {
      return NextResponse.redirect(new URL("/leads", request.url));
    }
    return NextResponse.next();
  }

  // Case C: Protected SaaS routes (/leads, /dashboard, /settings)
  const isProtectedRoute =
    pathname.startsWith("/leads") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/settings");

  if (isProtectedRoute) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (!isOnboarded) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const middleware = proxy;

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg).*)",
  ],
};
