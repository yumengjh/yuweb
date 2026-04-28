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
      const root = document.documentElement;
      const pathname = window.location.pathname || "/";
      const locale = pathname === "/en" || pathname.startsWith("/en/") ? "en-US" : "zh-CN";

      root.lang = locale;
      root.dataset.locale = locale;

      const applyTheme = () => {
        const themeKey = "site-theme-mode";
        const savedTheme = window.localStorage.getItem(themeKey);
        const themeMode =
          savedTheme === "light" || savedTheme === "dark" || savedTheme === "auto" ? savedTheme : "auto";
        const prefersDark =
          typeof window.matchMedia === "function" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches;
        const resolvedTheme = themeMode === "auto" ? (prefersDark ? "dark" : "light") : themeMode;

        root.dataset.theme = themeMode;
        root.classList.toggle("dark", resolvedTheme === "dark");
      };

      applyTheme();
    })();
  `;
}

export default function GlobalNotFound() {
  return (
    <html lang={defaultLocale} data-locale={defaultLocale} suppressHydrationWarning>
      <body className="font-geist-sans font-geist-mono antialiased selection:bg-[var(--pop-yellow)] selection:text-black">
        <script dangerouslySetInnerHTML={{ __html: getGlobalNotFoundBootScript() }} />
        <GlobalNotFoundBoundary />
      </body>
    </html>
  );
}
