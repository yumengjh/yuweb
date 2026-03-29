import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { AppShell } from "@/components/app-shell/AppShell";
import { createTranslator, LOCALE_STORAGE_KEY } from "@/lib/i18n";
import { getOgImage, siteHandle, siteUrl } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/site-config";

import "./globals.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const defaultLocale = siteConfig.i18n.defaultLocale;
const t = createTranslator(defaultLocale);
const defaultOgImage = getOgImage(defaultLocale);

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: t(siteConfig.identity.name),
  description: t(siteConfig.identity.description),
  applicationName: siteConfig.identity.brandLatin,
  authors: [
    {
      name: t(siteConfig.identity.name),
      url: siteUrl,
    },
  ],
  creator: siteHandle,
  publisher: siteConfig.identity.brandLatin,
  referrer: "origin-when-cross-origin",
  alternates: {
    languages: {
      "zh-CN": "/",
      "en-US": "/en/",
      "x-default": "/",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: siteConfig.identity.brandLatin,
    title: t(siteConfig.identity.name),
    description: t(siteConfig.identity.description),
    locale: "zh_CN",
    images: [defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    creator: siteHandle,
    title: t(siteConfig.identity.name),
    description: t(siteConfig.identity.description),
    images: [defaultOgImage.url],
  },
};

function getStructuredData() {
  const siteName = t(siteConfig.identity.name);
  const description = t(siteConfig.identity.description);

  return JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteName,
      url: siteUrl.toString(),
      description,
      inLanguage: siteConfig.i18n.supportedLocales,
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={defaultLocale} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script
          dangerouslySetInnerHTML={{
            __html: getStructuredData(),
          }}
          type="application/ld+json"
        />
        <script dangerouslySetInnerHTML={{ __html: getBootScript() }} />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
