"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  RadarLogo,
  PlayIcon,
  RefreshIcon,
  SparklesIcon,
  SettingsIcon,
} from "./Icons";
import { cn } from "../lib/cn";

interface NavbarProps {
  onSimulateFeed?: () => Promise<void>;
  isSimulating?: boolean;
}

export function Navbar({ onSimulateFeed, isSimulating }: NavbarProps) {
  const pathname = usePathname();
  const [pbStatus, setPbStatus] = useState<"checking" | "online" | "offline">("checking");

  useEffect(() => {
    async function checkHealth() {
      try {
        const pbUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://127.0.0.1:8090";
        const res = await fetch(`${pbUrl}/api/health`, { method: "GET", cache: "no-store" });
        if (res.ok) {
          setPbStatus("online");
        } else {
          setPbStatus("offline");
        }
      } catch {
        setPbStatus("offline");
      }
    }

    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1f1f1f] bg-black/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Left: Radar Static Base Logo & Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 text-white group">
            <div className="flex items-center justify-center w-7 h-7 rounded-md bg-white text-black transition-transform group-hover:scale-105 shadow-sm">
              <RadarLogo className="w-4 h-4 text-black" />
            </div>
            <div className="flex items-center gap-2 text-xs font-medium">
              <span className="font-bold text-white text-sm">رادار</span>
              <span className="text-neutral-600">/</span>
              <span className="text-neutral-400">سامانه هوشمند سرنخ</span>
            </div>
          </Link>

          {/* Status Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-[#262626] bg-[#0c0c0c] text-[11px] text-neutral-400">
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                pbStatus === "online"
                  ? "bg-[#00e599] shadow-[0_0_8px_rgba(0,229,153,0.5)]"
                  : pbStatus === "checking"
                    ? "bg-[#f5a623] animate-ping"
                    : "bg-[#e00]"
              )}
            />
            <span className="text-neutral-300">
              {pbStatus === "online" ? "پاکت‌بیس متصل" : pbStatus === "checking" ? "در حال اتصال..." : "قطع ارتباط دیتابیس"}
            </span>
          </div>
        </div>

        {/* Center: Vercel Nav Underline Tabs */}
        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5",
              pathname === "/"
                ? "bg-[#1f1f1f] text-white"
                : "text-neutral-400 hover:text-white hover:bg-[#141414]"
            )}
          >
            <SparklesIcon className="w-3.5 h-3.5" />
            <span>صندوق سرنخ‌ها</span>
          </Link>

          <Link
            href="/settings"
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5",
              pathname === "/settings"
                ? "bg-[#1f1f1f] text-white"
                : "text-neutral-400 hover:text-white hover:bg-[#141414]"
            )}
          >
            <SettingsIcon className="w-3.5 h-3.5" />
            <span>تنظیمات محصول & ICP</span>
          </Link>
        </nav>

        {/* Right: Primary Vercel Button */}
        <div className="flex items-center gap-2">
          {onSimulateFeed && (
            <button
              onClick={onSimulateFeed}
              disabled={isSimulating}
              className={cn(
                "h-8 px-3 rounded-md text-xs font-medium transition-all duration-150 flex items-center gap-1.5",
                isSimulating
                  ? "bg-[#1f1f1f] text-neutral-500 border border-[#2a2a2a] cursor-not-allowed"
                  : "bg-white text-black hover:bg-[#e6e6e6] active:scale-95 shadow-sm"
              )}
            >
              {isSimulating ? (
                <>
                  <RefreshIcon className="w-3.5 h-3.5 animate-spin" />
                  <span>در حال ارزیابی...</span>
                </>
              ) : (
                <>
                  <PlayIcon className="w-3 h-3 text-black" />
                  <span>تزریق زنده پیام</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
