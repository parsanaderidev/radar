"use client";

import React from "react";
import { SearchIcon } from "./Icons";
import { formatUsd, formatToman, type CommunityMetricsSummary } from "../lib/pricing";
import { cn } from "../lib/cn";

interface MetricsHeaderProps {
  metrics: CommunityMetricsSummary;
  selectedIntent: string;
  onSelectIntent: (intent: string) => void;
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function MetricsHeader({
  metrics,
  selectedIntent,
  onSelectIntent,
  selectedStatus,
  onSelectStatus,
  searchQuery,
  onSearchChange,
}: MetricsHeaderProps) {
  return (
    <div className="space-y-4">
      {/* 5 Vercel Analytics Metric Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Card 1: Total Messages */}
        <div className="p-4 rounded-lg bg-[#0a0a0a] border border-[#1f1f1f] hover:border-[#333] transition-colors flex flex-col justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
            Total Ingested
          </span>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-mono font-semibold tracking-tight text-white">
              {metrics.totalMessages}
            </div>
            <div className="text-[11px] text-neutral-500 mt-1 font-mono">
              {metrics.totalEvaluated} processed
            </div>
          </div>
        </div>

        {/* Card 2: Noise Filtered Ratio */}
        <div className="p-4 rounded-lg bg-[#0a0a0a] border border-[#1f1f1f] hover:border-[#333] transition-colors flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
              Noise Filtered
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">
              Ratio
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-mono font-semibold tracking-tight text-white">
              {metrics.noiseFilteredPercent}%
            </div>
            <div className="text-[11px] text-neutral-500 mt-1 font-mono">
              {metrics.noiseMessages} irrelevant dropped
            </div>
          </div>
        </div>

        {/* Card 3: Qualified Leads */}
        <div className="p-4 rounded-lg bg-[#0a0a0a] border border-[#1f1f1f] hover:border-[#333] transition-colors flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
              Qualified ICP Leads
            </span>
            <span className="flex h-1.5 w-1.5 rounded-full bg-[#00e599]" />
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-mono font-semibold tracking-tight text-[#00e599]">
              {metrics.qualifiedLeads}
            </div>
            <div className="text-[11px] text-neutral-400 mt-1 font-mono flex items-center gap-2">
              <span className="text-[#00e599]">{metrics.highIntentCount} high</span>
              <span className="text-neutral-600">•</span>
              <span className="text-[#f5a623]">{metrics.problemAwareCount} pain</span>
            </div>
          </div>
        </div>

        {/* Card 4: Total Spend */}
        <div className="p-4 rounded-lg bg-[#0a0a0a] border border-[#1f1f1f] hover:border-[#333] transition-colors flex flex-col justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
            Compute Spend
          </span>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-mono font-semibold tracking-tight text-white">
              {formatUsd(metrics.totalSpendUsd)}
            </div>
            <div className="text-[11px] text-neutral-500 mt-1 font-mono">
              ≈ {formatToman(metrics.estimatedTomanSpend)}
            </div>
          </div>
        </div>

        {/* Card 5: Avg Cost Per Lead */}
        <div className="p-4 rounded-lg bg-[#0a0a0a] border border-[#1f1f1f] hover:border-[#333] transition-colors flex flex-col justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
            Cost Per Lead
          </span>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-mono font-semibold tracking-tight text-white">
              {formatUsd(metrics.avgCostPerQualifiedLeadUsd)}
            </div>
            <div className="text-[11px] text-neutral-500 mt-1 font-mono">
              per qualified opportunity
            </div>
          </div>
        </div>
      </div>

      {/* Vercel-style Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 rounded-lg bg-[#0a0a0a] border border-[#1f1f1f]">
        {/* Intent level filter tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => onSelectIntent("all")}
            className={cn(
              "px-3 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap",
              selectedIntent === "all"
                ? "bg-[#222222] text-white"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-[#141414]"
            )}
          >
            همه موارد ({metrics.totalEvaluated})
          </button>
          <button
            onClick={() => onSelectIntent("high_intent")}
            className={cn(
              "px-3 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1.5",
              selectedIntent === "high_intent"
                ? "bg-[#222222] text-[#00e599]"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-[#141414]"
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e599]" />
            <span>خرید قطعی ({metrics.highIntentCount})</span>
          </button>
          <button
            onClick={() => onSelectIntent("problem_aware")}
            className={cn(
              "px-3 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1.5",
              selectedIntent === "problem_aware"
                ? "bg-[#222222] text-[#f5a623]"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-[#141414]"
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#f5a623]" />
            <span>دردمند ({metrics.problemAwareCount})</span>
          </button>
          <button
            onClick={() => onSelectIntent("curious")}
            className={cn(
              "px-3 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1.5",
              selectedIntent === "curious"
                ? "bg-[#222222] text-[#0070f3]"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-[#141414]"
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#0070f3]" />
            <span>کنجکاو ({metrics.curiousCount})</span>
          </button>
          <button
            onClick={() => onSelectIntent("irrelevant")}
            className={cn(
              "px-3 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1.5",
              selectedIntent === "irrelevant"
                ? "bg-[#222222] text-neutral-300"
                : "text-neutral-500 hover:text-neutral-300 hover:bg-[#141414]"
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
            <span>نویز ({metrics.irrelevantCount})</span>
          </button>
        </div>

        {/* Minimal Search input */}
        <div className="relative flex items-center min-w-[240px]">
          <SearchIcon className="w-3.5 h-3.5 text-neutral-500 absolute right-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="فیلتر پیام، فرستنده یا ویژگی..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-3 pr-8 py-1.5 rounded-md bg-[#000000] border border-[#262626] text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-white transition-colors font-sans"
          />
        </div>
      </div>
    </div>
  );
}
