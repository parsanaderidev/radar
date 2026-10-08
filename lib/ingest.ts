/**
 * Shared webhook ingestion: platform payload -> pending raw_message.
 *
 * Used by /api/ingest/telegram and /api/ingest/bale. Handles source
 * auto-provisioning (one source row per chat) and redelivery dedupe via
 * platform-scoped external_id. Zero external dependencies.
 */

import PocketBase from "pocketbase";
import { sanitizeString } from "./validation";

export type IngestPlatform = "telegram" | "bale";

export interface IngestMessageInput {
  platform: IngestPlatform;
  /** Platform-scoped unique id, e.g. "tg:<chatId>:<messageId>". */
  externalId: string;
  authorHandle: string;
  content: string;
  threadContext?: string;
  postedAt?: string;
  /** Human chat title, e.g. group name. */
  chatTitle?: string;
}

export interface IngestOutcome {
  rawMessage: any;
  deduped: boolean;
  sourceId: string;
}

function sourceName(platform: IngestPlatform, chatTitle: string | undefined, chatId: string): string {
  const label = platform === "telegram" ? "Telegram" : "Bale";
  const title = sanitizeString(chatTitle, 80).replace(/["\\]/g, "") || `chat ${chatId}`;
  return `${label}: ${title} (${chatId})`;
}

function escapeFilterValue(val: string): string {
  return val.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

/**
 * Finds the source row for a chat or creates it (status: active).
 */
export async function findOrCreateSource(
  pb: PocketBase,
  platform: IngestPlatform,
  chatTitle: string | undefined,
  chatId: string
): Promise<string> {
  const name = sourceName(platform, chatTitle, chatId);
  const existing = await pb.collection("sources").getList(1, 1, {
    filter: `platform = "${platform}" && name = "${escapeFilterValue(name)}"`,
  });
  if (existing.totalItems > 0) return existing.items[0].id;

  const created = await pb.collection("sources").create({
    name,
    platform,
    status: "active",
  });
  return created.id;
}

/**
 * Inserts an external message as pending, or returns the existing row when
 * the platform redelivers the same external_id.
 */
export async function ingestExternalMessage(
  pb: PocketBase,
  input: IngestMessageInput,
  chatId: string
): Promise<IngestOutcome> {
  const content = sanitizeString(input.content, 3000);
  if (!content) {
    throw new Error("Empty message content after sanitization.");
  }

  const sourceId = await findOrCreateSource(pb, input.platform, input.chatTitle, chatId);

  const existing = await pb.collection("raw_messages").getList(1, 1, {
    filter: `external_id = "${escapeFilterValue(input.externalId)}"`,
  });
  if (existing.totalItems > 0) {
    return { rawMessage: existing.items[0], deduped: true, sourceId };
  }

  const rawMessage = await pb.collection("raw_messages").create({
    source_id: sourceId,
    external_id: input.externalId,
    author_handle: sanitizeString(input.authorHandle, 100) || "@guest_user",
    content,
    thread_context: sanitizeString(input.threadContext || "", 1500),
    posted_at: input.postedAt || new Date().toISOString(),
    status: "pending",
  });

  return { rawMessage, deduped: false, sourceId };
}
