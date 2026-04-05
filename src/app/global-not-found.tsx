import type { Metadata } from "next";

import { GlobalNotFoundBoundary } from "@/components/not-found-page/GlobalNotFoundBoundary";
import { buildGlobalNotFoundMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/site-config";

import "@fontsource/geist/latin.css";
import "@fontsource/geist-mono/latin.css";
import "./globals.scss";

const defaultLocale = siteConfig.i18n.defaultLocale;

export const metadata: Metadata = buildGlobalNotFoundMetadata();

function getGlobalNotFoundBootScript() {
  return `
    (() => {
      const pathname = window.location.pathname || "/";
      const locale = pathname === "/en" || pathname.startsWith("/en/") ? "en-US" : "zh-CN";
      const root = document.documentElement;

      root.lang = locale;
      root.dataset.locale = locale;
    })();
  `;
}

export default function GlobalNotFound() {
  return (
    <html lang={defaultLocale} data-locale={defaultLocale} suppressHydrationWarning>
      <body className="font-geist-sans font-geist-mono antialiased">
        <script dangerouslySetInnerHTML={{ __html: getGlobalNotFoundBootScript() }} />
        <GlobalNotFoundBoundary />
      </body>
    </html>
  );
}
