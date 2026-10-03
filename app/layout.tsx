import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "رادار | سامانه هوشمند شناسایی سیگنال خرید",
  description:
    "رادار - سامانه هوشمند جذب مشتری و تحلیل سیگنال خرید در پیام‌رسان‌ها و انجمن‌های ایرانی (تلگرام، بله، توییتر/X و فروم‌ها). بدون وابستگی به کلادهای خارجی، مبتنی بر پاکت‌بیس محلی و پشتیبانی بومی زبان فارسی.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className="dark">
      <body className="bg-[#000000] text-[#ededed] min-h-screen selection:bg-white selection:text-black antialiased">
        {children}
      </body>
    </html>
  );
}
