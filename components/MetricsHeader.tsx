"use client";

import React from "react";
import {
  HighIntentIcon,
  ProblemAwareIcon,
  NoiseIcon,
  SparklesIcon,
  CoinIcon,
  FilterIcon,
} from "./Icons";
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
    <div className="space-y-6">
      {/* 5 KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Card 1: Total Messages */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">کل پیام‌های رصدشده</span>
            <span className="p-1.5 rounded-lg bg-slate-800 text-slate-300">
              <SparklesIcon className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
              {metrics.totalMessages}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <span>{metrics.totalEvaluated} پیام پردازش‌شده</span>
            </div>
          </div>
        </div>

        {/* Card 2: Noise Filtered Ratio */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">حذف نویز و بی‌ربط</span>
            <span className="p-1.5 rounded-lg bg-slate-800 text-slate-400">
              <NoiseIcon className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-cyan-400 font-mono">
              {metrics.noiseFilteredPercent}%
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              <span>{metrics.noiseMessages} چت روزمره و هرزنامه فیلتر شد</span>
            </div>
          </div>
        </div>

        {/* Card 3: Qualified Leads */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-emerald-950/30 to-slate-900/80 border border-emerald-900/40 shadow-sm flex flex-col justify-between glow-emerald">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-medium">سرنخ‌های واجد شرایط (ICP)</span>
            <span className="p-1.5 rounded-lg bg-emerald-900/50 text-emerald-400 border border-emerald-800/40">
              <HighIntentIcon className="w-4 h-4 text-emerald-400" />
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-400 font-mono">
              {metrics.qualifiedLeads}
            </div>
            <div className="text-[11px] text-emerald-300/80 mt-1 flex items-center gap-2">
              <span>🔥 {metrics.highIntentCount} خرید فوری</span>
              <span>•</span>
              <span>⚠️ {metrics.problemAwareCount} دردمند</span>
            </div>
          </div>
        </div>

        {/* Card 4: Total Spend */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">هزینه کل پردازش هوش</span>
            <span className="p-1.5 rounded-lg bg-slate-800 text-amber-400">
              <CoinIcon className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-amber-400 font-mono">
              {formatUsd(metrics.totalSpendUsd)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              <span>معادل تقریبی {formatToman(metrics.estimatedTomanSpend)}</span>
            </div>
          </div>
        </div>

        {/* Card 5: Avg Cost Per Lead */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">بهای تمام‌شده هر سرنخ</span>
            <span className="p-1.5 rounded-lg bg-slate-800 text-teal-400">
              <SparklesIcon className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-teal-400 font-mono">
              {formatUsd(metrics.avgCostPerQualifiedLeadUsd)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              <span>در مقایسه با صدها هزار تومان بازاریابی سنتی</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
        {/* Intent level filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => onSelectIntent("all")}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors",
              selectedIntent === "all"
                ? "bg-slate-700 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            )}
          >
            همه موارد ({metrics.totalEvaluated})
          </button>
          <button
            onClick={() => onSelectIntent("high_intent")}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5",
              selectedIntent === "high_intent"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-emerald-400/80 hover:text-emerald-300 hover:bg-emerald-950/40"
            )}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>خرید قطعی ({metrics.highIntentCount})</span>
          </button>
          <button
            onClick={() => onSelectIntent("problem_aware")}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5",
              selectedIntent === "problem_aware"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-amber-400/80 hover:text-amber-300 hover:bg-amber-950/40"
            )}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>دردمند و ناراضی ({metrics.problemAwareCount})</span>
          </button>
          <button
            onClick={() => onSelectIntent("curious")}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5",
              selectedIntent === "curious"
                ? "bg-cyan-600 text-white shadow-sm"
                : "text-cyan-400/80 hover:text-cyan-300 hover:bg-cyan-950/40"
            )}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>کنجکاو ({metrics.curiousCount})</span>
          </button>
          <button
            onClick={() => onSelectIntent("irrelevant")}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5",
              selectedIntent === "irrelevant"
                ? "bg-slate-700 text-slate-200 shadow-sm"
                : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/40"
            )}
          >
            <span className="w-2 h-2 rounded-full bg-slate-500" />
            <span>نویز ({metrics.irrelevantCount})</span>
          </button>
        </div>

        {/* Search input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="جستجو در پیام، فرستنده یا ویژگی..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full sm:w-64 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
      </div>
    </div>
  );
}
