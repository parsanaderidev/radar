/**
 * Radar Assistant Type Definitions
 * Provides type contracts for messages, context, and assistant state.
 */

export type AssistantRole = "user" | "assistant" | "system";

export type AssistantMessage = {
  id: string;
  role: AssistantRole;
  content: string;
  timestamp: number;
  isError?: boolean;
};

export type RadarAssistantContext = {
  products?: unknown[];
  leads?: unknown[];
  sources?: string[];
  currentPage?: string;
  selectedLeadId?: string;
  activeFilter?: string;
  totalLeadsCount?: number;
};

export type AssistantStatus = "idle" | "thinking" | "responding" | "error";

export type SuggestedQuestion = {
  id: string;
  title: string;
  category: "general" | "intent" | "sources" | "workflow";
};
