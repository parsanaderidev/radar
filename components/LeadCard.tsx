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
          label: "نویز",
          dotColor: "bg-neutral-600",
          textColor: "text-neutral-500",
          scoreBadge: "bg-neutral-900 text-neutral-500 border-neutral-800",
        };
    }
  };

  const getPlatformIcon = () => {
    switch (platform) {
      case "telegram":
        return <TelegramIcon className="w-3 h-3 text-[#229ed9]" />;
      case "bale":
        return <BaleIcon className="w-3 h-3 text-[#00e599]" />;
      case "twitter_x":
        return <TwitterXIcon className="w-3 h-3 text-neutral-300" />;
      case "forum":
      default:
        return <ForumIcon className="w-3 h-3 text-neutral-400" />;
    }
  };

  const intent = getIntentConfig();

  return (
    <div
      className={cn(
        "rounded-lg p-4 bg-[#0a0a0a] border border-[#1f1f1f] hover:border-[#333333] transition-all duration-150 space-y-3.5",
        lead.lead_status === "dismissed" && "opacity-40 grayscale"
      )}
    >
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Platform Tag */}
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-[#222222] bg-[#111111] text-[11px] font-mono text-neutral-300">
            {getPlatformIcon()}
            <span className="capitalize">{platform}</span>
          </span>

          {/* Author Handle */}
          <span className="font-mono text-xs text-neutral-300 dir-ltr bg-[#141414] border border-[#222222] px-2 py-0.5 rounded">
            {rawMsg?.author_handle || "@user"}
          </span>

          {/* Status indicators */}
          {lead.lead_status === "contacted" && (
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-blue-950/40 border border-blue-800/50 text-blue-400">
              Contacted
            </span>
          )}
          {lead.lead_status === "approved" && (
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-950/40 border border-emerald-800/50 text-emerald-400">
              Approved
            </span>
          )}
          {lead.lead_status === "dismissed" && (
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-neutral-900 border border-neutral-800 text-neutral-500">
              Dismissed
            </span>
          )}
        </div>

        {/* Intent Status & Score */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-[#222222] bg-[#111111] text-xs">
            <span className={cn("w-1.5 h-1.5 rounded-full", intent.dotColor)} />
            <span className={cn("font-medium", intent.textColor)}>{intent.label}</span>
          </div>

          <div
            className={cn(
              "px-2 py-0.5 rounded text-xs font-mono font-medium border",
              intent.scoreBadge
            )}
            title="Score out of 100"
          >
            {lead.intent_score}
          </div>
        </div>
      </div>

      {/* Message Content */}
      <div className="p-3 rounded-md bg-[#000000] border border-[#1a1a1a] space-y-2">
        <p className="text-sm leading-relaxed text-[#ededed] font-normal select-text">
          {rawMsg?.content}
        </p>

        {rawMsg?.thread_context && (
          <div className="pt-2 border-t border-[#1a1a1a] flex items-start gap-1.5 text-xs text-neutral-500 font-mono">
            <span className="text-neutral-600">context:</span>
            <span>{rawMsg.thread_context}</span>
          </div>
        )}
      </div>

      {/* AI Reasoning & Matched Feature */}
      {lead.reasoning && (
        <div className="space-y-1.5 text-xs">
          <div className="p-2.5 rounded-md bg-[#0d0d0d] border border-[#1a1a1a] text-neutral-300 flex items-start gap-2">
            <SparklesIcon className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <span className="text-neutral-400 font-semibold">تحلیل هوش: </span>
              <span>{lead.reasoning}</span>
            </p>
          </div>

          {lead.matched_feature && (
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-[#0d0d0d] border border-[#1a1a1a] text-xs">
              <span className="font-mono text-neutral-500">ویژگی منطبق:</span>
              <span className="text-neutral-300">{lead.matched_feature}</span>
            </div>
          )}
        </div>
      )}

      {/* Vercel-style Suggested Reply Box */}
      {lead.suggested_reply && lead.intent_level !== "irrelevant" && (
        <div className="rounded-md bg-[#000000] border border-[#1f1f1f] overflow-hidden">
          <div className="flex items-center justify-between px-3 py-1.5 bg-[#0d0d0d] border-b border-[#1f1f1f] text-xs">
            <span className="font-mono text-[11px] text-neutral-400">
              suggested_response
            </span>

            <button
              onClick={handleCopy}
              className={cn(
                "h-6 px-2 rounded text-[11px] font-mono transition-colors flex items-center gap-1 border",
                copied
                  ? "bg-[#00e599] text-black border-[#00e599]"
                  : "bg-[#141414] hover:bg-[#1f1f1f] text-neutral-300 border-[#262626]"
              )}
            >
              <CopyIcon className="w-3 h-3" />
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>

          <div className="p-3 text-xs sm:text-sm text-neutral-200 leading-relaxed whitespace-pre-line select-text font-light">
            {lead.suggested_reply}
          </div>
        </div>
      )}

      {/* Footer: Token Ledger & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#1a1a1a]">
        {/* Token and micro-cost badge */}
        <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-500">
          <CpuIcon className="w-3 h-3 text-neutral-600" />
          <span>{lead.input_tokens || 0} in / {lead.output_tokens || 0} out</span>
          <span>•</span>
          <span className="text-neutral-300 font-medium">
            {formatUsd(lead.estimated_cost_usd || 0)}
          </span>
        </div>

        {/* Workflow Action Buttons */}
        <div className="flex items-center gap-1.5">
          {lead.lead_status !== "contacted" && (
            <button
              onClick={() => handleStatusChange("contacted")}
              disabled={isUpdating}
              className="h-7 px-2.5 rounded text-xs font-medium bg-[#141414] hover:bg-[#1f1f1f] border border-[#262626] text-neutral-200 transition-colors flex items-center gap-1"
            >
              <CheckCircleIcon className="w-3 h-3 text-[#0070f3]" />
              <span>ارتباط برقرار شد</span>
            </button>
          )}

          {lead.lead_status !== "approved" && lead.lead_status !== "contacted" && (
            <button
              onClick={() => handleStatusChange("approved")}
              disabled={isUpdating}
              className="h-7 px-2.5 rounded text-xs font-medium bg-[#141414] hover:bg-[#1f1f1f] border border-[#262626] text-neutral-200 transition-colors flex items-center gap-1"
            >
              <span>تأیید</span>
            </button>
          )}

          {lead.lead_status !== "dismissed" && (
            <button
              onClick={() => handleStatusChange("dismissed")}
              disabled={isUpdating}
              className="h-7 px-2 rounded text-xs text-neutral-500 hover:text-neutral-300 transition-colors flex items-center gap-1"
            >
              <XCircleIcon className="w-3 h-3" />
              <span>رد</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
