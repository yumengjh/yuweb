import type { ReactNode } from "react";

import { AppShell } from "@/components/app-shell/AppShell";
import { createTranslator, LOCALE_STORAGE_KEY, type SiteLocale } from "@/lib/i18n";
import { siteUrl } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/site-config";

function getStructuredData(locale: SiteLocale) {
  const t = createTranslator(locale);
  const siteName = t(siteConfig.identity.name);
  const description = t(siteConfig.identity.description);

  return JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteName,
      url: siteUrl.toString(),
      description,
      inLanguage: locale,
      publisher: {
        "@type": "Person",
        name: siteName,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: siteName,
      url: siteUrl.toString(),
      description,
      sameAs: ["https://github.com/yumengjh"],
      email: "mailto:hi@yumgjs.com",
    },
  ]);
}

function getBootScript() {
  const i18nConfig = JSON.stringify(siteConfig.i18n);

  return `
    (() => {
      const root = document.documentElement;
      const localeStorageKey = ${JSON.stringify(LOCALE_STORAGE_KEY)};

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

      const applyLocale = () => {
        const config = ${i18nConfig};
        const defaultLocale = config.defaultLocale;
        const supportedLocales = config.supportedLocales;
        const getLocaleSegment = (locale) => String(locale).split("-")[0].toLowerCase();
        const getLocalePrefix = (locale) => (locale === defaultLocale ? "" : "/" + getLocaleSegment(locale));
        const getLocaleFromPathname = (pathname) => {
          for (const locale of supportedLocales) {
            if (locale === defaultLocale) continue;
            const prefix = getLocalePrefix(locale);
            if (pathname === prefix || pathname.startsWith(prefix + "/")) {
              return locale;
            }
          }
          return defaultLocale;
        };
        const stripLocalePrefix = (pathname) => {
          for (const locale of supportedLocales) {
            if (locale === defaultLocale) continue;
            const prefix = getLocalePrefix(locale);
            if (pathname === prefix) return "/";
            if (pathname.startsWith(prefix + "/")) return pathname.slice(prefix.length);
          }
          return pathname || "/";
        };
        const normalizePathnameForRedirect = (pathname) => {
          const normalizedPathname = pathname || "/";
          if (normalizedPathname === "/") return "/";
          let comparablePathname = normalizedPathname;
          while (comparablePathname.length > 1 && comparablePathname.endsWith("/")) {
            comparablePathname = comparablePathname.slice(0, -1);
          }
          return comparablePathname || "/";
        };
        const localizePath = (pathname, locale) => {
          const normalizedPath = stripLocalePrefix(pathname || "/") || "/";
          const prefix = getLocalePrefix(locale);
          if (!prefix) return normalizedPath;
          return normalizedPath === "/" ? prefix : prefix + normalizedPath;
        };
        const resolvePreferredLocale = (languages) => {
          const segmentMap = new Map(
            supportedLocales.map((locale) => [getLocaleSegment(locale), locale]),
          );
          for (const rawLanguage of languages || []) {
            const normalized = String(rawLanguage || "").trim().toLowerCase();
            if (!normalized) continue;
            const exactMatch = supportedLocales.find(
              (locale) => String(locale).toLowerCase() === normalized,
            );
            if (exactMatch) return exactMatch;
            const prefixMatch = segmentMap.get(normalized.split("-")[0]);
            if (prefixMatch) return prefixMatch;
          }
          return defaultLocale;
        };

        if (!config.enabled) {
          root.lang = defaultLocale;
          root.dataset.locale = defaultLocale;
          return;
        }

        const currentPath = window.location.pathname || "/";
        const currentLocale = getLocaleFromPathname(currentPath);
        const storedMode = window.localStorage.getItem(localeStorageKey);
        const mode =
          storedMode === "auto" || supportedLocales.includes(storedMode)
            ? storedMode
            : config.autoDetect
              ? "auto"
              : currentLocale;
        const resolvedLocale =
          supportedLocales.includes(mode)
            ? mode
            : mode === "auto"
              ? resolvePreferredLocale(window.navigator.languages || [window.navigator.language])
              : currentLocale;
        const targetPath = localizePath(currentPath, resolvedLocale);

        root.lang = resolvedLocale;
        root.dataset.locale = resolvedLocale;

        const targetUrl = targetPath + window.location.search + window.location.hash;
        const currentUrl = currentPath + window.location.search + window.location.hash;
        const normalizedTargetUrl =
          normalizePathnameForRedirect(targetPath) + window.location.search + window.location.hash;
        const normalizedCurrentUrl =
          normalizePathnameForRedirect(currentPath) + window.location.search + window.location.hash;

        if (normalizedTargetUrl !== normalizedCurrentUrl) {
          window.location.replace(targetUrl);
        }
      };

      applyTheme();
      applyLocale();
    })();
  `;
}

export function SiteDocument({
  children,
  locale,
}: Readonly<{
  children: ReactNode;
  locale: SiteLocale;
}>) {
  return (
    <body className="font-geist-sans font-geist-mono antialiased">
      <script
        dangerouslySetInnerHTML={{
          __html: getStructuredData(locale),
        }}
        type="application/ld+json"
      />
      <script dangerouslySetInnerHTML={{ __html: getBootScript() }} />
      <AppShell>{children}</AppShell>
    </body>
  );
}
