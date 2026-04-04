import type { Metadata } from "next";

import { SiteDocument } from "@/components/site-document/SiteDocument";
import { buildRootMetadata } from "@/lib/seo/root-metadata";

import "@fontsource/geist/latin.css";
import "@fontsource/geist-mono/latin.css";
import "../globals.scss";

export const metadata: Metadata = buildRootMetadata("zh-CN");

export default function ZhRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" data-locale="zh-CN" suppressHydrationWarning>
      <SiteDocument locale="zh-CN">{children}</SiteDocument>
    </html>
  );
}
