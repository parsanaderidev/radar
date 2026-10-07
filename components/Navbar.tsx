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
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Radar Static Base Logo & Brand */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 text-white group cursor-pointer">
            <div className="flex items-center justify-center w-7 h-7 rounded-md bg-white text-black transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:shadow-[0_0_16px_rgba(255,255,255,0.35)] shadow-sm shrink-0">
              <RadarLogo className="w-4 h-4 text-black" />
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-medium">
              <span className="font-bold text-white text-sm">رادار</span>
              <span className="hidden sm:inline text-neutral-600">/</span>
              <span className="hidden md:inline text-neutral-400 group-hover:text-neutral-200 transition-colors duration-200">سامانه هوشمند سرنخ</span>
            </div>
          </Link>

          {/* Status Indicator */}
          <div
            className="flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 rounded-full border border-[#262626] bg-[#0c0c0c] text-[11px] text-neutral-400 transition-colors duration-200"
            title={pbStatus === "online" ? "پاکت‌بیس متصل" : pbStatus === "checking" ? "در حال اتصال..." : "قطع ارتباط دیتابیس"}
          >
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all duration-300 shrink-0",
                pbStatus === "online"
                  ? "bg-[#00e599] shadow-[0_0_8px_rgba(0,229,153,0.5)] animate-pulse-glow"
                  : pbStatus === "checking"
                    ? "bg-[#f5a623] animate-ping"
                    : "bg-[#e00]"
              )}
            />
            <span className="hidden lg:inline text-neutral-300">
              {pbStatus === "online" ? "پاکت‌بیس متصل" : pbStatus === "checking" ? "در حال اتصال..." : "قطع ارتباط دیتابیس"}
            </span>
            <span className="hidden sm:inline lg:hidden text-neutral-300">
              {pbStatus === "online" ? "متصل" : pbStatus === "checking" ? "اتصال..." : "قطع"}
            </span>
          </div>
        </div>m

        {/* Center: Vercel Nav Underline Tabs */}
        <nav className="flex items-center gap-1 shrink-0">
          <Link
            href="/"
            className={cn(
              "px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ease-out flex items-center gap-1.5 cursor-pointer active:scale-95",
              pathname === "/"
                ? "bg-[#1f1f1f] text-white shadow-sm"
                : "text-neutral-400 hover:text-white hover:bg-[#141414]"
            )}
          >
            <span className="hidden sm:inline">معرفی رادار (Overview)</span>
            <span className="sm:hidden">معرفی</span>
          </Link>

          <Link
            href="/dashboard"
            className={cn(
              "px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ease-out flex items-center gap-1.5 cursor-pointer active:scale-95",
              pathname === "/dashboard"
                ? "bg-[#1f1f1f] text-white shadow-sm"
                : "text-neutral-400 hover:text-white hover:bg-[#141414]"
            )}
          >
            <SparklesIcon className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">صندوق سرنخ‌ها</span>
            <span className="sm:hidden">داشبورد</span>
          </Link>

          <Link
            href="/settings"
            className={cn(
              "px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ease-out flex items-center gap-1.5 cursor-pointer active:scale-95",
              pathname === "/settings"
                ? "bg-[#1f1f1f] text-white shadow-sm"
                : "text-neutral-400 hover:text-white hover:bg-[#141414]"
            )}
          >
            <SettingsIcon className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden xl:inline">تنظیمات محصول و پرسونای مشتری (ICP)</span>
            <span className="hidden sm:inline xl:hidden">تنظیمات (ICP)</span>
            <span className="sm:hidden">تنظیمات</span>
          </Link>
        </nav>

        {/* Right: Primary Vercel Button */}
        <div className="flex items-center gap-2 shrink-0">
          {onSimulateFeed && (
            <button
              onClick={onSimulateFeed}
              disabled={isSimulating}
              className={cn(
                "h-8 px-2.5 sm:px-3.5 rounded-md text-xs font-medium transition-all duration-200 ease-out flex items-center gap-1.5 cursor-pointer active:scale-95",
                isSimulating
                  ? "bg-[#1f1f1f] text-neutral-500 border border-[#2a2a2a] cursor-not-allowed"
                  : "bg-white text-black hover:bg-[#eaeaea] hover:shadow-[0_0_18px_rgba(255,255,255,0.3)] shadow-sm"
              )}
              title="تزریق زنده پیام‌های آزمایشی جامعه کاربری"
            >
              {isSimulating ? (
                <>
                  <RefreshIcon className="w-3.5 h-3.5 animate-spin shrink-0" />
                  <span className="hidden sm:inline">در حال ارزیابی...</span>
                  <span className="sm:hidden">ارزیابی...</span>
                </>
              ) : (
                <>
                  <PlayIcon className="w-3 h-3 text-black shrink-0" />
                  <span className="hidden sm:inline">تزریق زنده پیام</span>
                  <span className="sm:hidden">تزریق پیام</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
