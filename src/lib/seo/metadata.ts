import type { Metadata } from "next";

import { createTranslator, localizeHref, type SiteLocale } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";
import type { AppRouteId } from "@/lib/site-config/types/site-config.types";

export const siteUrl = new URL("https://www.yumgjs.com");
export const siteHandle = "@yumengjh";
export const ogImageSize = {
  width: 1200,
  height: 630,
} as const;

const ogLocaleMap = {
  "zh-CN": "zh_CN",
  "en-US": "en_US",
} as const satisfies Record<SiteLocale, string>;

const ogImagePathMap = {
  "zh-CN": "/og/site-zh.png",
  "en-US": "/og/site-en.png",
} as const satisfies Record<SiteLocale, string>;

const ogImageAltMap = {
  "zh-CN": "YUMENGJH open graph cover",
  "en-US": "YUMENGJH open graph cover",
} as const satisfies Record<SiteLocale, string>;

function normalizeMetadataPath(pathname: string) {
  if (pathname === "/") {
    return "/";
  }

  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

export function getLocalizedMetadataPath(pathname: string, locale: SiteLocale) {
  return normalizeMetadataPath(localizeHref(pathname, locale));
}

export function getLanguageAlternates(pathname: string) {
  return {
    "zh-CN": getLocalizedMetadataPath(pathname, "zh-CN"),
    "en-US": getLocalizedMetadataPath(pathname, "en-US"),
    "x-default": normalizeMetadataPath(pathname),
  } as const;
}

export function getOgImage(locale: SiteLocale) {
  const pathname = ogImagePathMap[locale];

  return {
    url: new URL(pathname, siteUrl).toString(),
    alt: ogImageAltMap[locale],
    ...ogImageSize,
  };
}

function buildSharedMetadata({
  description,
  locale,
  pathname,
  title,
}: {
  description: string;
  locale: SiteLocale;
  pathname: string;
  title: string;
}): Metadata {
  const localizedPath = getLocalizedMetadataPath(pathname, locale);
  const ogImage = getOgImage(locale);

  return {
    title,
    description,
    alternates: {
      canonical: localizedPath,
      languages: getLanguageAlternates(pathname),
    },
    openGraph: {
      type: "website",
      url: localizedPath,
      title,
      description,
      siteName: siteConfig.identity.brandLatin,
      locale: ogLocaleMap[locale],
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      creator: siteHandle,
      title,
      description,
      images: [ogImage.url],
    },
  };
}

export function buildHomeMetadata(locale: SiteLocale): Metadata {
  const t = createTranslator(locale);

  return buildSharedMetadata({
    locale,
    pathname: "/",
    title: t(siteConfig.homePage.metadata.title),
    description: t(siteConfig.homePage.metadata.description),
  });
}

export function buildRouteMetadata(
  locale: SiteLocale,
  routeId: Exclude<AppRouteId, "home">,
): Metadata {
  const t = createTranslator(locale);

  return buildSharedMetadata({
    locale,
    pathname: `/${routeId}`,
    title: `${t(siteConfig.routeMeta[routeId].title)} | ${siteConfig.identity.brandLatin}`,
    description: t(siteConfig.routeMeta[routeId].description),
  });
}

export function buildNotFoundMetadata(locale: SiteLocale): Metadata {
  const t = createTranslator(locale);

  return {
    ...buildSharedMetadata({
      locale,
      pathname: "/404",
      title: `${t(siteConfig.notFoundPage.title)} | ${siteConfig.identity.brandLatin}`,
      description: t(siteConfig.notFoundPage.summary),
    }),
    robots: {
      index: false,
      follow: false,
    },
  };
}
export function buildGlobalNotFoundMetadata(): Metadata {
  return {
    metadataBase: siteUrl,
    title: `404 | ${siteConfig.identity.brandLatin}`,
    description: "Page not found / 页面未找到",
    robots: {
      index: false,
      follow: false,
    },
  };
}
