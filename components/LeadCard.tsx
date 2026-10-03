"use client";

import React, { useState } from "react";
import {
  HighIntentIcon,
  ProblemAwareIcon,
  NoiseIcon,
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
import { formatUsd } from "../lib/pricing";
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

  // Determine intent styling
  const getIntentBadge = () => {
    switch (lead.intent_level) {
      case "high_intent":
        return {
          label: "قصد خرید قطعی (High Intent)",
          badgeBg: "bg-emerald-950/70 border-emerald-500/40 text-emerald-300",
          scoreBg: "bg-emerald-500 text-black",
          borderHover: "hover:border-emerald-500/40",
          icon: <HighIntentIcon className="w-3.5 h-3.5 text-emerald-400" />,
        };
      case "problem_aware":
        return {
          label: "دردمند و ناراضی (Problem Aware)",
          badgeBg: "bg-amber-950/70 border-amber-500/40 text-amber-300",
          scoreBg: "bg-amber-500 text-black",
          borderHover: "hover:border-amber-500/40",
          icon: <ProblemAwareIcon className="w-3.5 h-3.5 text-amber-400" />,
        };
      case "curious":
        return {
          label: "کنجکاو و پرسشگر (Curious)",
          badgeBg: "bg-cyan-950/70 border-cyan-500/40 text-cyan-300",
          scoreBg: "bg-cyan-500 text-black",
          borderHover: "hover:border-cyan-500/40",
          icon: <SparklesIcon className="w-3.5 h-3.5 text-cyan-400" />,
        };
      case "irrelevant":
      default:
        return {
          label: "نویز / بی‌ربط (Noise)",
          badgeBg: "bg-slate-900 border-slate-700 text-slate-400",
          scoreBg: "bg-slate-700 text-slate-300",
          borderHover: "hover:border-slate-700",
          icon: <NoiseIcon className="w-3.5 h-3.5 text-slate-400" />,
        };
    }
  };

  const getPlatformIcon = () => {
    switch (platform) {
      case "telegram":
        return <TelegramIcon className="w-3.5 h-3.5 text-sky-400" />;
      case "bale":
        return <BaleIcon className="w-3.5 h-3.5 text-emerald-400" />;
      case "twitter_x":
        return <TwitterXIcon className="w-3.5 h-3.5 text-slate-300" />;
      case "forum":
      default:
        return <ForumIcon className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  const intent = getIntentBadge();

  return (
    <div
      className={cn(
        "rounded-2xl p-4 sm:p-5 bg-slate-900/70 border transition-all duration-200 space-y-4",
        lead.intent_level === "high_intent"
          ? "border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 via-slate-900/80 to-slate-900/80 glow-emerald"
          : lead.intent_level === "problem_aware"
          ? "border-amber-500/20 bg-gradient-to-br from-amber-950/15 via-slate-900/80 to-slate-900/80"
          : "border-slate-800 hover:border-slate-700",
        lead.lead_status === "dismissed" && "opacity-50 grayscale hover:grayscale-0",
        intent.borderHover
      )}
    >
      {/* Top Header: Author, Platform, Intent Level & Score */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          {/* Platform Badge */}
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700/60 text-xs font-medium text-slate-300">
            {getPlatformIcon()}
            <span className="capitalize">{platform}</span>
          </span>

          {/* Author Handle */}
          <span className="font-mono text-xs text-slate-300 dir-ltr bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/40">
            {rawMsg?.author_handle || "@anonymous"}
          </span>

          {/* Lead Status Pill */}
          {lead.lead_status === "contacted" && (
            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-900/40 border border-blue-700/50 text-blue-300">
              ارتباط برقرار شد
            </span>
          )}
          {lead.lead_status === "approved" && (
            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-900/40 border border-emerald-700/50 text-emerald-300">
              تأییدشده
            </span>
          )}
          {lead.lead_status === "dismissed" && (
            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 border border-slate-700 text-slate-400">
              نادیده گرفته شد
            </span>
          )}
        </div>

        {/* Intent Score & Badge */}
        <div className="flex items-center gap-2">
          <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold", intent.badgeBg)}>
            {intent.icon}
            <span>{intent.label}</span>
          </div>

          <div
            className={cn(
              "flex items-center justify-center px-2 py-0.5 rounded-lg text-xs font-mono font-bold tracking-tight",
              intent.scoreBg
            )}
            title="نمره هوش مصنوعی از ۱۰۰"
          >
            {lead.intent_score}/100
          </div>
        </div>
      </div>

      {/* Raw Community Message Content */}
      <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
        <p className="text-sm sm:text-base leading-relaxed text-slate-100 font-normal select-text">
          {rawMsg?.content}
        </p>

        {rawMsg?.thread_context && (
          <div className="pt-2 mt-2 border-t border-slate-800/60 flex items-start gap-1.5 text-xs text-slate-400">
            <span className="text-slate-500 font-medium">زمینه تاپیک:</span>
            <span className="italic">{rawMsg.thread_context}</span>
          </div>
        )}
      </div>

      {/* AI Intelligence Analysis & Reasoning */}
      {lead.reasoning && (
        <div className="space-y-2 text-xs">
          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 text-slate-300">
            <SparklesIcon className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <span className="font-semibold text-slate-200">تحلیل هوش مصنوعی: </span>
              <span className="leading-relaxed">{lead.reasoning}</span>
            </div>
          </div>

          {/* Matched Feature Pill */}
          {lead.matched_feature && (
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-teal-950/30 border border-teal-800/40 text-teal-300 text-xs">
              <span className="font-semibold">ویژگی منطبق با چالش:</span>
              <span className="text-teal-200">{lead.matched_feature}</span>
            </div>
          )}
        </div>
      )}

      {/* Suggested Contextual Reply Box */}
      {lead.suggested_reply && lead.intent_level !== "irrelevant" && (
        <div className="p-3 rounded-xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800/90 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <span>پیش‌نویس پاسخ متناسب با لحن نویسنده (بدون حالت تبلیغاتی اسپم)</span>
            </span>

            <button
              onClick={handleCopy}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5",
                copied
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300"
              )}
            >
              <CopyIcon className="w-3.5 h-3.5" />
              <span>{copied ? "کپی شد!" : "کپی پاسخ"}</span>
            </button>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/90 border border-slate-800/60 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line select-text font-light">
            {lead.suggested_reply}
          </div>
        </div>
      )}

      {/* Bottom Footer: Token Cost Ledger & Workflow Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/60">
        {/* Token and micro-cost badge */}
        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
          <CpuIcon className="w-3.5 h-3.5 text-slate-500" />
          <span>
            {lead.input_tokens || 0} in / {lead.output_tokens || 0} out
          </span>
          <span>•</span>
          <span className="text-amber-400 font-semibold">
            {formatUsd(lead.estimated_cost_usd || 0)}
          </span>
        </div>

        {/* Workflow Action Buttons */}
        <div className="flex items-center gap-2">
          {lead.lead_status !== "contacted" && (
            <button
              onClick={() => handleStatusChange("contacted")}
              disabled={isUpdating}
              className="px-2.5 py-1 rounded-lg bg-blue-950/60 hover:bg-blue-900/70 border border-blue-700/50 text-blue-300 text-xs font-medium transition-colors flex items-center gap-1"
            >
              <CheckCircleIcon className="w-3.5 h-3.5" />
              <span>ارتباط برقرار شد</span>
            </button>
          )}

          {lead.lead_status !== "approved" && lead.lead_status !== "contacted" && (
            <button
              onClick={() => handleStatusChange("approved")}
              disabled={isUpdating}
              className="px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/70 border border-emerald-700/50 text-emerald-300 text-xs font-medium transition-colors flex items-center gap-1"
            >
              <span>تأیید سرنخ</span>
            </button>
          )}

          {lead.lead_status !== "dismissed" && (
            <button
              onClick={() => handleStatusChange("dismissed")}
              disabled={isUpdating}
              className="px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-400 hover:text-slate-300 text-xs transition-colors flex items-center gap-1"
            >
              <XCircleIcon className="w-3.5 h-3.5" />
              <span>نادیده گرفتن</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
