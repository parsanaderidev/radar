/**
 * Authentication and Session Management Utility
 * Uses Web Crypto API for HMAC-SHA256 signing and constant-time comparisons.
 * Zero external dependencies.
 */

const SESSION_COOKIE_NAME = "radar_session";
const SESSION_MAX_AGE_SECONDS = 86400; // 24 hours

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
  const pass = process.env.POCKETBASE_ADMIN_PASSWORD || process.env.RADAR_ADMIN_PASSWORD;
  if (!pass) {
    throw new Error(
      "[Auth Security] POCKETBASE_ADMIN_PASSWORD or RADAR_ADMIN_PASSWORD must be configured in environment variables."
    );
  }
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
    // Constant time check against dummy buffer to prevent timing leaks
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
 * Creates a signed session token: "<timestamp>.<signatureHex>"
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
 * Validates a session token
 */
export async function validateSessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [timestampStr, sigHex] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  // Check expiration (24h)
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

  // Convert hex back to bytes
  if (sigHex.length !== 64) return false;
  const sigBytes = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    sigBytes[i] = parseInt(sigHex.substr(i * 2, 2), 16);
  }

  return crypto.subtle.verify("HMAC", key, sigBytes, enc.encode(`radar:${timestampStr}`));
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

  // 2. Check HTTP-only Session Cookie
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
 * Formats a deletion Set-Cookie header
 */
export function formatSessionClearCookie(): string {
  return `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}
