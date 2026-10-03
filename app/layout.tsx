import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "AI Lead Radar | سامانه هوشمند شناسایی سرنخ و سیگنال خرید",
  description:
    "رادار هوشمند جذب مشتری و تحلیل سیگنال خرید در پیام‌رسان‌ها و انجمن‌های ایرانی (تلگرام، بله، توییتر/X و فروم‌ها). بدون وابستگی به کلادهای خارجی، مبتنی بر پاکت‌بیس محلی و پشتیبانی بومی زبان فارسی.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen selection:bg-emerald-500/30 selection:text-emerald-200">
        {children}
      </body>
    </html>
  );
}
