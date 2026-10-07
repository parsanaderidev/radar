"use client";

import React from "react";
import { SparklesIcon, HighIntentIcon, ForumIcon, SettingsIcon } from "@/components/Icons";

interface AssistantSuggestionsProps {
  onSelectSuggestion: (question: string) => void;
  disabled?: boolean;
}

const SUGGESTIONS = [
  {
    id: "q-what-is-radar",
    text: "رادار چیست و چگونه کار می‌کند؟",
    icon: SparklesIcon,
  },
  {
    id: "q-intent-score",
    text: "امتیاز نیت خرید (Intent Score) چگونه محاسبه می‌شود؟",
    icon: HighIntentIcon,
  },
  {
    id: "q-sources",
    text: "سرنخ‌ها از چه منابعی (تلگرام، بله، توییتر) استخراج می‌شوند؟",
    icon: ForumIcon,
  },
  {
    id: "q-statuses",
    text: "تفاوت وضعیت‌های سرنخ (جدید، تماس‌گرفته، تبدیل‌شده) چیست؟",
    icon: SparklesIcon,
  },
  {
    id: "q-icp",
    text: "تنظیمات پرسونای مشتری (ICP) چه نقشی در تریاژ دارد؟",
    icon: SettingsIcon,
  },
];

export function AssistantSuggestions({
  onSelectSuggestion,
  disabled = false,
}: AssistantSuggestionsProps) {
  return (
    <div className="space-y-2 pt-1 animate-fade-in">
      <div className="text-[11px] font-medium text-neutral-400 px-1 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
        <span>پرسش‌های پیشنهادی:</span>
      </div>

      <div className="flex flex-col gap-1.5">
        {SUGGESTIONS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectSuggestion(item.text)}
              className="w-full text-right px-3 py-2 rounded-lg bg-[#111111] hover:bg-[#181716] border border-[#222220] hover:border-stone-400/50 hover:shadow-[0_2px_12px_rgba(255,245,220,0.06)] text-xs text-neutral-300 hover:text-stone-100 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-between group cursor-pointer active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="truncate leading-relaxed">{item.text}</span>
              <Icon className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white transition-colors shrink-0 mr-2" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
