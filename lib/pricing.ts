/**
 * Cost Accounting Engine (Zero External Dependencies)
 * Precision tracking of LLM inference spend, per-token accounting, and ROI metrics.
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
 * Calculates the exact USD cost for a single message evaluation based on token consumption.
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
  estimatedTomanSpend: number;  // Optional domestic conversion
}

/**
 * Computes high-level aggregated radar metrics.
 */
export function calculateRadarMetrics(
  leads: Array<{
    intent_level?: "high_intent" | "problem_aware" | "curious" | "irrelevant" | string;
    estimated_cost_usd?: number;
  }>,
  totalRawMessagesCount?: number,
  usdToTomanExchangeRate: number = 900_000 // Approximate reference rate
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
 * Format USD with 4 to 6 decimal places for micro-cent billing.
 */
export function formatUsd(amount: number): string {
  if (amount === 0) return "$0.00";
  if (amount < 0.01) {
    return `$${amount.toFixed(5)}`;
  }
  return `$${amount.toFixed(3)}`;
}

/**
 * Format Toman with Persian/English digit grouping.
 */
export function formatToman(tomans: number): string {
  return new Intl.NumberFormat("fa-IR").format(tomans) + " تومان";
}
