"use client";

import React, { useEffect, useRef } from "react";
import { AssistantMessage, AssistantStatus } from "./types";
import { AssistantSuggestions } from "./AssistantSuggestions";
import { XCircleIcon } from "@/components/Icons";

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
    <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3.5 no-scrollbar">
      {/* Initial Empty State with Minimal Introduction & Suggestions */}
      {isEmpty && (
        <div className="space-y-3 animate-fade-in">
          <div className="space-y-1 pb-3 border-b border-[#1a1a1a]">
            <div className="text-xs font-semibold text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span>دستیار هوشمند رادار</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              پاسخگوی سوالات شما درباره سرنخ‌ها، نحوه تریاژ نیت خرید و قابلیت‌های فضای کاری رادار.
            </p>
          </div>

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
                  ? "bg-white text-black font-medium rounded-tr-sm shadow-sm"
                  : "bg-[#121212] border border-[#222222] text-neutral-200 rounded-tl-sm shadow-sm"
              }`}
            >
              {!isUser && (
                <div className="flex items-center gap-1.5 mb-1.5 pb-1 border-b border-[#1c1c1c] text-[10px] text-neutral-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
                  <span>دستیار رادار</span>
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

      {/* Thinking State Indicator (Minimal Monochrome) */}
      {status === "thinking" && (
        <div className="flex flex-col items-end animate-fade-in">
          <div className="max-w-[90%] rounded-2xl rounded-tl-sm px-3.5 py-2 bg-[#121212] border border-[#222222] text-xs text-neutral-300 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>در حال تحلیل و بررسی...</span>
          </div>
        </div>
      )}

      {/* Error State with Retry Button */}
      {status === "error" && (
        <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-900/50 text-rose-300 text-xs space-y-1.5 animate-shake">
          <div className="flex items-center gap-2">
            <XCircleIcon className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="font-medium">
              {errorMessage || "خطا در دریافت پاسخ دستیار"}
            </span>
          </div>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="text-[11px] underline hover:text-white transition-colors cursor-pointer"
            >
              تلاش مجدد
            </button>
          )}
        </div>
      )}

      <div ref={scrollEndRef} />
    </div>
  );
}
