import type { Metadata } from "next";

import {
  getOgImage,
  getLanguageAlternates,
  getLocalizedMetadataPath,
  siteHandle,
} from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/site-config";
import type { SiteLocale } from "@/lib/i18n";

export function buildDocsMetadata({
  description,
  locale,
  pathname,
  title,
}: {
  title: string;
  description: string;
  pathname: string;
  locale: SiteLocale;
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
      locale: locale === "en-US" ? "en_US" : "zh_CN",
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
