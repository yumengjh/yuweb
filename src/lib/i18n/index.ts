import { siteConfig } from "@/lib/site-config";

import { flatLocaleCatalogs } from "./helpers/catalog.helpers";
import { formatMessage, warnMissingMessage } from "./helpers/message.helpers";
import {
  getDefaultLocale,
  getLocaleFromPathname,
  getLocalePrefix,
  getLocaleSegment,
  getNonDefaultLocales,
  getSupportedLocales,
  localizeHref,
  resolvePreferredLocale,
  stripLocalePrefix,
  switchLocalePath,
} from "./helpers/path.helpers";
import type { LocaleMode, SiteLocale } from "./locale-registry";
import { getLocaleCatalog, supportedLocales } from "./locale-registry";
import type { MessageParams, MessageToken } from "./types/i18n.types";

export type { LocaleMode, SiteLocale } from "./locale-registry";
export type { MessageParams, MessageToken } from "./types/i18n.types";
export {
  getDefaultLocale,
  getLocaleFromPathname,
  getLocalePrefix,
  getLocaleSegment,
  getNonDefaultLocales,
  getSupportedLocales,
  localizeHref,
  resolvePreferredLocale,
  stripLocalePrefix,
  switchLocalePath,
};

export const LOCALE_STORAGE_KEY = "site-locale-mode";
export const MISSING_MESSAGE = "The vocabulary was not found!";

export function isSiteLocale(value: unknown): value is SiteLocale {
  return typeof value === "string" && getSupportedLocales().includes(value as SiteLocale);
}

export function isLocaleMode(value: unknown): value is LocaleMode {
  return value === "auto" || isSiteLocale(value);
}

export function getLocaleModeOrder(): LocaleMode[] {
  if (!siteConfig.i18n.enabled) {
    return [getDefaultLocale()];
  }

  return siteConfig.i18n.autoDetect ? ["auto", ...supportedLocales] : [...supportedLocales];
}

export function getLocaleModeFromStorage(pathname?: string): LocaleMode {
  if (typeof window === "undefined" || !siteConfig.i18n.enabled) {
    return getDefaultLocale();
  }

  const storedValue = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  if (!isLocaleMode(storedValue)) {
    return siteConfig.i18n.autoDetect ? "auto" : getLocaleFromPathname(pathname);
  }

  if (!siteConfig.i18n.autoDetect && storedValue === "auto") {
    return getLocaleFromPathname(pathname);
  }

  return storedValue;
}

export function resolveLocaleForMode(
  mode: LocaleMode,
  navigatorLanguages: readonly string[] | null | undefined,
): SiteLocale {
  if (isSiteLocale(mode)) {
    return mode;
  }

  return resolvePreferredLocale(navigatorLanguages);
}

export function hasMessage(token: MessageToken, locale: SiteLocale = getDefaultLocale()): boolean {
  return Object.hasOwn(flatLocaleCatalogs[locale], token);
}

export function t(
  token: MessageToken,
  localeOrParams?: SiteLocale | MessageParams,
  params?: MessageParams,
): string {
  const locale = isSiteLocale(localeOrParams) ? localeOrParams : getDefaultLocale();
  const resolvedParams = isSiteLocale(localeOrParams) ? params : localeOrParams;
  const message = flatLocaleCatalogs[locale][token];

  if (!message) {
    warnMissingMessage(locale, token);
    return MISSING_MESSAGE;
  }

  return formatMessage(message, resolvedParams);
}

export function createTranslator(locale: SiteLocale) {
  return (token: MessageToken, params?: MessageParams) => t(token, locale, params);
}

export function getLocaleValue<T = unknown>(locale: SiteLocale, path: string): T | undefined {
  const segments = path.split(".").filter(Boolean);
  let current: unknown = siteConfig.i18n.enabled ? getLocaleCatalog(locale) : undefined;

  for (const segment of segments) {
    if (!current || typeof current !== "object" || !(segment in current)) {
      return undefined;
    }

    current = (current as Record<string, unknown>)[segment];
  }

  return current as T;
}
