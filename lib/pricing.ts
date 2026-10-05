/**
 * Cost Accounting Engine & Persian Typography Numerical Formatter
 * Zero External Dependencies
 */

export interface ModelPricingTier {
  model: string;
  inputPerMillion: number;  // in USD
  outputPerMillion: number; // in USD
}

export const DEFAULT_PRICING_TIERS: Record<string, ModelPricingTier> = {
  "llama3.1": {
    model: "llama3.1",
    inputPerMillion: 0.15,
    outputPerMillion: 0.60,
  },
  "llama3.1:8b": {
    model: "llama3.1:8b",
    inputPerMillion: 0.10,
    outputPerMillion: 0.30,
  },
  "qwen2.5": {
    model: "qwen2.5",
    inputPerMillion: 0.15,
    outputPerMillion: 0.50,
  },
  "deepseek-r1": {
    model: "deepseek-r1",
    inputPerMillion: 0.20,
    outputPerMillion: 0.80,
  },
  "default": {
    model: "default",
    inputPerMillion: 0.15,
    outputPerMillion: 0.60,
  },
};

/**
 * Converts English digits (0-9) to Persian digits (۰-۹)
 */
export function toPersianDigits(value: string | number | undefined | null): string {
  if (value === undefined || value === null) return "";
  const str = String(value);
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/[0-9]/g, (w) => persianDigits[parseInt(w, 10)]);
}

/**
 * Calculates USD cost for message evaluation based on token consumption.
 */
export function calculateMessageCost(
  inputTokens: number,
  outputTokens: number,
  modelName: string = "llama3.1"
): {
  inputCost: number;
  outputCost: number;
  totalCostUsd: number;
} {
  const envInputRate = process.env.INPUT_TOKEN_COST_PER_MILLION
    ? parseFloat(process.env.INPUT_TOKEN_COST_PER_MILLION)
    : undefined;
  const envOutputRate = process.env.OUTPUT_TOKEN_COST_PER_MILLION
    ? parseFloat(process.env.OUTPUT_TOKEN_COST_PER_MILLION)
    : undefined;

  const tier =
    DEFAULT_PRICING_TIERS[modelName.toLowerCase()] ||
    DEFAULT_PRICING_TIERS["default"];

  const inputRate = envInputRate ?? tier.inputPerMillion;
  const outputRate = envOutputRate ?? tier.outputPerMillion;

  const inputCost = (inputTokens / 1_000_000) * inputRate;
  const outputCost = (outputTokens / 1_000_000) * outputRate;
  const totalCostUsd = Number((inputCost + outputCost).toFixed(6));

  return {
    inputCost: Number(inputCost.toFixed(6)),
    outputCost: Number(outputCost.toFixed(6)),
    totalCostUsd,
  };
}

export interface CommunityMetricsSummary {
  totalMessages: number;
  totalEvaluated: number;
  noiseMessages: number;
  qualifiedLeads: number;      // high_intent + problem_aware
  highIntentCount: number;
  problemAwareCount: number;
  curiousCount: number;
  irrelevantCount: number;
  noiseFilteredPercent: number; // 0 - 100%
  totalSpendUsd: number;
  avgCostPerMessageUsd: number;
  avgCostPerQualifiedLeadUsd: number;
  estimatedTomanSpend: number;  // Domestic Toman conversion
}

/**
 * Reference rate for domestic commercial AI inference in Iran.
 * Calibrated so an average message evaluation costs ~2,000 Tomans.
 * (e.g. ~0.0001 USD of raw compute maps to ~2,000 Tomans of commercial service value).
 */
export const DOMESTIC_TOMAN_MULTIPLIER = 20_000_000;

/**
 * Computes high-level aggregated radar metrics.
 */
export function calculateRadarMetrics(
  leads: Array<{
    intent_level?: "high_intent" | "problem_aware" | "curious" | "irrelevant" | string;
    estimated_cost_usd?: number;
  }>,
  totalRawMessagesCount?: number,
  usdToTomanExchangeRate: number = DOMESTIC_TOMAN_MULTIPLIER
): CommunityMetricsSummary {
  const totalEvaluated = leads.length;
  const totalMessages = Math.max(totalRawMessagesCount || 0, totalEvaluated);

  let highIntentCount = 0;
  let problemAwareCount = 0;
  let curiousCount = 0;
  let irrelevantCount = 0;
  let totalSpendUsd = 0;

  for (const lead of leads) {
    totalSpendUsd += Number(lead.estimated_cost_usd || 0);

    switch (lead.intent_level) {
      case "high_intent":
        highIntentCount++;
        break;
      case "problem_aware":
        problemAwareCount++;
        break;
      case "curious":
        curiousCount++;
        break;
      case "irrelevant":
      default:
        irrelevantCount++;
        break;
    }
  }

  const qualifiedLeads = highIntentCount + problemAwareCount;
  const noiseMessages = irrelevantCount;
  const noiseFilteredPercent =
    totalEvaluated > 0
      ? Number(((irrelevantCount / totalEvaluated) * 100).toFixed(1))
      : 0;

  const avgCostPerMessageUsd =
    totalEvaluated > 0 ? Number((totalSpendUsd / totalEvaluated).toFixed(6)) : 0;

  const avgCostPerQualifiedLeadUsd =
    qualifiedLeads > 0
      ? Number((totalSpendUsd / qualifiedLeads).toFixed(6))
      : 0;

  const estimatedTomanSpend = Math.round(totalSpendUsd * usdToTomanExchangeRate);

  return {
    totalMessages,
    totalEvaluated,
    noiseMessages,
    qualifiedLeads,
    highIntentCount,
    problemAwareCount,
    curiousCount,
    irrelevantCount,
    noiseFilteredPercent,
    totalSpendUsd: Number(totalSpendUsd.toFixed(6)),
    avgCostPerMessageUsd,
    avgCostPerQualifiedLeadUsd,
    estimatedTomanSpend,
  };
}

/**
 * Format USD with clean Persian numerals without awkward scientific/micro trailing decimals
 */
export function formatPersianUsd(amount: number): string {
  if (!amount || amount === 0) return "۰ دلار";
  if (amount < 0.001) return "کمتر از ۰.۰۰۱ دلار";
  const num = amount < 0.01 ? parseFloat(amount.toFixed(3)) : parseFloat(amount.toFixed(2));
  return `${toPersianDigits(num)} دلار`;
}

/**
 * Formats an integer or float with standard comma grouping and Persian digits without irregular spacing.
 */
export function formatPersianNumber(value: number | string | undefined | null): string {
  if (value === undefined || value === null) return "۰";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return toPersianDigits(value);
  const parts = num.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return toPersianDigits(parts.join("."));
}

/**
 * Format Toman currency in clean native Persian with exact 3-digit comma grouping (e.g. ۲۰,۰۰۰ تومان)
 */
export function formatPersianToman(tomans: number): string {
  if (!tomans || tomans <= 0) return "۰ تومان";
  const rounded = Math.round(tomans / 50) * 50;
  return `${formatPersianNumber(rounded)} تومان`;
}

/**
 * Formats individual message cost in realistic Iranian commercial tariff (~2,000 Tomans)
 * Formats with exact 3-digit Persian comma separation (e.g. ۲,۰۰۰ تومان)
 */
export function formatMessageCostToman(
  usdAmount: number,
  rate: number = DOMESTIC_TOMAN_MULTIPLIER
): string {
  if (!usdAmount || usdAmount <= 0) return "۰ تومان";
  const rawTomans = usdAmount * rate;
  // Round to nearest 50 Tomans for clean commercial accounting (e.g. ۱,۹۵۰ or ۲,۰۰۰)
  const tomans = Math.max(500, Math.round(rawTomans / 50) * 50);
  return `${formatPersianNumber(tomans)} تومان`;
}

// Backward-compatible exports
export const formatUsd = (amount: number) => formatPersianUsd(amount);
export const formatToman = (tomans: number) => formatPersianToman(tomans);


