import PocketBase from "pocketbase";

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  company?: string;
  role?: string;
  product_name?: string;
  product_description?: string;
  ideal_customer_profile?: string;
  onboarding_completed?: boolean;
  plan?: "free" | "starter" | "growth" | "enterprise";
  product_id?: string;
  has_fetched_initial?: boolean;
  bot_active?: boolean;
  last_bot_run?: string;
  created?: string;
  updated?: string;
}

export interface ProductRecord {
  id: string;
  name: string;
  tagline?: string;
  description: string;
  value_propositions: string[];
  ideal_customer_profile: string;
  keywords: string[];
  user_id?: string;
  created?: string;
  updated?: string;
}

export interface SourceRecord {
  id: string;
  name: string;
  platform: "telegram" | "bale" | "twitter_x" | "forum";
  status: "active" | "paused";
  created?: string;
  updated?: string;
}

export interface RawMessageRecord {
  id: string;
  source_id?: string;
  external_id?: string;
  author_handle: string;
  content: string;
  thread_context?: string;
  posted_at?: string;
  status: "pending" | "processed" | "filtered" | "error";
  user_id?: string;
  created?: string;
  updated?: string;
  expand?: {
    source_id?: SourceRecord;
  };
}

export interface LeadRecord {
  id: string;
  raw_message_id: string;
  product_id: string;
  user_id?: string;
  intent_score: number;
  intent_level: "high_intent" | "problem_aware" | "curious" | "irrelevant";
  reasoning: string;
  matched_feature?: string;
  suggested_reply?: string;
  input_tokens: number;
  output_tokens: number;
  estimated_cost_usd: number;
  lead_status: "new" | "approved" | "contacted" | "dismissed";
  notes?: string;
  created?: string;
  updated?: string;
  expand?: {
    raw_message_id?: RawMessageRecord;
    product_id?: ProductRecord;
    user_id?: UserRecord;
  };
}

let browserClient: PocketBase | null = null;

export function getPocketBaseUrl(): string {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://127.0.0.1:8090";
  }
  return (
    process.env.POCKETBASE_URL ||
    process.env.NEXT_PUBLIC_POCKETBASE_URL ||
    "http://127.0.0.1:8090"
  );
}

/**
 * Returns a PocketBase client instance.
 * Reuses browser client to preserve SSE subscriptions.
 */
export function getPocketBaseClient(): PocketBase {
  const url = getPocketBaseUrl();
  if (typeof window !== "undefined") {
    if (!browserClient) {
      browserClient = new PocketBase(url);
      browserClient.autoCancellation(false);
    }
    return browserClient;
  }
  const client = new PocketBase(url);
  client.autoCancellation(false);
  return client;
}

/**
 * Authenticates as superuser / admin for background workers & server APIs.
 * Requires explicit environment variables; does not fall back to hardcoded passwords.
 */
export async function authenticateSuperuser(pb: PocketBase): Promise<boolean> {
  const adminEmail = process.env.POCKETBASE_ADMIN_EMAIL;
  const adminPassword = process.env.POCKETBASE_ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      "[PocketBase Auth] Missing required credentials: POCKETBASE_ADMIN_EMAIL and POCKETBASE_ADMIN_PASSWORD must be configured in environment."
    );
  }

  try {
    if (pb.collection("_superusers") && typeof pb.collection("_superusers").authWithPassword === "function") {
      await pb.collection("_superusers").authWithPassword(adminEmail, adminPassword);
      return true;
    }
    if (pb.admins) {
      await pb.admins.authWithPassword(adminEmail, adminPassword);
      return true;
    }
    return false;
  } catch (err: any) {
    console.error("[PocketBase] Superuser authentication failed:", err?.message || err);
    return false;
  }
}
