"use client";

import React, { useEffect, useRef } from "react";
import { AssistantMessage, AssistantStatus } from "./types";
import { AssistantMessages } from "./AssistantMessages";
import { AssistantInput } from "./AssistantInput";
import { RefreshIcon } from "@/components/Icons";

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
      aria-label="پنل دستیار رادار"
      className="fixed bottom-19 right-4 sm:bottom-22 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[380px] h-[490px] max-h-[calc(100vh-100px)] flex flex-col rounded-2xl bg-[#090909] border border-[#202020] shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-xl overflow-hidden animate-fade-in transition-all duration-300"
    >
      {/* Minimal Header */}
      <div className="h-11 px-3.5 border-b border-[#1a1a1a] bg-[#0c0c0c] flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-xs font-semibold text-white tracking-wide">دستیار رادار</span>
        </div>

        {/* Minimal Controls */}
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              type="button"
              onClick={onClearMessages}
              title="پاک کردن گفتگو"
              aria-label="پاک کردن گفتگو"
              className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors text-xs cursor-pointer"
            >
              <RefreshIcon className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            title="بستن (Esc)"
            aria-label="بستن دستیار"
            className="w-6 h-6 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all flex items-center justify-center cursor-pointer"
          >
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Message Stream */}
      <AssistantMessages
        messages={messages}
        status={status}
        errorMessage={errorMessage}
        onSelectSuggestion={onSendMessage}
        onRetry={onRetry}
      />

      {/* Input */}
      <div className="shrink-0 bg-[#090909]">
        <AssistantInput
          onSendMessage={onSendMessage}
          disabled={status === "thinking"}
        />
      </div>
    </div>
  );
}
