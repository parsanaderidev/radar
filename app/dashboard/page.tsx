"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { MetricsHeader } from "@/components/MetricsHeader";
import { LeadCard } from "@/components/LeadCard";
import {
  SparklesIcon,
  RefreshIcon,
  PlayIcon,
  RadarLogo,
  TelegramIcon,
  BaleIcon,
  TwitterXIcon,
  ForumIcon,
} from "@/components/Icons";
import { getPocketBaseClient, type LeadRecord, type ProductRecord } from "@/lib/pocketbase";
import { calculateRadarMetrics, toPersianDigits } from "@/lib/pricing";
import { cn } from "@/lib/cn";

export default function LeadRadarDashboard() {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [totalRawMessages, setTotalRawMessages] = useState<number>(0);
  const [activeProduct, setActiveProduct] = useState<ProductRecord | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulatedAlert, setSimulatedAlert] = useState<{ message: string; type: "success" | "info" } | null>(null);

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>("هم‌اکنون");
  const [visibleCount, setVisibleCount] = useState<number>(8);
  const loadMoreRef = React.useRef<HTMLDivElement | null>(null);

  // Filters & Sorting
  const [selectedIntent, setSelectedIntent] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "highest_score" | "lowest_spend">("newest");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const pb = useMemo(() => getPocketBaseClient(), []);

  // Fetch leads and metrics data
  const fetchData = useCallback(async () => {
    try {
      const leadsRes = await pb.collection("leads").getFullList<LeadRecord>({
        sort: "-created",
        expand: "raw_message_id.source_id,product_id",
      });
      setLeads(leadsRes);

      const rawRes = await pb.collection("raw_messages").getList(1, 1);
      setTotalRawMessages(rawRes.totalItems);

      const prodRes = await pb.collection("products").getList<ProductRecord>(1, 1);
      if (prodRes.items.length > 0) {
        setActiveProduct(prodRes.items[0]);
      }
    } catch (err) {
      console.error("[Dashboard] Error fetching leads:", err);
    } finally {
      setIsLoading(false);
    }
  }, [pb]);

  // Tactile manual refresh with visual feedback
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const leadsRes = await pb.collection("leads").getFullList<LeadRecord>({
        sort: "-created",
        expand: "raw_message_id.source_id,product_id",
      });
      setLeads(leadsRes);

      const rawRes = await pb.collection("raw_messages").getList(1, 1);
      setTotalRawMessages(rawRes.totalItems);

      const prodRes = await pb.collection("products").getList<ProductRecord>(1, 1);
      if (prodRes.items.length > 0) {
        setActiveProduct(prodRes.items[0]);
      }

      const now = new Date();
      const timeStr = now.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      setLastRefreshedAt(timeStr);

      setSimulatedAlert({
        message: `اطلاعات با موفقیت بازخوانی شد: ${toPersianDigits(leadsRes.length)} سرنخ و ${toPersianDigits(rawRes.totalItems)} پیام ارزیابی‌شده در پایگاه داده محلی پاکت‌بیس همگام گردید.`,
        type: "success",
      });
      setTimeout(() => setSimulatedAlert(null), 4000);
    } catch (err: any) {
      console.error("[Dashboard] Manual refresh error:", err);
      setSimulatedAlert({
        message: `خطا در بازخوانی داده‌ها: ${err?.message || "مشکلی در ارتباط رخ داد"}`,
        type: "info",
      });
    } finally {
      setTimeout(() => setIsRefreshing(false), 450);
    }
  };

  // Initial load and Real-time SSE subscription
  useEffect(() => {
    fetchData();

    let isSubscribed = false;
    pb.collection("leads")
      .subscribe("*", async (e) => {
        if (e.action === "create") {
          try {
            const expanded = await pb.collection("leads").getOne<LeadRecord>(e.record.id, {
              expand: "raw_message_id.source_id,product_id",
            });
            setLeads((prev) => [expanded, ...prev.filter((l) => l.id !== expanded.id)]);
            setTotalRawMessages((prev) => prev + 1);
          } catch {
            setLeads((prev) => [e.record as any, ...prev.filter((l) => l.id !== e.record.id)]);
          }
        } else if (e.action === "update") {
          setLeads((prev) =>
            prev.map((l) => (l.id === e.record.id ? { ...l, ...e.record } : l))
          );
        } else if (e.action === "delete") {
          setLeads((prev) => prev.filter((l) => l.id !== e.record.id));
        }
      })
      .then(() => {
        isSubscribed = true;
      })
      .catch((err) => {
        console.warn("[Dashboard] SSE subscription warning:", err);
      });

    const interval = setInterval(() => {
      fetchData();
    }, 10000);

    return () => {
      clearInterval(interval);
      if (isSubscribed) {
        pb.collection("leads").unsubscribe("*").catch(() => { });
      }
    };
  }, [fetchData, pb]);

  // Handle lead status updates via secure backend API
  const handleUpdateStatus = async (
    leadId: string,
    status: "new" | "approved" | "contacted" | "dismissed"
  ) => {
    try {
      const res = await fetch("/api/leads/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, status }),
      });

      if (!res.ok) {
        throw new Error("Failed to update lead status");
      }

      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, lead_status: status } : l))
      );
    } catch (err) {
      console.error("[Dashboard] Error updating lead status:", err);
    }
  };

  // Simulate Live Feed Button Handler
  const handleSimulateFeed = async () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimulatedAlert(null);

    try {
      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const data = await res.json();

      if (res.status === 401) {
        setSimulatedAlert({
          message: "جهت تزریق آزمایشی پیام، ابتدا باید وارد حساب مدیریت شوید (از منوی تنظیمات).",
          type: "info",
        });
        setTimeout(() => setSimulatedAlert(null), 6000);
        return;
      }

      if (res.ok && data.success && data.lead) {
        setLeads((prev) => [data.lead, ...prev.filter((l) => l.id !== data.lead.id)]);
        setTotalRawMessages((prev) => prev + 1);

        const levelLabel =
          data.lead.intent_level === "high_intent"
            ? "خرید قطعی"
            : data.lead.intent_level === "problem_aware"
              ? "دردمند و ناراضی"
              : data.lead.intent_level === "curious"
                ? "کنجکاو"
                : "نویز و نامرتبط";

        setSimulatedAlert({
          message: `پیام جدید از ${data.lead.expand?.raw_message_id?.author_handle || "کاربر"} وارد صف شد: ${levelLabel}`,
          type: "success",
        });

        setTimeout(() => setSimulatedAlert(null), 5000);
      } else {
        throw new Error(data.error || "Simulation failed");
      }
    } catch (err: any) {
      console.error("[Dashboard] Simulation error:", err);
      setSimulatedAlert({
        message: `خطا در شبیه‌سازی: ${err?.message || "ارتباط با سرور برقرار نشد"}`,
        type: "info",
      });
    } finally {
      setIsSimulating(false);
    }
  };

  const metrics = useMemo(() => {
    return calculateRadarMetrics(leads, totalRawMessages);
  }, [leads, totalRawMessages]);

  const platformCounts = useMemo(() => {
    const counts = {
      all: 0,
      telegram: 0,
      bale: 0,
      twitter_x: 0,
      forum: 0,
    };
    leads.forEach((l) => {
      if (selectedIntent !== "all" && l.intent_level !== selectedIntent) return;
      if (selectedStatus !== "all" && l.lead_status !== selectedStatus) return;
      counts.all++;
      const p = l.expand?.raw_message_id?.expand?.source_id?.platform || "telegram";
      if (p === "telegram") counts.telegram++;
      else if (p === "bale") counts.bale++;
      else if (p === "twitter_x") counts.twitter_x++;
      else if (p === "forum") counts.forum++;
      else counts.forum++;
    });
    return counts;
  }, [leads, selectedIntent, selectedStatus]);

  const filteredLeads = useMemo(() => {
    let result = leads.filter((lead) => {
      if (selectedIntent !== "all" && lead.intent_level !== selectedIntent) {
        return false;
      }
      if (selectedStatus !== "all" && lead.lead_status !== selectedStatus) {
        return false;
      }
      if (selectedPlatform !== "all") {
        const p = lead.expand?.raw_message_id?.expand?.source_id?.platform || "telegram";
        if (p !== selectedPlatform) {
          return false;
        }
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const content = (lead.expand?.raw_message_id?.content || "").toLowerCase();
        const author = (lead.expand?.raw_message_id?.author_handle || "").toLowerCase();
        const reason = (lead.reasoning || "").toLowerCase();
        const feature = (lead.matched_feature || "").toLowerCase();
        if (
          !content.includes(query) &&
          !author.includes(query) &&
          !reason.includes(query) &&
          !feature.includes(query)
        ) {
          return false;
        }
      }
      return true;
    });

    if (sortBy === "highest_score") {
      result = [...result].sort((a, b) => (b.intent_score || 0) - (a.intent_score || 0));
    } else if (sortBy === "lowest_spend") {
      result = [...result].sort((a, b) => (a.estimated_cost_usd || 0) - (b.estimated_cost_usd || 0));
    } else {
      result = [...result].sort(
        (a, b) => new Date(b.created || 0).getTime() - new Date(a.created || 0).getTime()
      );
    }

    return result;
  }, [leads, selectedIntent, selectedStatus, selectedPlatform, searchQuery, sortBy]);

  // Reset visibleCount when filters change
  useEffect(() => {
    setVisibleCount(8);
  }, [selectedIntent, selectedStatus, selectedPlatform, searchQuery, sortBy]);

  // Infinite scroll lazy loading observer
  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 6, filteredLeads.length));
        }
      },
      { threshold: 0.1, rootMargin: "120px" }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [filteredLeads.length]);

  const visibleLeads = useMemo(() => {
    return filteredLeads.slice(0, visibleCount);
  }, [filteredLeads, visibleCount]);

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-[#ededed]">
      <Navbar onSimulateFeed={handleSimulateFeed} isSimulating={isSimulating} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 pt-20 sm:pt-24 pb-8 space-y-4 sm:space-y-6">
        {/* Active Product Banner (Vercel Project Card Style) */}
        {activeProduct && (
          <div className="p-3.5 sm:p-4 rounded-lg bg-[#0a0a0a] border border-[#1f1f1f] hover:border-[#333333] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.6)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <Link
              href="/settings"
              className="space-y-1 group cursor-pointer flex-1 w-full sm:w-auto"
              title="مشاهده و ویرایش تنظیمات این محصول و پرسونای مشتری"
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center text-[10px] px-2.5 py-0.5 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-400 font-medium group-hover:border-neutral-700 transition-colors duration-200">
                  محصول هدف
                </span>
                <h1 className="text-sm sm:text-base font-semibold text-white group-hover:text-[#00e599] transition-colors duration-200 flex items-center gap-1.5">
                  <span>{activeProduct.name}</span>
                  <span className="text-xs text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">← تنظیمات</span>
                </h1>
              </div>
              <p className="text-xs text-neutral-400 max-w-3xl line-clamp-2 sm:line-clamp-1 group-hover:text-neutral-300 transition-colors duration-200">
                {activeProduct.tagline || activeProduct.description}
              </p>
            </Link>

            <div className="flex items-center gap-2.5 self-stretch sm:self-auto justify-between sm:justify-end pt-2 sm:pt-0 border-t border-[#1a1a1a] sm:border-0 w-full sm:w-auto">
              <span className="inline-flex items-center justify-center gap-1.5 text-[11px] text-neutral-500">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00e599] animate-pulse-glow" />
                <span className="hidden xs:inline">همگام‌شده:</span>
                <span className="text-neutral-300 font-medium">{lastRefreshedAt}</span>
              </span>

              <button
                onClick={handleManualRefresh}
                disabled={isRefreshing || isLoading}
                className={cn(
                  "h-8 px-3 sm:px-3.5 rounded-md bg-[#111111] hover:bg-[#1a1a1a] border border-[#262626] hover:border-[#383838] text-xs font-medium text-neutral-200 transition-all duration-200 ease-out active:scale-95 inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 shadow-sm shrink-0",
                  isRefreshing && "bg-[#181818] border-[#383838] text-white"
                )}
                title="بازخوانی داده‌ها از پایگاه داده محلی پاکت‌بیس"
              >
                <RefreshIcon className={cn("w-3.5 h-3.5 text-neutral-400 transition-transform duration-300", isRefreshing && "animate-spin text-white")} />
                <span>{isRefreshing ? "در حال دریافت..." : "بروزرسانی داده‌ها"}</span>
              </button>
            </div>
          </div>
        )}

        {/* Live Simulation Alert */}
        {simulatedAlert && (
          <div className="p-3 rounded-lg bg-[#0c0c0c] border border-[#262626] text-xs text-neutral-200 flex items-center justify-between gap-2 shadow-lg animate-card-in">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00e599] shrink-0" />
              <span>{simulatedAlert.message}</span>
            </div>
            <button
              onClick={() => setSimulatedAlert(null)}
              className="text-neutral-500 hover:text-neutral-200 text-xs px-2 cursor-pointer shrink-0"
            >
              ✕
            </button>
          </div>
        )}

        {/* Metrics Header Component */}
        <MetricsHeader
          metrics={metrics}
          selectedIntent={selectedIntent}
          onSelectIntent={setSelectedIntent}
          selectedStatus={selectedStatus}
          onSelectStatus={setSelectedStatus}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Feed Section Title */}
        <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-semibold text-neutral-300">
              جریان زنده پیام‌های جامعه کاربری
            </h2>
            <span className="inline-flex items-center justify-center text-[11px] px-2 py-0.5 rounded-md bg-neutral-900 text-neutral-400 border border-neutral-800 font-medium">
              {toPersianDigits(filteredLeads.length)}
            </span>
          </div>

          <div className="inline-flex items-center justify-center gap-2 text-xs text-neutral-500">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e599] animate-pulse-glow shrink-0" />
            <span className="hidden sm:inline">ارتباط زنده لحظه‌ای (SSE)</span>
          </div>
        </div>

        {/* Messenger / Platform Filter & Sort Bar (Matching Vercel Aesthetic) */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 p-2 rounded-lg bg-[#0a0a0a] border border-[#1f1f1f]">
          {/* Messenger filter pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1.5 md:pb-0 no-scrollbar scrollbar-none flex-nowrap -mx-0.5 px-0.5">
            <button
              onClick={() => setSelectedPlatform("all")}
              className={cn(
                "px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ease-out active:scale-95 cursor-pointer whitespace-nowrap inline-flex items-center justify-center gap-1.5 shrink-0",
                selectedPlatform === "all"
                  ? "bg-[#222222] text-white shadow-sm"
                  : "text-neutral-400 hover:text-neutral-200 hover:bg-[#141414]"
              )}
            >
              <span>همه پیام‌رسان‌ها</span>
              <span className="text-[11px] opacity-70 inline-flex items-center justify-center">({toPersianDigits(platformCounts.all)})</span>
            </button>

            <button
              onClick={() => setSelectedPlatform("telegram")}
              className={cn(
                "px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ease-out active:scale-95 cursor-pointer whitespace-nowrap inline-flex items-center justify-center gap-1.5 shrink-0",
                selectedPlatform === "telegram"
                  ? "bg-[#222222] text-[#229ed9] shadow-sm"
                  : "text-neutral-400 hover:text-neutral-200 hover:bg-[#141414]"
              )}
            >
              <TelegramIcon className="w-3.5 h-3.5 text-[#229ed9]" />
              <span>تلگرام</span>
              <span className="text-[11px] opacity-70 inline-flex items-center justify-center">({toPersianDigits(platformCounts.telegram)})</span>
            </button>

            <button
              onClick={() => setSelectedPlatform("bale")}
              className={cn(
                "px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ease-out active:scale-95 cursor-pointer whitespace-nowrap inline-flex items-center justify-center gap-1.5 shrink-0",
                selectedPlatform === "bale"
                  ? "bg-[#222222] text-[#00e599] shadow-sm"
                  : "text-neutral-400 hover:text-neutral-200 hover:bg-[#141414]"
              )}
            >
              <BaleIcon className="w-3.5 h-3.5 text-[#00e599]" />
              <span>بله</span>
              <span className="text-[11px] opacity-70 inline-flex items-center justify-center">({toPersianDigits(platformCounts.bale)})</span>
            </button>

            <button
              onClick={() => setSelectedPlatform("twitter_x")}
              className={cn(
                "px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ease-out active:scale-95 cursor-pointer whitespace-nowrap inline-flex items-center justify-center gap-1.5 shrink-0",
                selectedPlatform === "twitter_x"
                  ? "bg-[#222222] text-white shadow-sm"
                  : "text-neutral-400 hover:text-neutral-200 hover:bg-[#141414]"
              )}
            >
              <TwitterXIcon className="w-3.5 h-3.5 text-neutral-300" />
              <span>توییتر (X)</span>
              <span className="text-[11px] opacity-70 inline-flex items-center justify-center">({toPersianDigits(platformCounts.twitter_x)})</span>
            </button>

            <button
              onClick={() => setSelectedPlatform("forum")}
              className={cn(
                "px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ease-out active:scale-95 cursor-pointer whitespace-nowrap inline-flex items-center justify-center gap-1.5 shrink-0",
                selectedPlatform === "forum"
                  ? "bg-[#222222] text-neutral-200 shadow-sm"
                  : "text-neutral-400 hover:text-neutral-200 hover:bg-[#141414]"
              )}
            >
              <ForumIcon className="w-3.5 h-3.5 text-neutral-400" />
              <span>انجمن‌ها</span>
              <span className="text-[11px] opacity-70 inline-flex items-center justify-center">({toPersianDigits(platformCounts.forum)})</span>
            </button>
          </div>

          {/* Sort controls */}
          <div className="flex items-center justify-between sm:justify-end gap-1.5 w-full md:w-auto pt-2 md:pt-0 border-t border-[#1a1a1a] md:border-0">
            <span className="text-xs text-neutral-500 whitespace-nowrap shrink-0">مرتب‌سازی:</span>
            <div className="flex items-center gap-1 bg-[#000000] p-1 rounded-md border border-[#262626] flex-1 sm:flex-initial justify-between sm:justify-start">
              <button
                onClick={() => setSortBy("newest")}
                className={cn(
                  "px-2 sm:px-2.5 py-1 rounded text-[11px] font-medium transition-all duration-200 ease-out active:scale-95 cursor-pointer whitespace-nowrap inline-flex items-center justify-center flex-1 sm:flex-initial text-center",
                  sortBy === "newest"
                    ? "bg-[#222222] text-white shadow-sm"
                    : "text-neutral-400 hover:text-white"
                )}
              >
                جدیدترین
              </button>
              <button
                onClick={() => setSortBy("highest_score")}
                className={cn(
                  "px-2 sm:px-2.5 py-1 rounded text-[11px] font-medium transition-all duration-200 ease-out active:scale-95 cursor-pointer whitespace-nowrap inline-flex items-center justify-center flex-1 sm:flex-initial text-center",
                  sortBy === "highest_score"
                    ? "bg-[#222222] text-[#00e599] shadow-sm"
                    : "text-neutral-400 hover:text-[#00e599]"
                )}
              >
                بالاترین امتیاز
              </button>
              <button
                onClick={() => setSortBy("lowest_spend")}
                className={cn(
                  "px-2 sm:px-2.5 py-1 rounded text-[11px] font-medium transition-all duration-200 ease-out active:scale-95 cursor-pointer whitespace-nowrap inline-flex items-center justify-center flex-1 sm:flex-initial text-center",
                  sortBy === "lowest_spend"
                    ? "bg-[#222222] text-white shadow-sm"
                    : "text-neutral-400 hover:text-white"
                )}
              >
                کمترین هزینه
              </button>
            </div>
          </div>
        </div>

        {/* Leads Feed with Skeleton & Lazy Loading */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-lg p-4 bg-[#0a0a0a] border border-[#1f1f1f] space-y-3.5"
              >
                <div className="flex justify-between items-center">
                  <div className="w-28 h-5 rounded bg-neutral-900 animate-shimmer" />
                  <div className="w-20 h-5 rounded bg-neutral-900 animate-shimmer" />
                </div>
                <div className="space-y-2">
                  <div className="w-full h-4 rounded bg-neutral-900 animate-shimmer" />
                  <div className="w-4/5 h-4 rounded bg-neutral-900 animate-shimmer" />
                </div>
                <div className="w-36 h-4 rounded bg-neutral-900 animate-shimmer" />
              </div>
            ))}
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="py-12 sm:py-16 px-4 rounded-lg border border-[#1f1f1f] text-center space-y-3 bg-[#050505]">
            <div className="w-12 h-12 mx-auto rounded-lg bg-[#111111] border border-[#222222] hover:border-[#383838] flex items-center justify-center text-white shadow-sm group cursor-pointer transition-all active:scale-95">
              <RadarLogo className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-neutral-200">
                هیچ پیامی با فیلترهای انتخابی موجود نیست
              </h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                برای تزریق پیام جدید و مشاهده تریاژ هوشمند در رادار، دکمه «تزریق زنده پیام» را بزنید.
              </p>
            </div>
            <button
              onClick={handleSimulateFeed}
              disabled={isSimulating}
              className="h-8 px-4 rounded-md bg-white text-black hover:bg-[#e6e6e6] text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm cursor-pointer disabled:cursor-not-allowed"
            >
              <PlayIcon className="w-3 h-3 text-black" />
              <span>تزریق زنده پیام</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {visibleLeads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}

            {/* Lazy Load Observer & Button */}
            {visibleCount < filteredLeads.length && (
              <div
                ref={loadMoreRef}
                className="pt-4 flex flex-col items-center justify-center space-y-2"
              >
                <button
                  onClick={() => setVisibleCount((prev) => prev + 8)}
                  className="w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-md bg-[#0d0d0d] hover:bg-[#161616] border border-[#1f1f1f] hover:border-[#333333] text-xs text-neutral-300 transition-all duration-200 ease-out active:scale-95 inline-flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>مشاهده سرنخ‌های بیشتر</span>
                  <span className="inline-flex items-center justify-center text-[11px] px-2 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800">
                    {toPersianDigits(filteredLeads.length - visibleCount)} مورد باقی‌مانده
                  </span>
                </button>
                <span className="text-[11px] text-neutral-600 text-center">
                  نمایش {toPersianDigits(visibleLeads.length)} از {toPersianDigits(filteredLeads.length)} پیام (بارگذاری تدریجی)
                </span>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Vercel-style minimalist footer */}
      <footer className="mt-auto border-t border-[#1f1f1f] bg-black py-4 px-3 sm:px-6 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-right">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer justify-center sm:justify-start">
            <RadarLogo className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors shrink-0" />
            <span className="group-hover:text-neutral-300 transition-colors">رادار • موتور هوشمند تشخیص تمایل خرید در جامعه کاربری</span>
          </Link>
          <span className="text-neutral-600">میزبانی بومی • دیتابیس پاکت‌بیس • مدل زبانی محلی/آفلاین</span>
        </div>
      </footer>
    </div>
  );
}
