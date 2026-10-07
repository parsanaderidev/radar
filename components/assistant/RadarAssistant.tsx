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

  // Pure black and white (monochrome) VoiceOrb visual configurations
  const orbConfig = useMemo(() => {
    switch (status) {
      case "thinking":
        return {
          activity: 0.85,
          speed: 1.8,
          colors: ["#ffffff", "#ffffff", "#1a1a1a"] as const,
        };
      case "error":
        return {
          activity: 0.45,
          speed: 1.0,
          colors: ["#e5e5e5", "#ffffff", "#262626"] as const,
        };
      case "responding":
        return {
          activity: 0.65,
          speed: 1.4,
          colors: ["#ffffff", "#ffffff", "#000000"] as const,
        };
      case "idle":
      default:
        return {
          activity: 0.12,
          speed: 0.65,
          colors: ["#e0e0e0", "#ffffff", "#000000"] as const,
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
      {/* Floating Assistant Panel */}
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

      {/* Floating Trigger Button (Bottom-Right corner) */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <button
          type="button"
          onClick={togglePanel}
          aria-expanded={isOpen}
          aria-label={isOpen ? "بستن دستیار رادار" : "باز کردن دستیار رادار"}
          title={isOpen ? "بستن دستیار رادار (Esc)" : "دستیار هوشمند رادار"}
          className={`relative rounded-full flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white group ${
            isOpen
              ? "w-11 h-11 sm:w-12 sm:h-12 bg-[#121212] hover:bg-[#1a1a1a] border border-[#2b2b2b] hover:border-neutral-400 shadow-[0_6px_20px_rgba(0,0,0,0.8)]"
              : "w-13 h-13 sm:w-14 sm:h-14 bg-black border border-[#242424] hover:border-neutral-400 hover:scale-105 shadow-[0_8px_24px_rgba(0,0,0,0.85)]"
          }`}
        >
          {isOpen ? (
            /* Refined, perfectly centered cross with smooth hover */
            <svg
              className="w-4 h-4 text-neutral-300 group-hover:text-white transition-all duration-200 group-hover:rotate-90 group-hover:scale-110"
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
          ) : (
            /* Pure Black & White Voice Orb (No extra text, no badges, just orb) */
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
