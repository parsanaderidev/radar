"use client";

import React, { useEffect, useRef } from "react";
import { AssistantMessage, AssistantStatus } from "./types";
import { AssistantSuggestions } from "./AssistantSuggestions";
import { RadarLogo, RefreshIcon, XCircleIcon } from "@/components/Icons";

interface AssistantMessagesProps {
  messages: AssistantMessage[];
  status: AssistantStatus;
  errorMessage?: string | null;
  onSelectSuggestion: (question: string) => void;
  onRetry?: () => void;
}

export function AssistantMessages({
  messages,
  status,
  errorMessage,
  onSelectSuggestion,
  onRetry,
}: AssistantMessagesProps) {
  const scrollEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  const isEmpty = messages.length === 0;

  return (
    <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-4 no-scrollbar">
      {/* Initial Empty State with Introduction & Suggestions */}
      {isEmpty && (
        <div className="space-y-4 animate-fade-in">
          {/* Welcome Card */}
          <div className="p-3.5 rounded-xl bg-[#111111] border border-[#222222] space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-white text-black flex items-center justify-center shadow-sm">
                <RadarLogo className="w-3.5 h-3.5 text-black" />
              </div>
              <h2 className="text-xs font-semibold text-white">سلام، من دستیار هوشمند رادار هستم</h2>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              می‌توانید درباره قابلیت‌های رادار، سرنخ‌های جاری، نحوه تریاژ نیت خرید یا داده‌های فضای کاری خود سوال بپرسید.
            </p>
          </div>

          {/* Suggested Clickable Questions */}
          <AssistantSuggestions
            onSelectSuggestion={onSelectSuggestion}
            disabled={status === "thinking"}
          />
        </div>
      )}

      {/* Render Conversation Messages */}
      {messages.map((msg) => {
        const isUser = msg.role === "user";
        return (
          <div
            key={msg.id}
            className={`flex flex-col ${isUser ? "items-start" : "items-end"} animate-fade-in`}
          >
            <div
              className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-wrap transition-all ${
                isUser
                  ? "bg-white text-black rounded-tr-sm shadow-sm"
                  : "bg-[#141414] border border-[#262626] text-neutral-200 rounded-tl-sm shadow-sm"
              }`}
            >
              {!isUser && (
                <div className="flex items-center gap-1.5 mb-1.5 pb-1 border-b border-[#222222] text-[10px] text-neutral-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00e599]" />
                  <span>پاسخ دستیار رادار</span>
                </div>
              )}
              <div>{msg.content}</div>
            </div>
            <span className="text-[10px] text-neutral-500 mt-1 px-1">
              {new Date(msg.timestamp).toLocaleTimeString("fa-IR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        );
      })}

      {/* Thinking State Indicator */}
      {status === "thinking" && (
        <div className="flex flex-col items-end animate-fade-in">
          <div className="max-w-[90%] rounded-2xl rounded-tl-sm px-3.5 py-2.5 bg-[#141414] border border-[#262626] text-xs text-neutral-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00e599] animate-ping" />
            <span>در حال تحلیل و استخراج پاسخ از رادار...</span>
            <RefreshIcon className="w-3.5 h-3.5 animate-spin text-neutral-400" />
          </div>
        </div>
      )}

      {/* Error State with Retry Button */}
      {status === "error" && (
        <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs space-y-2 animate-shake">
          <div className="flex items-center gap-2">
            <XCircleIcon className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="font-medium">
              {errorMessage || "خطا در برقراری ارتباط با سرویس دستیار رادار"}
            </span>
          </div>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="text-[11px] underline hover:text-white transition-colors cursor-pointer"
            >
              تلاش مجدد برای دریافت پاسخ
            </button>
          )}
        </div>
      )}

      <div ref={scrollEndRef} />
    </div>
  );
}
