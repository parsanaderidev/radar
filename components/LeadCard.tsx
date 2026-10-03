"use client";

import React, { useState } from "react";
import {
  CopyIcon,
  CheckCircleIcon,
  XCircleIcon,
  TelegramIcon,
  BaleIcon,
  TwitterXIcon,
  ForumIcon,
  SparklesIcon,
  CpuIcon,
} from "./Icons";
import { toPersianDigits, formatMessageCostToman, formatPersianUsd } from "../lib/pricing";
import { cn } from "../lib/cn";
import type { LeadRecord } from "../lib/pocketbase";

interface LeadCardProps {
  lead: LeadRecord;
  onUpdateStatus: (leadId: string, status: "new" | "approved" | "contacted" | "dismissed") => Promise<void>;
}

export function LeadCard({ lead, onUpdateStatus }: LeadCardProps) {
  const [copied, setCopied] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const rawMsg = lead.expand?.raw_message_id;
  const platform = rawMsg?.expand?.source_id?.platform || "telegram";

  const handleCopy = async () => {
    if (!lead.suggested_reply) return;
    try {
      await navigator.clipboard.writeText(lead.suggested_reply);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Failed to copy", e);
    }
  };

  const handleStatusChange = async (status: "new" | "approved" | "contacted" | "dismissed") => {
    setIsUpdating(true);
    try {
      await onUpdateStatus(lead.id, status);
    } finally {
      setIsUpdating(false);
    }
  };

  // Vercel-style clean status dot & badge
  const getIntentConfig = () => {
    switch (lead.intent_level) {
      case "high_intent":
        return {
          label: "خرید قطعی",
          dotColor: "bg-[#00e599] shadow-[0_0_8px_rgba(0,229,153,0.4)]",
          textColor: "text-[#00e599]",
          scoreBadge: "bg-[#00e599]/10 text-[#00e599] border-[#00e599]/30",
        };
      case "problem_aware":
        return {
          label: "دردمند و ناراضی",
          dotColor: "bg-[#f5a623] shadow-[0_0_8px_rgba(245,166,35,0.4)]",
          textColor: "text-[#f5a623]",
          scoreBadge: "bg-[#f5a623]/10 text-[#f5a623] border-[#f5a623]/30",
        };
      case "curious":
        return {
          label: "کنجکاو",
          dotColor: "bg-[#0070f3]",
          textColor: "text-[#0070f3]",
          scoreBadge: "bg-[#0070f3]/10 text-[#0070f3] border-[#0070f3]/30",
        };
      case "irrelevant":
      default:
        return {
          label: "نویز و نامرتبط",
          dotColor: "bg-neutral-600",
          textColor: "text-neutral-500",
          scoreBadge: "bg-neutral-900 text-neutral-500 border-neutral-800",
        };
    }
  };

  const getPlatformInfo = () => {
    switch (platform) {
      case "telegram":
        return {
          name: "تلگرام",
          icon: <TelegramIcon className="w-3.5 h-3.5 text-[#229ed9]" />,
        };
      case "bale":
        return {
          name: "بله",
          icon: <BaleIcon className="w-3.5 h-3.5 text-[#00e599]" />,
        };
      case "twitter_x":
        return {
          name: "توییتر (X)",
          icon: <TwitterXIcon className="w-3.5 h-3.5 text-neutral-300" />,
        };
      case "forum":
      default:
        return {
          name: "انجمن گفتگو",
          icon: <ForumIcon className="w-3.5 h-3.5 text-neutral-400" />,
        };
    }
  };

  const intent = getIntentConfig();
  const platformInfo = getPlatformInfo();

  return (
    <div
      className={cn(
        "rounded-lg p-4 bg-[#0a0a0a] border border-[#1f1f1f] hover:border-[#333333] transition-all duration-200 space-y-3.5 animate-card-in hover:shadow-[0_4px_24px_rgba(0,0,0,0.6)]",
        lead.lead_status === "dismissed" && "opacity-45 grayscale"
      )}
    >
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Platform Tag */}
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[#222222] bg-[#111111] text-xs text-neutral-300 font-medium">
            {platformInfo.icon}
            <span>{platformInfo.name}</span>
          </span>

          {/* Author Handle */}
          <span className="text-xs text-neutral-300 dir-ltr bg-[#141414] border border-[#222222] px-2 py-0.5 rounded-md">
            {rawMsg?.author_handle || "@کاربر"}
          </span>

          {/* Status indicators */}
          {lead.lead_status === "contacted" && (
            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-950/40 border border-blue-800/50 text-blue-400">
              تماس برقرار شد
            </span>
          )}
          {lead.lead_status === "approved" && (
            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-950/40 border border-emerald-800/50 text-emerald-400">
              تأیید شده
            </span>
          )}
          {lead.lead_status === "dismissed" && (
            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-neutral-900 border border-neutral-800 text-neutral-500">
              رد شده
            </span>
          )}
        </div>

        {/* Intent Status & Score */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#222222] bg-[#111111] text-xs">
            <span className={cn("w-1.5 h-1.5 rounded-full", intent.dotColor)} />
            <span className={cn("font-medium", intent.textColor)}>{intent.label}</span>
          </div>

          <div
            className={cn(
              "px-2.5 py-0.5 rounded-md text-xs font-semibold border flex items-center gap-1.5",
              intent.scoreBadge
            )}
            title="امتیاز هوش از ۱۰۰"
          >
            <span className="text-[10px] text-neutral-400 font-normal">امتیاز:</span>
            <span>{toPersianDigits(lead.intent_score)}</span>
          </div>
        </div>
      </div>

      {/* Message Content */}
      <div className="p-3.5 rounded-md bg-[#000000] border border-[#1a1a1a] space-y-2">
        <p className="text-sm leading-relaxed text-[#ededed] font-normal select-text">
          {rawMsg?.content}
        </p>

        {rawMsg?.thread_context && (
          <div className="pt-2 border-t border-[#1a1a1a] flex items-start gap-1.5 text-xs text-neutral-500">
            <span className="text-neutral-400 font-medium">زمینه گفتگو:</span>
            <span className="text-neutral-300">{rawMsg.thread_context}</span>
          </div>
        )}
      </div>

      {/* AI Reasoning & Matched Feature */}
      {lead.reasoning && (
        <div className="space-y-1.5 text-xs">
          <div className="p-2.5 rounded-md bg-[#0d0d0d] border border-[#1a1a1a] text-neutral-300 flex items-start gap-2">
            <SparklesIcon className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <span className="text-neutral-400 font-semibold">تحلیل هوش مصنوعی: </span>
              <span>{lead.reasoning}</span>
            </p>
          </div>

          {lead.matched_feature && (
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-[#0d0d0d] border border-[#1a1a1a] text-xs">
              <span className="text-neutral-400 font-medium">ویژگی منطبق با محصول:</span>
              <span className="text-neutral-200 font-medium">{lead.matched_feature}</span>
            </div>
          )}
        </div>
      )}

      {/* Vercel-style Suggested Reply Box */}
      {lead.suggested_reply && lead.intent_level !== "irrelevant" && (
        <div className="rounded-md bg-[#000000] border border-[#1f1f1f] overflow-hidden">
          <div className="flex items-center justify-between px-3 py-1.5 bg-[#0d0d0d] border-b border-[#1f1f1f] text-xs">
            <span className="text-[11px] font-medium text-neutral-400 flex items-center gap-1.5">
              <SparklesIcon className="w-3 h-3 text-[#00e599]" />
              <span>پاسخ پیشنهادی هوش مصنوعی</span>
            </span>

            <button
              onClick={handleCopy}
              className={cn(
                "h-6 px-2.5 rounded text-[11px] font-medium transition-all active:scale-95 flex items-center gap-1 border cursor-pointer",
                copied
                  ? "bg-[#00e599] text-black border-[#00e599] scale-105"
                  : "bg-[#141414] hover:bg-[#1f1f1f] text-neutral-300 border-[#262626]"
              )}
            >
              {copied ? (
                <CheckCircleIcon className="w-3 h-3 text-black" />
              ) : (
                <CopyIcon className="w-3 h-3" />
              )}
              <span>{copied ? "کپی شد!" : "کپی متن"}</span>
            </button>
          </div>

          <div className="p-3 text-xs sm:text-sm text-neutral-200 leading-relaxed whitespace-pre-line select-text font-normal">
            {lead.suggested_reply}
          </div>
        </div>
      )}

      {/* Footer: Token Ledger & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#1a1a1a]">
        {/* Token and micro-cost badge in Persian */}
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <CpuIcon className="w-3.5 h-3.5 text-neutral-500" />
          <span>
            {toPersianDigits(lead.input_tokens || 0)} توکن ورودی / {toPersianDigits(lead.output_tokens || 0)} خروجی
          </span>
          <span className="text-neutral-600 px-1">•</span>
          <span className="text-neutral-300 font-medium">
            {formatMessageCostToman(lead.estimated_cost_usd || 0)}
          </span>
          <span className="text-neutral-600 text-[11px]">
            ({formatPersianUsd(lead.estimated_cost_usd || 0)})
          </span>
        </div>

        {/* Workflow Action Buttons */}
        <div className="flex items-center gap-1.5">
          {lead.lead_status !== "contacted" && (
            <button
              onClick={() => handleStatusChange("contacted")}
              disabled={isUpdating}
              className="h-7 px-2.5 rounded-md text-xs font-medium bg-[#141414] hover:bg-[#1f1f1f] border border-[#262626] text-neutral-200 transition-all active:scale-95 flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CheckCircleIcon className="w-3.5 h-3.5 text-[#0070f3]" />
              <span>ارتباط برقرار شد</span>
            </button>
          )}

          {lead.lead_status !== "approved" && lead.lead_status !== "contacted" && (
            <button
              onClick={() => handleStatusChange("approved")}
              disabled={isUpdating}
              className="h-7 px-2.5 rounded-md text-xs font-medium bg-[#141414] hover:bg-[#1f1f1f] border border-[#262626] text-neutral-200 transition-all active:scale-95 flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span>تأیید سرنخ</span>
            </button>
          )}

          {lead.lead_status !== "dismissed" && (
            <button
              onClick={() => handleStatusChange("dismissed")}
              disabled={isUpdating}
              className="h-7 px-2.5 rounded-md text-xs text-neutral-500 hover:text-neutral-300 hover:bg-[#111111] transition-all active:scale-95 flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              <XCircleIcon className="w-3.5 h-3.5" />
              <span>رد کردن</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
