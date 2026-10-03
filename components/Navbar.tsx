"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  RadarIcon,
  PlayIcon,
  ServerIcon,
  SettingsIcon,
  RefreshIcon,
  SparklesIcon,
} from "./Icons";
import { cn } from "../lib/cn";

interface NavbarProps {
  onSimulateFeed?: () => Promise<void>;
  isSimulating?: boolean;
}

export function Navbar({ onSimulateFeed, isSimulating }: NavbarProps) {
  const pathname = usePathname();
  const [pbStatus, setPbStatus] = useState<"checking" | "online" | "offline">("checking");
  const [llmModel, setLlmModel] = useState<string>("llama3.1");

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
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500/20 via-cyan-500/20 to-blue-500/20 border border-emerald-500/30 text-emerald-400 group-hover:scale-105 transition-transform duration-200">
              <RadarIcon className="w-6 h-6 animate-pulse text-emerald-400" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-white">
                  رادار جذب مشتری
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  Lead Radar
                </span>
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                هوش مصنوعی تشخیص سیگنال خرید در جوامع ایرانی (تلگرام، بله، فروم)
              </span>
            </div>
          </Link>
        </div>

        {/* Center / Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/"
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5",
              pathname === "/"
                ? "bg-slate-800 text-white border border-slate-700"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            )}
          >
            <SparklesIcon className="w-4 h-4 text-emerald-400" />
            <span>صندوق سرنخ‌ها</span>
          </Link>

          <Link
            href="/settings"
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5",
              pathname === "/settings"
                ? "bg-slate-800 text-white border border-slate-700"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            )}
          >
            <SettingsIcon className="w-4 h-4 text-slate-400" />
            <span>تنظیمات محصول & ICP</span>
          </Link>
        </nav>

        {/* Right side actions & statuses */}
        <div className="flex items-center gap-3">
          {/* PocketBase Live Status Pill */}
          <div
            className={cn(
              "hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono border",
              pbStatus === "online"
                ? "bg-emerald-950/40 text-emerald-300 border-emerald-800/50"
                : pbStatus === "checking"
                ? "bg-amber-950/40 text-amber-300 border-amber-800/50"
                : "bg-rose-950/40 text-rose-300 border-rose-800/50"
            )}
            title="PocketBase SQLite Local Backend Status"
          >
            <ServerIcon className="w-3.5 h-3.5" />
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                pbStatus === "online"
                  ? "bg-emerald-400 animate-pulse"
                  : pbStatus === "checking"
                  ? "bg-amber-400 animate-ping"
                  : "bg-rose-400"
              )}
            />
            <span className="text-[11px]">
              {pbStatus === "online"
                ? "دیتابیس محلی متصل"
                : pbStatus === "checking"
                ? "بررسی دیتابیس..."
                : "عدم اتصال PocketBase"}
            </span>
          </div>

          {/* Simulate Live Feed CTA Button */}
          {onSimulateFeed && (
            <button
              onClick={onSimulateFeed}
              disabled={isSimulating}
              className={cn(
                "relative group overflow-hidden px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-lg",
                isSimulating
                  ? "bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700"
                  : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-950/50 hover:shadow-emerald-900/60 active:scale-95 border border-emerald-400/30"
              )}
            >
              {isSimulating ? (
                <>
                  <RefreshIcon className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>در حال دریافت و تریاژ...</span>
                </>
              ) : (
                <>
                  <PlayIcon className="w-3.5 h-3.5 text-white" />
                  <span>تزریق زنده پیام‌ها (Demo)</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
