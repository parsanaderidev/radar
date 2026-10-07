"use client";

import React, { useState, useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";
import { VoiceOrb } from "@/components/agents/voice-orb";
import { AssistantPanel } from "./AssistantPanel";
import { askRadarAssistant } from "./assistant-service";
import { AssistantMessage, AssistantStatus, RadarAssistantContext } from "./types";

interface RadarAssistantProps {
  context?: RadarAssistantContext;
}

export function RadarAssistant({ context: externalContext }: RadarAssistantProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [status, setStatus] = useState<AssistantStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastQuestion, setLastQuestion] = useState<string | null>(null);

  // Combine external context with current active route
  const currentContext: RadarAssistantContext = useMemo(
    () => ({
      ...externalContext,
      currentPage: pathname || "/",
    }),
    [externalContext, pathname]
  );

  // Configure dynamic VoiceOrb visual parameters according to assistant state
  const orbConfig = useMemo(() => {
    switch (status) {
      case "thinking":
        return {
          activity: 0.85,
          speed: 1.8,
          colors: ["#38bdf8", "#5effca", "#002a1b"] as const,
        };
      case "error":
        return {
          activity: 0.45,
          speed: 1.0,
          colors: ["#f43f5e", "#fda4af", "#881337"] as const,
        };
      case "responding":
        return {
          activity: 0.65,
          speed: 1.4,
          colors: ["#00e599", "#86efac", "#003b26"] as const,
        };
      case "idle":
      default:
        return {
          activity: 0.12,
          speed: 0.7,
          colors: ["#00e599", "#5effca", "#002a1b"] as const,
        };
    }
  }, [status]);

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || status === "thinking") return;

      const userMsg: AssistantMessage = {
        id: `user-msg-${Date.now()}`,
        role: "user",
        content: content.trim(),
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setStatus("thinking");
      setErrorMessage(null);
      setLastQuestion(content.trim());

      try {
        const assistantMsg = await askRadarAssistant(content.trim(), currentContext);
        setMessages((prev) => [...prev, assistantMsg]);
        setStatus("idle");
      } catch (err: any) {
        setStatus("error");
        setErrorMessage(err?.message || "خطا در دریافت پاسخ دستیار رادار رخ داد.");
      }
    },
    [currentContext, status]
  );

  const handleRetry = useCallback(() => {
    if (lastQuestion) {
      handleSendMessage(lastQuestion);
    }
  }, [handleSendMessage, lastQuestion]);

  const handleClearMessages = useCallback(() => {
    setMessages([]);
    setStatus("idle");
    setErrorMessage(null);
    setLastQuestion(null);
  }, []);

  const togglePanel = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <>
      {/* Floating Assistant Panel (Rendered above the orb) */}
      <AssistantPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        messages={messages}
        status={status}
        errorMessage={errorMessage}
        onSendMessage={handleSendMessage}
        onClearMessages={handleClearMessages}
        onRetry={handleRetry}
      />

      {/* Floating Trigger Orb Button (Bottom-Right corner) */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2.5">
        {/* Subtle Text Interaction Hint on Desktop */}
        {!isOpen && (
          <button
            type="button"
            onClick={togglePanel}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0a0a0a]/90 hover:bg-[#141414] border border-[#262626] hover:border-[#383838] text-xs text-neutral-300 hover:text-white backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.6)] transition-all duration-200 cursor-pointer active:scale-95 group"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e599] group-hover:shadow-[0_0_8px_rgba(0,229,153,0.8)] transition-all" />
            <span className="font-medium">دستیار رادار</span>
          </button>
        )}

        {/* The Voice Orb Button */}
        <button
          type="button"
          onClick={togglePanel}
          aria-expanded={isOpen}
          aria-label={isOpen ? "بستن دستیار رادار" : "باز کردن دستیار رادار"}
          title={isOpen ? "بستن دستیار رادار (Esc)" : "گفتگو با دستیار هوشمند رادار"}
          className={`relative w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center bg-black/95 border transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer active:scale-95 shadow-[0_4px_24px_rgba(0,0,0,0.8)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 overflow-hidden group ${
            isOpen
              ? "border-white/80 shadow-[0_0_24px_rgba(255,255,255,0.3)]"
              : status === "thinking"
              ? "border-[#38bdf8] shadow-[0_0_24px_rgba(56,189,248,0.4)]"
              : "border-[#262626] hover:border-[#00e599]/70 hover:shadow-[0_0_20px_rgba(0,229,153,0.3)]"
          }`}
        >
          {isOpen ? (
            <span className="text-white text-lg font-light transition-transform duration-200 group-hover:rotate-90">
              ✕
            </span>
          ) : (
            <div className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center pointer-events-none">
              <VoiceOrb
                activity={orbConfig.activity}
                speed={orbConfig.speed}
                colors={orbConfig.colors}
                className="w-11 h-11 sm:w-12 sm:h-12"
              />
            </div>
          )}
        </button>
      </div>
    </>
  );
}
