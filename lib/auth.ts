/**
 * Authentication and Session Management Utility for Radar SaaS
 * Supports PocketBase User Auth (JWT), Admin Passwords, and HMAC Sessions.
 * Zero external dependencies.
 */

import PocketBase from "pocketbase";
import { getPocketBaseUrl, type UserRecord } from "./pocketbase";

export const SESSION_COOKIE_NAME = "radar_session";
export const ONBOARDED_COOKIE_NAME = "radar_onboarded";
export const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60; // 30 days persistent session

/**
 * Decodes a JWT payload without external libraries. Works in Node, Bun, Edge runtime.
 */
export function parseJwtPayload(token: string): any | null {
  try {
    if (!token || typeof token !== "string") return null;
    const parts = token.split(".");
    if (parts.length < 2) return null;
    let base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }
    if (typeof Buffer !== "undefined") {
      const jsonStr = Buffer.from(base64, "base64").toString("utf-8");
      return JSON.parse(jsonStr);
    }
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, (m) => m.charCodeAt(0));
    const decoder = new TextDecoder("utf-8");
    return JSON.parse(decoder.decode(bytes));
  } catch {
    return null;
  }
}

/**
 * Derives a consistent signing key for HMAC
 */
async function getCryptoKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/**
 * Returns the configured master admin password
 */
export function getAdminPassword(): string {
  const pass = process.env.RADAR_ADMIN_PASSWORD || process.env.POCKETBASE_ADMIN_PASSWORD || "BuildX";
  return pass;
}

/**
 * Returns the configured API key for programmatic/worker access
 */
export function getRadarApiKey(): string | null {
  return process.env.RADAR_API_KEY || null;
}

/**
 * Timing-safe string comparison
 */
export function timingSafeEqual(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const bufA = new TextEncoder().encode(a);
  const bufB = new TextEncoder().encode(b);
  if (bufA.byteLength !== bufB.byteLength) {
    let dummy = 0;
    for (let i = 0; i < bufA.byteLength; i++) {
      dummy |= bufA[i] ^ (bufB[i % bufB.byteLength] || 0);
    }
    return false;
  }
  let diff = 0;
  for (let i = 0; i < bufA.byteLength; i++) {
    diff |= bufA[i] ^ bufB[i];
  }
  return diff === 0;
}

/**
 * Creates an admin signed session token: "<timestamp>.<signatureHex>"
 */
export async function createSessionToken(): Promise<string> {
  const secret = getAdminPassword();
  const timestamp = Date.now().toString();
  const key = await getCryptoKey(secret);

  const enc = new TextEncoder();
  const sigBuffer = await crypto.subtle.sign("HMAC", key, enc.encode(`radar:${timestamp}`));
  const sigHex = Array.from(new Uint8Array(sigBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return `${timestamp}.${sigHex}`;
}

/**
 * Validates an admin HMAC session token
 */
export async function validateAdminSessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [timestampStr, sigHex] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  const now = Date.now();
  if (now < timestamp || now - timestamp > SESSION_MAX_AGE_SECONDS * 1000) {
    return false;
  }

  let secret: string;
  try {
    secret = getAdminPassword();
  } catch {
    return false;
  }

  const key = await getCryptoKey(secret);
  const enc = new TextEncoder();

  if (sigHex.length !== 64) return false;
  const sigBytes = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    sigBytes[i] = parseInt(sigHex.substr(i * 2, 2), 16);
  }

  return crypto.subtle.verify("HMAC", key, sigBytes, enc.encode(`radar:${timestampStr}`));
}

/**
 * Backward-compatible token validation
 */
export async function validateSessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;

  // 1. Check if it's a PocketBase JWT token
  const payload = parseJwtPayload(token);
  if (payload && payload.exp) {
    const isNotExpired = payload.exp * 1000 > Date.now();
    if (isNotExpired) return true;
  }

  // 2. Fall back to admin HMAC token check
  return validateAdminSessionToken(token);
}

/**
 * Verifies a PocketBase token against PocketBase server and retrieves user record
 */
export async function verifyPocketBaseUserToken(
  token: string
): Promise<{ valid: boolean; user: UserRecord | null }> {
  try {
    const payload = parseJwtPayload(token);
    if (!payload || !payload.id || payload.exp * 1000 <= Date.now()) {
      return { valid: false, user: null };
    }

    const pb = new PocketBase(getPocketBaseUrl());
    pb.authStore.save(token, null);

    // Fetch user record
    const record = await pb.collection("users").getOne<UserRecord>(payload.id);
    if (!record) {
      return { valid: false, user: null };
    }

    return { valid: true, user: record };
  } catch (err) {
    return { valid: false, user: null };
  }
}

/**
 * Helper to get the session token from a Request's Cookie header
 */
export function getSessionTokenFromRequest(req: Request): string | null {
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").map((c) => c.trim());
  for (const c of cookies) {
    if (c.startsWith(`${SESSION_COOKIE_NAME}=`)) {
      return decodeURIComponent(c.substring(SESSION_COOKIE_NAME.length + 1));
    }
  }
  return null;
}

/**
 * Helper to get the onboarding cookie from a Request
 */
export function getOnboardedStatusFromRequest(req: Request): boolean {
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) return false;

  const cookies = cookieHeader.split(";").map((c) => c.trim());
  for (const c of cookies) {
    if (c.startsWith(`${ONBOARDED_COOKIE_NAME}=`)) {
      const val = decodeURIComponent(c.substring(ONBOARDED_COOKIE_NAME.length + 1));
      return val === "1" || val === "true";
    }
  }
  return false;
}

export interface AuthSession {
  isAuthenticated: boolean;
  user: UserRecord | null;
  isAdmin: boolean;
  isOnboarded: boolean;
}

/**
 * Retrieves the complete authenticated session from a Request
 */
export async function getAuthSession(req: Request): Promise<AuthSession> {
  const token = getSessionTokenFromRequest(req);
  if (!token) {
    return { isAuthenticated: false, user: null, isAdmin: false, isOnboarded: false };
  }

  // 1. Try PocketBase User Token
  const pbResult = await verifyPocketBaseUserToken(token);
  if (pbResult.valid && pbResult.user) {
    return {
      isAuthenticated: true,
      user: pbResult.user,
      isAdmin: false,
      isOnboarded: !!pbResult.user.onboarding_completed,
    };
  }

  // 2. Try Admin HMAC Token
  const isAdmin = await validateAdminSessionToken(token);
  if (isAdmin) {
    return {
      isAuthenticated: true,
      user: {
        id: "admin",
        email: "admin@radar.local",
        name: "مدیر ارشد سامانه",
        company: "Radar Core",
        role: "مدیر سیستم",
        onboarding_completed: true,
      },
      isAdmin: true,
      isOnboarded: true,
    };
  }

  return { isAuthenticated: false, user: null, isAdmin: false, isOnboarded: false };
}

/**
 * Validates whether the incoming Request has an authorized session or valid Bearer API key
 */
export async function isAuthenticatedRequest(req: Request): Promise<boolean> {
  // 1. Check Bearer API Key
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7).trim();
    const apiKey = getRadarApiKey();
    const adminPass = getAdminPassword();

    if (apiKey && timingSafeEqual(token, apiKey)) {
      return true;
    }
    if (adminPass && timingSafeEqual(token, adminPass)) {
      return true;
    }
  }

  // 2. Check Session Cookie
  const sessionToken = getSessionTokenFromRequest(req);
  if (sessionToken) {
    const isValid = await validateSessionToken(sessionToken);
    if (isValid) return true;
  }

  return false;
}

/**
 * Formats a Set-Cookie string for the session
 */
export function formatSessionSetCookie(token: string, isProduction = process.env.NODE_ENV === "production"): string {
  const secureFlag = isProduction ? "Secure; " : "";
  return `${SESSION_COOKIE_NAME}=${encodeURIComponent(
    token
  )}; Path=/; HttpOnly; SameSite=Lax; ${secureFlag}Max-Age=${SESSION_MAX_AGE_SECONDS}`;
}

/**
 * Formats a Set-Cookie string for the onboarding flag
 */
export function formatOnboardedSetCookie(
  isOnboarded: boolean,
  isProduction = process.env.NODE_ENV === "production"
): string {
  const secureFlag = isProduction ? "Secure; " : "";
  return `${ONBOARDED_COOKIE_NAME}=${isOnboarded ? "1" : "0"}; Path=/; HttpOnly; SameSite=Lax; ${secureFlag}Max-Age=${SESSION_MAX_AGE_SECONDS}`;
}

/**
 * Formats a deletion Set-Cookie header for session
 */
export function formatSessionClearCookie(): string {
  return `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

/**
 * Formats a deletion Set-Cookie header for onboarding
 */
export function formatOnboardedClearCookie(): string {
  return `${ONBOARDED_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}
