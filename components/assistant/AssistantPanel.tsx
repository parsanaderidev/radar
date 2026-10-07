"use client";

import React, { useEffect, useRef } from "react";
import { AssistantMessage, AssistantStatus } from "./types";
import { AssistantMessages } from "./AssistantMessages";
import { AssistantInput } from "./AssistantInput";
import { RadarLogo, RefreshIcon } from "@/components/Icons";

interface AssistantPanelProps {
  isOpen: boolean;
  onClose: () => void;
  messages: AssistantMessage[];
  status: AssistantStatus;
  errorMessage?: string | null;
  onSendMessage: (message: string) => void;
  onClearMessages: () => void;
  onRetry?: () => void;
}

export function AssistantPanel({
  isOpen,
  onClose,
  messages,
  status,
  errorMessage,
  onSendMessage,
  onClearMessages,
  onRetry,
}: AssistantPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="پنل گفتگوی دستیار رادار"
      className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[400px] h-[520px] max-h-[calc(100vh-110px)] flex flex-col rounded-2xl bg-[#0a0a0a] border border-[#222222] shadow-[0_16px_50px_rgba(0,0,0,0.85)] backdrop-blur-xl overflow-hidden animate-fade-in transition-all duration-300"
    >
      {/* Panel Header */}
      <div className="h-14 px-4 border-b border-[#1f1f1f] bg-[#0c0c0c] flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-white text-black flex items-center justify-center shadow-sm">
            <RadarLogo className="w-4 h-4 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-white">دستیار رادار</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00e599] animate-pulse-glow" />
            </div>
            <div className="text-[10px] text-neutral-400">راهنمای نیت خرید و سرنخ‌ها</div>
          </div>
        </div>

        {/* Header Controls: Clear & Close */}
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              type="button"
              onClick={onClearMessages}
              title="پاک کردن پیام‌ها"
              aria-label="پاک کردن پیام‌ها"
              className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors text-xs cursor-pointer"
            >
              <RefreshIcon className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            title="بستن دستیار (Esc)"
            aria-label="بستن دستیار"
            className="w-7 h-7 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors flex items-center justify-center text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Panel Body: Message Stream */}
      <AssistantMessages
        messages={messages}
        status={status}
        errorMessage={errorMessage}
        onSelectSuggestion={onSendMessage}
        onRetry={onRetry}
      />

      {/* Panel Footer: Input & Disclaimer */}
      <div className="shrink-0 bg-[#0a0a0a]">
        <AssistantInput
          onSendMessage={onSendMessage}
          disabled={status === "thinking"}
        />
        <div className="px-3 py-1.5 text-center text-[10px] text-neutral-500 border-t border-[#161616]">
          تحلیل پاسخ‌ها منحصراً متمرکز بر داده‌ها و تریاژ داخلی رادار است.
        </div>
      </div>
    </div>
  );
}
