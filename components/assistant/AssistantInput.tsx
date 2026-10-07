"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowUpRightIcon } from "@/components/Icons";

interface AssistantInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function AssistantInput({
  onSendMessage,
  disabled = false,
  placeholder = "سوالی درباره رادار، سرنخ‌ها یا نیت خرید بپرسید...",
}: AssistantInputProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || disabled) return;

    onSendMessage(trimmed);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex items-center gap-1.5 p-2 bg-[#090909] border-t border-[#1b1b1a]"
    >
      <div className="relative flex-1 flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          aria-label="پرسش از دستیار رادار"
          className="w-full h-9 pl-8 pr-3 rounded-lg bg-[#141414] border border-[#262624] text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-stone-300 focus:ring-1 focus:ring-stone-400/30 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] disabled:opacity-50 disabled:cursor-not-allowed"
        />

        {input.length > 0 && (
          <button
            type="button"
            onClick={() => setInput("")}
            className="absolute left-2 text-neutral-500 hover:text-stone-300 text-xs p-1 cursor-pointer transition-colors duration-200"
            title="پاک کردن متن"
            aria-label="پاک کردن متن"
          >
            ✕
          </button>
        )}
      </div>

      <button
        type="submit"
        disabled={disabled || !input.trim()}
        title="ارسال پیام (Enter)"
        aria-label="ارسال پیام"
        className="h-9 w-9 rounded-lg bg-stone-100 text-black hover:bg-white hover:shadow-[0_0_16px_rgba(255,245,230,0.35)] disabled:bg-neutral-900 disabled:text-neutral-600 border border-transparent disabled:border-[#262626] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-center cursor-pointer disabled:cursor-not-allowed active:scale-95 shadow-sm shrink-0 group"
      >
        {/* Leftward pointing arrow (←) for RTL Persian workflow */}
        <svg
          className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
      </button>
    </form>
  );
}
