/**
 * Shared 3-layer triage pipeline.
 *
 *   Layer 0 — deterministic pre-filter (lib/prefilter): zero tokens.
 *   Layer 1 — fast boolean screen against product keywords: zero tokens.
 *   Layer 2 — deep evaluation (LLM with Persian heuristic fallback).
 *
 * All entry points (worker, /api/analyze, /api/simulate, ingest webhooks)
 * go through triagePendingMessage so behavior cannot drift between them.
 */

import PocketBase from "pocketbase";
import {
  evaluateMessageWithLLM,
  sanitizeSuggestedReply,
  type IntentEvaluationResult,
  type EvaluateMessageInput,
} from "./llm";
import { prefilterMessage, screenIntent, hashContent } from "./prefilter";
import { formatUsd } from "./pricing";
import type {
  ProductRecord,
  RawMessageRecord,
} from "./pocketbase";

export type TriageLayer = "layer0" | "layer1" | "layer2";

export interface TriageOutcome {
  lead: any;
  evalResult: IntentEvaluationResult;
  layer: TriageLayer;
  deduped?: boolean;
}

/** How many recent messages to scan for 24h content-hash dedupe. */
const DEDUPE_SCAN_LIMIT = 200;

function filteredEvaluation(
  score: number,
  reasoning: string,
  model: string
): IntentEvaluationResult {
  return {
    intent_score: score,
    intent_level: "irrelevant",
    reasoning,
    matched_feature: "",
    suggested_reply: "",
    input_tokens: 0,
    output_tokens: 0,
    estimated_cost_usd: 0,
    model_used: model,
  };
}

/**
 * Layer 0b: 24h content-hash dedupe against recent raw_messages.
 * Bounded scan (latest N rows) so it stays cheap on large tables.
 */
export async function isDuplicateContent(
  pb: PocketBase,
  content: string,
  excludeId?: string
): Promise<boolean> {
  const hash = await hashContent(content);
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const sinceDate = since.toISOString().split("T")[0];

  const recent = await pb.collection("raw_messages").getList(1, DEDUPE_SCAN_LIMIT, {
    sort: "-created",
    filter: `created >= "${sinceDate}"`,
  });

  for (const row of recent.items as any[]) {
    if (excludeId && row.id === excludeId) continue;
    if (row.content && (await hashContent(row.content)) === hash) {
      return true;
    }
  }
  return false;
}

/**
 * Persists a Layer 0/1 rejection: zero-cost irrelevant lead + `filtered` status.
 * Rejections stay visible so the noise-reduction KPI stays honest.
 */
async function recordFilteredLead(
  pb: PocketBase,
  rawMsg: { id: string },
  product: ProductRecord,
  score: number,
  reasoning: string,
  modelUsed: string
): Promise<{ lead: any; evalResult: IntentEvaluationResult }> {
  const evalResult = filteredEvaluation(score, reasoning, modelUsed);
  const lead = await pb.collection("leads").create({
    raw_message_id: rawMsg.id,
    product_id: product.id,
    intent_score: evalResult.intent_score,
    intent_level: evalResult.intent_level,
    reasoning: evalResult.reasoning,
    matched_feature: "",
    suggested_reply: "",
    input_tokens: 0,
    output_tokens: 0,
    estimated_cost_usd: 0,
    lead_status: "new",
  });
  await pb.collection("raw_messages").update(rawMsg.id, { status: "filtered" }).catch((err: any) => {
    // Non-fatal: the lead is already recorded; a strict schema (missing the
    // "filtered" status value) must not fail the whole triage.
    console.warn(`[Pipeline] Could not mark msg ${rawMsg.id} as filtered:`, err?.message || err);
  });
  return { lead, evalResult };
}

/**
 * Layer 2 worker: deep evaluation + lead write. (Moved here from
 * scripts/worker.ts so routes and the worker share one implementation.)
 */
export async function processSingleMessage(
  pb: PocketBase,
  rawMsg: RawMessageRecord,
  product: ProductRecord
) {
  try {
    const platform = (rawMsg as any).expand?.source_id?.platform || "community";
    const evalResult = await evaluateMessageWithLLM({
      content: rawMsg.content,
      author_handle: rawMsg.author_handle,
      thread_context: rawMsg.thread_context,
      platform,
      product,
    });

    const lead = await pb.collection("leads").create({
      raw_message_id: rawMsg.id,
      product_id: product.id,
      intent_score: evalResult.intent_score,
      intent_level: evalResult.intent_level,
      reasoning: evalResult.reasoning,
      matched_feature: evalResult.matched_feature || "",
      suggested_reply: evalResult.suggested_reply || "",
      input_tokens: evalResult.input_tokens,
      output_tokens: evalResult.output_tokens,
      estimated_cost_usd: evalResult.estimated_cost_usd,
      lead_status: "new",
    });

    await pb.collection("raw_messages").update(rawMsg.id, { status: "processed" });

    const levelColor =
      evalResult.intent_level === "high_intent"
        ? "\x1b[32m[HIGH INTENT]\x1b[0m"
        : evalResult.intent_level === "problem_aware"
          ? "\x1b[33m[PROBLEM AWARE]\x1b[0m"
          : evalResult.intent_level === "curious"
            ? "\x1b[36m[CURIOUS]\x1b[0m"
            : "\x1b[90m[IRRELEVANT/NOISE]\x1b[0m";

    console.log(
      `✓ Processed msg ${rawMsg.id} | ${levelColor} score: ${evalResult.intent_score} | spend: ${formatUsd(
        evalResult.estimated_cost_usd
      )} | author: ${rawMsg.author_handle}`
    );

    return { lead, evalResult };
  } catch (err: any) {
    console.error(`✗ Error processing message ${rawMsg.id}:`, err?.message || err);
    try {
      await pb.collection("raw_messages").update(rawMsg.id, { status: "error" });
    } catch {}
    throw err;
  }
}

/**
 * Full 3-layer triage for one persisted raw_message.
 */
export async function triagePendingMessage(
  pb: PocketBase,
  rawMsg: RawMessageRecord,
  product: ProductRecord
): Promise<TriageOutcome> {
  const model = process.env.LLM_MODEL || "llama3.1";

  // --- Layer 0a: static rules ---
  const pre = prefilterMessage(rawMsg.content);
  if (pre.verdict === "reject") {
    const { lead, evalResult } = await recordFilteredLead(
      pb,
      rawMsg,
      product,
      pre.reason === "injection" ? 0 : 5,
      pre.reasonFa,
      `${model} (Layer 0 deterministic filter)`
    );
    console.log(`⊘ Filtered msg ${rawMsg.id} | [LAYER 0:${pre.reason}] | author: ${rawMsg.author_handle}`);
    return { lead, evalResult, layer: "layer0" };
  }

  // --- Layer 0b: 24h content-hash dedupe (excluding the row itself) ---
  if (await isDuplicateContent(pb, rawMsg.content, rawMsg.id)) {
    const { lead, evalResult } = await recordFilteredLead(
      pb,
      rawMsg,
      product,
      5,
      "متن تکراری در بازه ۲۴ ساعت گذشته شناسایی و بدون مصرف توکن فیلتر شد.",
      `${model} (Layer 0 hash dedupe)`
    );
    console.log(`⊘ Filtered msg ${rawMsg.id} | [LAYER 0:duplicate] | author: ${rawMsg.author_handle}`);
    return { lead, evalResult, layer: "layer0" };
  }

  // --- Layer 1: fast screen ---
  const screen = screenIntent(rawMsg.content, rawMsg.thread_context, product.keywords);
  if (!screen.qualifies) {
    const { lead, evalResult } = await recordFilteredLead(
      pb,
      rawMsg,
      product,
      12,
      "پیام فاقد سیگنال خرید، درد کاری یا تطابق با کلیدواژه‌های محصول تشخیص داده شد و به ارزیابی عمیق ارسال نشد.",
      `${model} (Layer 1 intent screen)`
    );
    console.log(`⊘ Filtered msg ${rawMsg.id} | [LAYER 1:unqualified] | author: ${rawMsg.author_handle}`);
    return { lead, evalResult, layer: "layer1" };
  }

  // --- Layer 2: deep evaluation ---
  const { lead, evalResult } = await processSingleMessage(pb, rawMsg, product);
  return { lead, evalResult, layer: "layer2" };
}

/**
 * Ad-hoc (unpersisted) evaluation through Layers 0–2 for /api/analyze.
 * Layer 0/1 rejections return immediately without spending tokens.
 */
export async function triageAdHocMessage(
  input: EvaluateMessageInput
): Promise<{ evalResult: IntentEvaluationResult; layer: TriageLayer }> {
  const model = process.env.LLM_MODEL || "llama3.1";

  const pre = prefilterMessage(input.content);
  if (pre.verdict === "reject") {
    return {
      evalResult: filteredEvaluation(
        pre.reason === "injection" ? 0 : 5,
        pre.reasonFa,
        `${model} (Layer 0 deterministic filter)`
      ),
      layer: "layer0",
    };
  }

  const screen = screenIntent(input.content, input.thread_context, input.product.keywords);
  if (!screen.qualifies) {
    return {
      evalResult: filteredEvaluation(
        12,
        "پیام فاقد سیگنال خرید، درد کاری یا تطابق با کلیدواژه‌های محصول تشخیص داده شد و به ارزیابی عمیق ارسال نشد.",
        `${model} (Layer 1 intent screen)`
      ),
      layer: "layer1",
    };
  }

  const evalResult = await evaluateMessageWithLLM(input);
  return {
    evalResult: {
      ...evalResult,
      suggested_reply: sanitizeSuggestedReply(evalResult.suggested_reply),
    },
    layer: "layer2",
  };
}
