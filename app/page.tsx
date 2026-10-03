"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { MetricsHeader } from "@/components/MetricsHeader";
import { LeadCard } from "@/components/LeadCard";
import {
  SparklesIcon,
  RefreshIcon,
  PlayIcon,
  RadarIcon,
} from "@/components/Icons";
import { getPocketBaseClient, type LeadRecord, type ProductRecord } from "@/lib/pocketbase";
import { calculateRadarMetrics, toPersianDigits } from "@/lib/pricing";

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

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (selectedIntent !== "all" && lead.intent_level !== selectedIntent) {
        return false;
      }
      if (selectedStatus !== "all" && lead.lead_status !== selectedStatus) {
        return false;
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
  }, [leads, selectedIntent, selectedStatus, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-[#ededed]">
      <Navbar onSimulateFeed={handleSimulateFeed} isSimulating={isSimulating} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Active Product Banner (Vercel Project Card Style) */}
        {activeProduct && (
          <div className="p-4 rounded-lg bg-[#0a0a0a] border border-[#1f1f1f] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2.5 py-0.5 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-400 font-medium">
                  محصول هدف
                </span>
                <h1 className="text-sm sm:text-base font-semibold text-white tracking-tight">
                  {activeProduct.name}
                </h1>
              </div>
              <p className="text-xs text-neutral-400 max-w-3xl line-clamp-1">
                {activeProduct.tagline || activeProduct.description}
              </p>
            </div>

            <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
              <button
                onClick={fetchData}
                className="h-8 px-3 rounded-md bg-[#111111] hover:bg-[#1a1a1a] border border-[#262626] text-xs text-neutral-300 transition-colors flex items-center gap-1.5"
                title="بروزرسانی داده‌ها"
              >
                <RefreshIcon className="w-3.5 h-3.5 text-neutral-400" />
                <span>بروزرسانی داده‌ها</span>
              </button>
            </div>
          </div>
        )}

        {/* Live Simulation Alert */}
        {simulatedAlert && (
          <div className="p-3 rounded-lg bg-[#0c0c0c] border border-[#262626] text-xs text-neutral-200 flex items-center justify-between gap-2 shadow-lg">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00e599]" />
              <span>{simulatedAlert.message}</span>
            </div>
            <button
              onClick={() => setSimulatedAlert(null)}
              className="text-neutral-500 hover:text-neutral-200 text-xs px-2"
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
            <span className="text-[11px] font-num px-2 py-0.5 rounded-md bg-neutral-900 text-neutral-400 border border-neutral-800">
              {toPersianDigits(filteredLeads.length)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e599]" />
            <span className="hidden sm:inline">ارتباط زنده لحظه‌ای (SSE)</span>
          </div>
        </div>

        {/* Leads Feed */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3 text-neutral-500 text-xs">
            <RefreshIcon className="w-5 h-5 animate-spin text-neutral-400" />
            <span>در حال بارگذاری جریان سرنخ‌ها...</span>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="py-16 px-4 rounded-lg border border-dashed border-[#222222] text-center space-y-3 bg-[#050505]">
            <div className="w-10 h-10 mx-auto rounded-md bg-[#111] border border-[#222] flex items-center justify-center text-neutral-400">
              <RadarIcon className="w-5 h-5 text-neutral-300" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-neutral-200">
                هیچ پیامی با فیلترهای انتخابی موجود نیست
              </h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                برای تزریق پیام جدید و مشاهده تریاژ هوشمند، دکمه «تزریق زنده پیام» را بزنید.
              </p>
            </div>
            <button
              onClick={handleSimulateFeed}
              disabled={isSimulating}
              className="h-8 px-4 rounded-md bg-white text-black hover:bg-[#e6e6e6] text-xs font-medium inline-flex items-center gap-1.5 transition-all active:scale-95"
            >
              <PlayIcon className="w-3 h-3 text-black" />
              <span>تزریق زنده پیام</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
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

      {/* Vercel-style minimalist footer */}
      <footer className="mt-auto border-t border-[#1f1f1f] bg-black py-4 px-4 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>رادار هوشمند سرنخ • موتور تشخیص تمایل خرید در جامعه کاربری</span>
          <span className="text-neutral-600">میزبانی بومی • دیتابیس پاکت‌بیس • مدل زبانی محلی/آفلاین</span>
        </div>
      </footer>
    </div>
  );
}
