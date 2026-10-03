"use client";

import React from "react";
import { SearchIcon } from "./Icons";
import {
  toPersianDigits,
  formatPersianToman,
  formatPersianUsd,
  formatMessageCostToman,
  type CommunityMetricsSummary,
} from "../lib/pricing";
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
        <div className="p-4 rounded-lg bg-[#0a0a0a] border border-[#1f1f1f] hover:border-[#333333] transition-colors flex flex-col justify-between">
          <span className="text-xs text-neutral-400 font-medium">
            کل پیام‌های دریافتی
          </span>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-semibold text-white">
              {toPersianDigits(metrics.totalMessages)}
            </div>
            <div className="text-xs text-neutral-500 mt-1">
              {toPersianDigits(metrics.totalEvaluated)} پیام ارزیابی‌شده
            </div>
          </div>
        </div>

        {/* Card 2: Noise Filtered Ratio */}
        <div className="p-4 rounded-lg bg-[#0a0a0a] border border-[#1f1f1f] hover:border-[#333333] transition-colors flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-neutral-400 font-medium">
              نرخ حذف نویز
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 font-medium">
              فیلتر خودکار
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-semibold text-white flex items-baseline gap-1">
              <span>{toPersianDigits(metrics.noiseFilteredPercent)}</span>
              <span className="text-base text-neutral-400 font-normal">٪</span>
            </div>
            <div className="text-xs text-neutral-500 mt-1">
              {toPersianDigits(metrics.noiseMessages)} پیام نامرتبط پالایش شد
            </div>
          </div>
        </div>

        {/* Card 3: Qualified Leads */}
        <div className="p-4 rounded-lg bg-[#0a0a0a] border border-[#1f1f1f] hover:border-[#333333] transition-colors flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-neutral-400 font-medium">
              سرنخ‌های واجد شرایط (ICP)
            </span>
            <span className="flex h-2 w-2 rounded-full bg-[#00e599] shadow-[0_0_8px_rgba(0,229,153,0.6)]" />
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-semibold text-[#00e599]">
              {toPersianDigits(metrics.qualifiedLeads)}
            </div>
            <div className="text-xs text-neutral-400 mt-1 flex items-center gap-1.5 flex-wrap">
              <span className="text-[#00e599] font-medium">{toPersianDigits(metrics.highIntentCount)} خرید قطعی</span>
              <span className="text-neutral-600 px-1">•</span>
              <span className="text-[#f5a623] font-medium">{toPersianDigits(metrics.problemAwareCount)} دردمند</span>
            </div>
          </div>
        </div>

        {/* Card 4: Total Spend */}
        <div className="p-4 rounded-lg bg-[#0a0a0a] border border-[#1f1f1f] hover:border-[#333333] transition-colors flex flex-col justify-between">
          <span className="text-xs text-neutral-400 font-medium">
            هزینه پردازش هوش
          </span>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-semibold text-white">
              {formatPersianToman(metrics.estimatedTomanSpend)}
            </div>
            <div className="text-xs text-neutral-500 mt-1">
              معادل {formatPersianUsd(metrics.totalSpendUsd)}
            </div>
          </div>
        </div>

        {/* Card 5: Avg Cost Per Lead */}
        <div className="p-4 rounded-lg bg-[#0a0a0a] border border-[#1f1f1f] hover:border-[#333333] transition-colors flex flex-col justify-between">
          <span className="text-xs text-neutral-400 font-medium">
            هزینه به‌ازای هر سرنخ
          </span>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-semibold text-white">
              {formatMessageCostToman(metrics.avgCostPerQualifiedLeadUsd)}
            </div>
            <div className="text-xs text-neutral-500 mt-1">
              به‌ازای هر فرصت معتبر فروش
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
              "px-3 py-1.5 rounded-md text-xs font-medium transition-all active:scale-95 cursor-pointer whitespace-nowrap",
              selectedIntent === "all"
                ? "bg-[#222222] text-white"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-[#141414]"
            )}
          >
            همه موارد ({toPersianDigits(metrics.totalEvaluated)})
          </button>
          <button
            onClick={() => onSelectIntent("high_intent")}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-medium transition-all active:scale-95 cursor-pointer whitespace-nowrap flex items-center gap-1.5",
              selectedIntent === "high_intent"
                ? "bg-[#222222] text-[#00e599]"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-[#141414]"
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e599]" />
            <span>خرید قطعی ({toPersianDigits(metrics.highIntentCount)})</span>
          </button>
          <button
            onClick={() => onSelectIntent("problem_aware")}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-medium transition-all active:scale-95 cursor-pointer whitespace-nowrap flex items-center gap-1.5",
              selectedIntent === "problem_aware"
                ? "bg-[#222222] text-[#f5a623]"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-[#141414]"
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#f5a623]" />
            <span>دردمند ({toPersianDigits(metrics.problemAwareCount)})</span>
          </button>
          <button
            onClick={() => onSelectIntent("curious")}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-medium transition-all active:scale-95 cursor-pointer whitespace-nowrap flex items-center gap-1.5",
              selectedIntent === "curious"
                ? "bg-[#222222] text-[#0070f3]"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-[#141414]"
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#0070f3]" />
            <span>کنجکاو ({toPersianDigits(metrics.curiousCount)})</span>
          </button>
          <button
            onClick={() => onSelectIntent("irrelevant")}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-medium transition-all active:scale-95 cursor-pointer whitespace-nowrap flex items-center gap-1.5",
              selectedIntent === "irrelevant"
                ? "bg-[#222222] text-neutral-300"
                : "text-neutral-500 hover:text-neutral-300 hover:bg-[#141414]"
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
            <span>نویز و نامرتبط ({toPersianDigits(metrics.irrelevantCount)})</span>
          </button>
        </div>

        {/* Minimal Search input */}
        <div className="relative flex items-center min-w-[260px]">
          <SearchIcon className="w-3.5 h-3.5 text-neutral-500 absolute right-3 pointer-events-none" />
          <input
            type="text"
            placeholder="جستجو در پیام، فرستنده یا ویژگی..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-3 pr-9 py-1.5 rounded-md bg-[#000000] border border-[#262626] text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-white transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
