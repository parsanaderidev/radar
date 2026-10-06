"use client";

import React from "react";
import { SearchIcon } from "./Icons";
import {
  toPersianDigits,
  formatPersianToman,
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
        {/* Card 1: Total Messages (Clickable: resets filter to All - Hero Tile on mobile) */}
        <div
          onClick={() => onSelectIntent("all")}
          className={cn(
            "col-span-2 sm:col-span-1 p-3.5 sm:p-4 rounded-lg bg-[#0a0a0a] border-2 hover:bg-[#0d0d0d] hover:-translate-y-1 hover:shadow-[0_12px_28px_-4px_rgba(0,0,0,0.7)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu flex flex-col justify-between cursor-pointer active:scale-[0.985]",
            selectedIntent === "all" ? "border-white/60" : "border-[#333333]"
          )}
          title="مشاهده همه پیام‌های دریافتی"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-medium">
              کل پیام‌های دریافتی
            </span>
            {selectedIntent === "all" && (
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            )}
          </div>
          <div className="mt-2.5 sm:mt-3">
            <div className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white">
              {toPersianDigits(metrics.totalMessages)}
            </div>
            <div className="text-[11px] sm:text-xs text-neutral-500 mt-1">
              {toPersianDigits(metrics.totalEvaluated)} پیام ارزیابی‌شده
            </div>
          </div>
        </div>

        {/* Card 2: Noise Filtered Ratio (Clickable: filters to Irrelevant) */}
        <div
          onClick={() => onSelectIntent("irrelevant")}
          className={cn(
            "col-span-1 p-3.5 sm:p-4 rounded-lg bg-[#0a0a0a] border hover:border-[#333333] hover:bg-[#0d0d0d] hover:-translate-y-1 hover:shadow-[0_12px_28px_-4px_rgba(0,0,0,0.7)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu flex flex-col justify-between cursor-pointer active:scale-[0.985]",
            selectedIntent === "irrelevant" ? "border-neutral-400 ring-1 ring-neutral-400/20" : "border-[#1f1f1f]"
          )}
          title="مشاهده پیام‌های فیلترشده نویز و نامرتبط"
        >
          <div className="flex items-center justify-between gap-1.5">
            <span className="text-xs text-neutral-400 font-medium truncate">
              نرخ حذف نویز
            </span>
            <span className="text-[10px] px-1.5 sm:px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 font-medium shrink-0">
              فیلتر
            </span>
          </div>
          <div className="mt-2.5 sm:mt-3">
            <div className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white flex items-baseline gap-1">
              <span>{toPersianDigits(metrics.noiseFilteredPercent)}</span>
              <span className="text-sm sm:text-base text-neutral-400 font-normal">٪</span>
            </div>
            <div className="text-[11px] sm:text-xs text-neutral-500 mt-1 truncate">
              {toPersianDigits(metrics.noiseMessages)} پیام نامرتبط
            </div>
          </div>
        </div>

        {/* Card 3: Qualified Leads (Clickable: filters to High Intent) */}
        <div
          onClick={() => onSelectIntent("high_intent")}
          className={cn(
            "col-span-1 p-3.5 sm:p-4 rounded-lg bg-[#0a0a0a] border hover:border-[#333333] hover:bg-[#0d0d0d] hover:-translate-y-1 hover:shadow-[0_12px_28px_-4px_rgba(0,0,0,0.7)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu flex flex-col justify-between relative overflow-hidden cursor-pointer active:scale-[0.985]",
            selectedIntent === "high_intent" ? "border-[#00e599]/60 ring-1 ring-[#00e599]/20" : "border-[#1f1f1f]"
          )}
          title="مشاهده سرنخ‌های واجد شرایط خرید قطعی"
        >
          <div className="flex items-center justify-between gap-1.5">
            <span className="text-xs text-neutral-400 font-medium truncate">
              سرنخ‌های واجد شرایط (ICP)
            </span>
            <span className="flex h-2 w-2 rounded-full bg-[#00e599] shadow-[0_0_8px_rgba(0,229,153,0.6)] animate-pulse-glow shrink-0" />
          </div>
          <div className="mt-2.5 sm:mt-3">
            <div className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#00e599]">
              {toPersianDigits(metrics.qualifiedLeads)}
            </div>
            <div className="text-[11px] sm:text-xs text-neutral-400 mt-1 flex items-center gap-1 flex-wrap">
              <span className="text-[#00e599] font-medium">{toPersianDigits(metrics.highIntentCount)} قطعی</span>
              <span className="text-neutral-600 px-0.5">•</span>
              <span className="text-[#f5a623] font-medium">{toPersianDigits(metrics.problemAwareCount)} دردمند</span>
            </div>
          </div>
        </div>

        {/* Card 4: Problem-Aware Leads & Total Spend (Clickable: filters to Problem Aware) */}
        <div
          onClick={() => onSelectIntent("problem_aware")}
          className={cn(
            "col-span-1 p-3.5 sm:p-4 rounded-lg bg-[#0a0a0a] border hover:border-[#333333] hover:bg-[#0d0d0d] hover:-translate-y-1 hover:shadow-[0_12px_28px_-4px_rgba(0,0,0,0.7)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu flex flex-col justify-between cursor-pointer active:scale-[0.985]",
            selectedIntent === "problem_aware" ? "border-[#f5a623]/60 ring-1 ring-[#f5a623]/20" : "border-[#1f1f1f]"
          )}
          title="مشاهده پیام‌های کاربران دردمند و ناراضی"
        >
          <div className="flex items-center justify-between gap-1">
            <span className="text-xs text-neutral-400 font-medium truncate">
              هزینه پردازش هوش
            </span>
            <span className="text-[10px] text-[#f5a623] opacity-80 shrink-0">دردمند ↵</span>
          </div>
          <div className="mt-2.5 sm:mt-3">
            <div className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white truncate">
              {formatPersianToman(metrics.estimatedTomanSpend)}
            </div>
            <div className="text-[11px] sm:text-xs text-neutral-500 mt-1 truncate">
              مجموع مصرف توکن‌ها
            </div>
          </div>
        </div>

        {/* Card 5: Curious Leads & Avg Cost Per Lead (Clickable: filters to Curious) */}
        <div
          onClick={() => onSelectIntent("curious")}
          className={cn(
            "col-span-1 p-3.5 sm:p-4 rounded-lg bg-[#0a0a0a] border hover:border-[#333333] hover:bg-[#0d0d0d] hover:-translate-y-1 hover:shadow-[0_12px_28px_-4px_rgba(0,0,0,0.7)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu flex flex-col justify-between cursor-pointer active:scale-[0.985]",
            selectedIntent === "curious" ? "border-[#0070f3]/60 ring-1 ring-[#0070f3]/20" : "border-[#1f1f1f]"
          )}
          title="مشاهده پیام‌های کاربران کنجکاو"
        >
          <div className="flex items-center justify-between gap-1">
            <span className="text-xs text-neutral-400 font-medium truncate">
              هزینه به‌ازای هر سرنخ
            </span>
            <span className="text-[10px] text-[#0070f3] opacity-80 shrink-0">کنجکاو ↵</span>
          </div>
          <div className="mt-2.5 sm:mt-3">
            <div className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white truncate">
              {formatMessageCostToman(metrics.avgCostPerQualifiedLeadUsd)}
            </div>
            <div className="text-[11px] sm:text-xs text-neutral-500 mt-1 truncate">
              به‌ازای هر فرصت فروش
            </div>
          </div>
        </div>
      </div>

      {/* Vercel-style Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 p-2 rounded-lg bg-[#0a0a0a] border border-[#1f1f1f] transition-colors duration-200">
        {/* Intent level filter tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1.5 md:pb-0 no-scrollbar scrollbar-none flex-nowrap -mx-0.5 px-0.5">
          <button
            onClick={() => onSelectIntent("all")}
            className={cn(
              "px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ease-out active:scale-95 cursor-pointer whitespace-nowrap shrink-0",
              selectedIntent === "all"
                ? "bg-[#222222] text-white shadow-sm"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-[#141414]"
            )}
          >
            همه موارد ({toPersianDigits(metrics.totalEvaluated)})
          </button>
          <button
            onClick={() => onSelectIntent("high_intent")}
            className={cn(
              "px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ease-out active:scale-95 cursor-pointer whitespace-nowrap flex items-center gap-1.5 shrink-0",
              selectedIntent === "high_intent"
                ? "bg-[#222222] text-[#00e599] shadow-sm"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-[#141414]"
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e599] shrink-0" />
            <span>خرید قطعی ({toPersianDigits(metrics.highIntentCount)})</span>
          </button>
          <button
            onClick={() => onSelectIntent("problem_aware")}
            className={cn(
              "px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ease-out active:scale-95 cursor-pointer whitespace-nowrap flex items-center gap-1.5 shrink-0",
              selectedIntent === "problem_aware"
                ? "bg-[#222222] text-[#f5a623] shadow-sm"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-[#141414]"
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#f5a623] shrink-0" />
            <span>دردمند ({toPersianDigits(metrics.problemAwareCount)})</span>
          </button>
          <button
            onClick={() => onSelectIntent("curious")}
            className={cn(
              "px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ease-out active:scale-95 cursor-pointer whitespace-nowrap flex items-center gap-1.5 shrink-0",
              selectedIntent === "curious"
                ? "bg-[#222222] text-[#0070f3] shadow-sm"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-[#141414]"
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#0070f3] shrink-0" />
            <span>کنجکاو ({toPersianDigits(metrics.curiousCount)})</span>
          </button>
          <button
            onClick={() => onSelectIntent("irrelevant")}
            className={cn(
              "px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ease-out active:scale-95 cursor-pointer whitespace-nowrap flex items-center gap-1.5 shrink-0",
              selectedIntent === "irrelevant"
                ? "bg-[#222222] text-neutral-300 shadow-sm"
                : "text-neutral-500 hover:text-neutral-300 hover:bg-[#141414]"
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-600 shrink-0" />
            <span>نویز و نامرتبط ({toPersianDigits(metrics.irrelevantCount)})</span>
          </button>
        </div>

        {/* Minimal Search input */}
        <div className="relative flex items-center w-full md:w-auto md:min-w-[260px]">
          <SearchIcon className="w-3.5 h-3.5 text-neutral-500 absolute right-3 pointer-events-none transition-colors" />
          <input
            type="text"
            placeholder="جستجو در پیام، فرستنده یا ویژگی..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-3 pr-9 py-1.5 rounded-md bg-[#000000] border border-[#262626] text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-white input-smooth"
          />
        </div>
      </div>
    </div>
  );
}
