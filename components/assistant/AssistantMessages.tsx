"use client";

import React, { useEffect, useRef, useState } from "react";
import { AssistantMessage, AssistantStatus } from "./types";
import { AssistantSuggestions } from "./AssistantSuggestions";
import { XCircleIcon } from "@/components/Icons";
import { VoiceOrb } from "@/components/agents/voice-orb";

interface AssistantMessagesProps {
  messages: AssistantMessage[];
  status: AssistantStatus;
  errorMessage?: string | null;
  onSelectSuggestion: (question: string) => void;
  onRetry?: () => void;
}

/**
 * Removes all markdown bold/italic asterisks (***, **) and cleans bullets
 */
function cleanFormatting(raw: string): string {
  if (!raw) return "";
  let clean = raw;
  // Strip bold/italic asterisks ***text*** or **text** -> text
  clean = clean.replace(/\*{1,3}(.*?)\*{1,3}/g, "$1");
  // Replace line-start markdown bullets "* " with clean bullet "• "
  clean = clean.replace(/^\s*\*\s+/gm, "• ");
  // Remove any loose asterisks
  clean = clean.replace(/\*/g, "");
  return clean.trim();
}

/**
 * Realistic Typewriter Text Component
 * Smoothly types out new assistant answers character-by-character
 */
function TypewriterText({
  text,
  animate,
  onUpdate,
}: {
  text: string;
  animate: boolean;
  onUpdate?: () => void;
}) {
  const cleaned = cleanFormatting(text);
  const [displayedLength, setDisplayedLength] = useState(animate ? 0 : cleaned.length);

  useEffect(() => {
    if (!animate) {
      setDisplayedLength(cleaned.length);
      return;
    }

    setDisplayedLength(0);
    let count = 0;
    // Fast, crisp typewriter speed: 10ms per character
    const timer = setInterval(() => {
      count += 1;
      setDisplayedLength(count);
      onUpdate?.();
      if (count >= cleaned.length) {
        clearInterval(timer);
      }
    }, 10);

    return () => clearInterval(timer);
  }, [cleaned, animate, onUpdate]);

  const isComplete = displayedLength >= cleaned.length;

  return (
    <span>
      {cleaned.slice(0, displayedLength)}
      {animate && !isComplete && (
        <span className="inline-block w-1.5 h-3.5 bg-stone-300 ml-1 animate-pulse align-middle" />
      )}
    </span>
  );
}

export function AssistantMessages({
  messages,
  status,
  errorMessage,
  onSelectSuggestion,
  onRetry,
}: AssistantMessagesProps) {
  const scrollEndRef = useRef<HTMLDivElement>(null);
  const [lastAnimatedId, setLastAnimatedId] = useState<string | null>(null);

  const scrollToBottom = () => {
    scrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, status]);

  const isEmpty = messages.length === 0;

  return (
    <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3.5 no-scrollbar">
      {/* Empty State: Only Suggestions (Secondary header and fire description removed) */}
      {isEmpty && (
        <div className="pt-1 animate-fade-in">
          <AssistantSuggestions
            onSelectSuggestion={onSelectSuggestion}
            disabled={status === "thinking"}
          />
        </div>
      )}

      {/* Conversation Messages */}
      {messages.map((msg, index) => {
        const isUser = msg.role === "user";
        const isLatestAssistant = !isUser && index === messages.length - 1;
        const shouldAnimate = isLatestAssistant && lastAnimatedId !== msg.id;

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
              {/* Orb icon as profile/avatar of bot */}
              {!isUser && (
                <div className="flex items-center gap-1.5 mb-1.5 pb-1 border-b border-[#1c1c1c] text-[10px] text-neutral-400 font-medium">
                  <div className="w-3.5 h-3.5 flex items-center justify-center shrink-0 pointer-events-none">
                    <VoiceOrb
                      activity={0.2}
                      speed={0.65}
                      colors={["#f0eee6", "#ffffff", "#0c0c0a"]}
                      className="w-3.5 h-3.5"
                    />
                  </div>
                  <span className="text-neutral-300">دستیار رادار</span>
                </div>
              )}

              <div>
                {isUser ? (
                  msg.content
                ) : (
                  <TypewriterText
                    text={msg.content}
                    animate={shouldAnimate}
                    onUpdate={() => {
                      scrollToBottom();
                      if (shouldAnimate) setLastAnimatedId(msg.id);
                    }}
                  />
                )}
              </div>
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

      {/* Thinking State */}
      {status === "thinking" && (
        <div className="flex flex-col items-end animate-fade-in">
          <div className="max-w-[90%] rounded-2xl rounded-tl-sm px-3.5 py-2 bg-[#121212] border border-[#222222] text-xs text-neutral-300 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>در حال تحلیل...</span>
          </div>
        </div>
      )}

      {/* Error State */}
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
