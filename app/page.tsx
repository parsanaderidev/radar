"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { MetricsHeader } from "@/components/MetricsHeader";
import { LeadCard } from "@/components/LeadCard";
import {
  SparklesIcon,
  RefreshIcon,
  PlayIcon,
  HighIntentIcon,
  ProblemAwareIcon,
  NoiseIcon,
  RadarIcon,
} from "@/components/Icons";
import { getPocketBaseClient, type LeadRecord, type ProductRecord } from "@/lib/pocketbase";
import { calculateRadarMetrics } from "@/lib/pricing";

export default function LeadRadarDashboard() {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [totalRawMessages, setTotalRawMessages] = useState<number>(0);
  const [activeProduct, setActiveProduct] = useState<ProductRecord | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulatedAlert, setSimulatedAlert] = useState<{ message: string; type: "success" | "info" } | null>(null);

  // Filters
  const [selectedIntent, setSelectedIntent] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const pb = useMemo(() => getPocketBaseClient(), []);

  // Fetch leads and metrics data
  const fetchData = useCallback(async () => {
    try {
      // 1. Fetch leads
      const leadsRes = await pb.collection("leads").getFullList<LeadRecord>({
        sort: "-created",
        expand: "raw_message_id.source_id,product_id",
      });
      setLeads(leadsRes);

      // 2. Fetch total raw messages count
      const rawRes = await pb.collection("raw_messages").getList(1, 1);
      setTotalRawMessages(rawRes.totalItems);

      // 3. Fetch active product
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

  // Initial load and Real-time SSE subscription
  useEffect(() => {
    fetchData();

    // Subscribe to PocketBase SSE for real-time lead triage updates
    let isSubscribed = false;
    pb.collection("leads")
      .subscribe("*", async (e) => {
        if (e.action === "create") {
          // Fetch expanded record for newly created lead
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

    // Fallback periodic poll every 10 seconds to ensure freshness
    const interval = setInterval(() => {
      fetchData();
    }, 10000);

    return () => {
      clearInterval(interval);
      if (isSubscribed) {
        pb.collection("leads").unsubscribe("*").catch(() => {});
      }
    };
  }, [fetchData, pb]);

  // Handle lead status updates
  const handleUpdateStatus = async (
    leadId: string,
    status: "new" | "approved" | "contacted" | "dismissed"
  ) => {
    try {
      await pb.collection("leads").update(leadId, { lead_status: status });
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
      if (res.ok && data.success && data.lead) {
        setLeads((prev) => [data.lead, ...prev.filter((l) => l.id !== data.lead.id)]);
        setTotalRawMessages((prev) => prev + 1);

        const levelLabel =
          data.lead.intent_level === "high_intent"
            ? "🔥 سرنخ خرید قطعی (High Intent)"
            : data.lead.intent_level === "problem_aware"
            ? "⚠️ سرنخ دردمند (Problem Aware)"
            : data.lead.intent_level === "curious"
            ? "💡 پرسشگر (Curious)"
            : "🗑️ نویز فیلترشده";

        setSimulatedAlert({
          message: `پیام جدید از ${data.lead.expand?.raw_message_id?.author_handle} وارد شد: ${levelLabel}`,
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

  // Compute live metrics
  const metrics = useMemo(() => {
    return calculateRadarMetrics(leads, totalRawMessages);
  }, [leads, totalRawMessages]);

  // Filtered leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Intent filter
      if (selectedIntent !== "all" && lead.intent_level !== selectedIntent) {
        return false;
      }
      // Status filter
      if (selectedStatus !== "all" && lead.lead_status !== selectedStatus) {
        return false;
      }
      // Search query
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
  }, [leads, selectedIntent, selectedStatus, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-[#080d16] text-slate-100">
      <Navbar onSimulateFeed={handleSimulateFeed} isSimulating={isSimulating} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Active Product Banner */}
        {activeProduct && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-emerald-950/20 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-medium border border-emerald-500/30">
                  محصول تحت رصد
                </span>
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {activeProduct.name}
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 max-w-3xl">
                {activeProduct.tagline || activeProduct.description}
              </p>
            </div>

            <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
              <button
                onClick={fetchData}
                className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300 transition-colors flex items-center gap-1.5"
                title="بروزرسانی داده‌ها"
              >
                <RefreshIcon className="w-3.5 h-3.5 text-slate-400" />
                <span>بروزرسانی</span>
              </button>
            </div>
          </div>
        )}

        {/* Live Simulation Alert Notification */}
        {simulatedAlert && (
          <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs sm:text-sm flex items-center justify-between gap-2 shadow-lg animate-fade-in">
            <div className="flex items-center gap-2">
              <SparklesIcon className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{simulatedAlert.message}</span>
            </div>
            <button
              onClick={() => setSimulatedAlert(null)}
              className="text-emerald-400 hover:text-emerald-200 text-xs px-2 py-0.5"
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

        {/* Leads Feed Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span>جریان لحظه‌ای پیام‌ها و سرنخ‌ها</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                {filteredLeads.length} مورد
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="hidden sm:inline">اتصال زنده به رویدادهای پاکت‌بیس (SSE)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>

        {/* Leads List or Empty State */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4 text-slate-400">
            <RefreshIcon className="w-8 h-8 animate-spin text-emerald-400" />
            <p className="text-sm">در حال بارگذاری سرنخ‌ها و اشتراک زنده...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="py-16 px-4 rounded-2xl border border-dashed border-slate-800 text-center space-y-4 bg-slate-900/30">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400">
              <RadarIcon className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-semibold text-slate-200">
                هیچ پیامی با فیلترهای فعلی یافت نشد
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                برای مشاهده کارکرد رادار هوشمند در زمان واقعی، دکمه «تزریق زنده پیام‌ها» را کلیک کنید تا پیام‌های جوامع ایرانی پردازش شوند.
              </p>
            </div>
            <button
              onClick={handleSimulateFeed}
              disabled={isSimulating}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-950/40 inline-flex items-center gap-2 transition-all active:scale-95"
            >
              <PlayIcon className="w-4 h-4" />
              <span>تزریق اولین پیام نمونه (Simulate)</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLeads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AI Lead Radar © 2026 — طراحی‌شده ویژه اکوسیستم و جوامع آنلاین ایران</span>
          <span className="font-mono text-slate-600">Zero Foreign Cloud • Self-Hosted PocketBase & Local LLM</span>
        </div>
      </footer>
    </div>
  );
}
