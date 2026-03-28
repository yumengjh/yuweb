import { siteConfig } from "@/lib/site-config";

import type { SiteLocale } from "../locale-registry";
import { supportedLocales } from "../locale-registry";

function splitHref(href: string) {
  const hashIndex = href.indexOf("#");
  const searchIndex = href.indexOf("?");
  const cutIndex =
    hashIndex === -1
      ? searchIndex
      : searchIndex === -1
        ? hashIndex
        : Math.min(hashIndex, searchIndex);

  if (cutIndex === -1) {
    return { pathname: href, suffix: "" };
  }

  return {
    pathname: href.slice(0, cutIndex),
    suffix: href.slice(cutIndex),
  };
}

function isInternalPath(href: string) {
  return href.startsWith("/");
}

export function getSupportedLocales() {
  return siteConfig.i18n.supportedLocales;
}

export function getDefaultLocale(): SiteLocale {
  return siteConfig.i18n.defaultLocale;
}

export function getLocaleSegment(locale: SiteLocale) {
  return locale.split("-")[0].toLowerCase();
}

export function getNonDefaultLocales() {
  return getSupportedLocales().filter((locale) => locale !== getDefaultLocale());
}

export function getLocalePrefix(locale: SiteLocale): string {
  if (locale === getDefaultLocale()) {
    return "";
  }

  return `/${getLocaleSegment(locale)}`;
}

export function getLocaleFromPathname(pathname: string | null | undefined): SiteLocale {
  if (!siteConfig.i18n.enabled) {
    return getDefaultLocale();
  }

  const normalizedPathname = pathname || "/";

  for (const locale of getNonDefaultLocales()) {
    const prefix = getLocalePrefix(locale);
    if (normalizedPathname === prefix || normalizedPathname.startsWith(`${prefix}/`)) {
      return locale;
    }
  }

  return getDefaultLocale();
}

export function stripLocalePrefix(pathname: string | null | undefined): string {
  const normalizedPathname = pathname || "/";

  for (const locale of getNonDefaultLocales()) {
    const prefix = getLocalePrefix(locale);
    if (!prefix) {
      continue;
    }

    if (normalizedPathname === prefix) {
      return "/";
    }

    if (normalizedPathname.startsWith(`${prefix}/`)) {
      return normalizedPathname.slice(prefix.length);
    }
  }

  return normalizedPathname;
}

export function localizeHref(href: string, locale: SiteLocale): string {
  if (!siteConfig.i18n.enabled || !href || !isInternalPath(href)) {
    return href;
  }

  const { pathname, suffix } = splitHref(href);
  const normalizedPath = stripLocalePrefix(pathname) || "/";
  const prefix = getLocalePrefix(locale);

  if (!prefix) {
    return `${normalizedPath}${suffix}`;
  }

  const localizedPath = normalizedPath === "/" ? prefix : `${prefix}${normalizedPath}`;
  return `${localizedPath}${suffix}`;
}

export function switchLocalePath(currentPath: string, locale: SiteLocale): string {
  if (!currentPath) {
    return localizeHref("/", locale);
  }

  return localizeHref(currentPath, locale);
}

export function resolvePreferredLocale(
  navigatorLanguages: readonly string[] | null | undefined,
): SiteLocale {
  const languages = navigatorLanguages ?? [];
  const supported = supportedLocales;
  const segmentToLocale = new Map(
    supported.map((locale) => [getLocaleSegment(locale), locale] as const),
  );

  for (const language of languages) {
    const normalizedLanguage = language.trim().toLowerCase();
    if (!normalizedLanguage) {
      continue;
    }

    const exactMatch = supported.find((locale) => locale.toLowerCase() === normalizedLanguage);
    if (exactMatch) {
      return exactMatch;
    }

    const prefixMatch = segmentToLocale.get(normalizedLanguage.split("-")[0]);
    if (prefixMatch) {
      return prefixMatch;
    }
  }

  return getDefaultLocale();
}
