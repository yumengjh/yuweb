import type { Metadata } from "next";

import { createTranslator, type SiteLocale } from "@/lib/i18n";
import { getLocalizedMetadataPath, getOgImage, siteHandle, siteUrl } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/site-config";

const ogLocaleMap = {
  "zh-CN": "zh_CN",
  "en-US": "en_US",
} as const satisfies Record<SiteLocale, string>;

export function buildRootMetadata(locale: SiteLocale): Metadata {
  const t = createTranslator(locale);
  const ogImage = getOgImage(locale);
  const rootPath = getLocalizedMetadataPath("/", locale);

  return {
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
      url: rootPath,
      siteName: siteConfig.identity.brandLatin,
      title: t(siteConfig.identity.name),
      description: t(siteConfig.identity.description),
      locale: ogLocaleMap[locale],
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      creator: siteHandle,
      title: t(siteConfig.identity.name),
      description: t(siteConfig.identity.description),
      images: [ogImage.url],
    },
  };
}
