import type { MessageParams, MessageToken } from "../types/i18n.types";
import type { SiteLocale } from "../locale-registry";

const missingMessageWarnings = new Set<string>();

export function formatMessage(template: string, params?: MessageParams) {
  if (!params) {
    return template;
  }

  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = params[key];
    return value === undefined ? `{${key}}` : String(value);
  });
}

export function warnMissingMessage(locale: SiteLocale, token: MessageToken) {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  const warningKey = `${locale}:${token}`;
  if (missingMessageWarnings.has(warningKey)) {
    return;
  }

  missingMessageWarnings.add(warningKey);
  console.warn(`[i18n] Missing message for locale "${locale}": ${token}`);
}
