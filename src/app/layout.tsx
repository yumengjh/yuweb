import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { siteConfig } from "@/lib/site";

import "./globals.scss";

/**
 * 这里集中声明全局字体变量，方便在 `globals.scss` 和组件样式中复用。
 *
 * 建议：
 * - 模板级字体只在 layout 入口维护
 * - 业务组件不要重复在局部引入全局字体
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * 模板的基础元信息统一来自 `siteConfig`。
 *
 * 建议：
 * 后续如果要接入更完整的 SEO 配置，也优先从 `src/lib/site.ts` 扩展，
 * 不要在多个页面里手写重复标题和描述。
 */
export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

/**
 * App Router 的全局根布局。
 *
 * 作用：
 * - 挂载全局样式入口
 * - 注入全局字体变量
 * - 提供整个站点的根 HTML 结构
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
