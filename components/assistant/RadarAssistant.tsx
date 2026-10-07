"use client";

import React, { useState, useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
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

  // Warm monochrome VoiceOrb visual configurations
  const orbConfig = useMemo(() => {
    switch (status) {
      case "thinking":
        return {
          activity: 0.85,
          speed: 1.8,
          colors: ["#fafaf7", "#ffffff", "#171615"] as const,
        };
      case "error":
        return {
          activity: 0.45,
          speed: 1.0,
          colors: ["#f5f0eb", "#ffffff", "#262220"] as const,
        };
      case "responding":
        return {
          activity: 0.65,
          speed: 1.4,
          colors: ["#ffffff", "#ffffff", "#0c0c0a"] as const,
        };
      case "idle":
      default:
        return {
          activity: 0.12,
          speed: 0.65,
          colors: ["#f0eee6", "#ffffff", "#0c0c0a"] as const,
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
      {/* Floating Assistant Panel (Rendered with AnimatePresence) */}
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
        <motion.button
          type="button"
          onClick={togglePanel}
          aria-expanded={isOpen}
          aria-label={isOpen ? "بستن دستیار رادار" : "باز کردن دستیار رادار"}
          title={isOpen ? "بستن دستیار رادار (Esc)" : "دستیار هوشمند رادار"}
          whileHover={!isOpen ? { scale: 1.07 } : undefined}
          whileTap={!isOpen ? { scale: 0.94 } : undefined}
          transition={{
            type: "spring",
            stiffness: 350,
            damping: 24,
            mass: 0.6,
          }}
          className={`relative w-12 h-12 sm:w-13 sm:h-13 rounded-full flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-300 group select-none transform-gpu ${
            isOpen
              ? "bg-[#141414] hover:bg-[#1a1918] border border-[#2d2d2a] shadow-[0_6px_20px_rgba(0,0,0,0.8)]"
              : "bg-transparent border border-transparent"
          }`}
        >
          {/* Voice Orb (always mounted for zero-lag instant transition, no WebGL re-init) */}
          <div
            className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-200 ease-out ${
              isOpen ? "opacity-0" : "opacity-100"
            }`}
          >
            <VoiceOrb
              active={!isOpen}
              activity={orbConfig.activity}
              speed={orbConfig.speed}
              colors={orbConfig.colors}
              className="w-12 h-12 sm:w-13 sm:h-13"
            />
          </div>

          {/* Close Cross Icon */}
          <div
            className={`flex items-center justify-center transition-all duration-200 ease-out ${
              isOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-75 pointer-events-none"
            }`}
          >
            <svg
              className="w-4 h-4 text-stone-300 group-hover:text-white transition-colors"
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
          </div>
        </motion.button>
      </div>
    </>
  );
}
