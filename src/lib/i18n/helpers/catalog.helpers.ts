import { localeCatalogs } from "../locale-registry";
import type { FlatMessageCatalog, NestedMessageCatalog } from "../types/i18n.types";
import type { SiteLocale } from "../locale-registry";

export function flattenCatalog(catalog: NestedMessageCatalog, prefix = ""): FlatMessageCatalog {
  const entries = Object.entries(catalog).flatMap(([key, value]) => {
    const nextPath = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "string") {
      return [[nextPath, value] as const];
    }

    if (Array.isArray(value)) {
      return [];
    }

    return Object.entries(flattenCatalog(value as NestedMessageCatalog, nextPath));
  });

  return Object.fromEntries(entries);
}

export const flatLocaleCatalogs = Object.fromEntries(
  Object.entries(localeCatalogs).map(([locale, catalog]) => [
    locale,
    flattenCatalog(catalog as NestedMessageCatalog),
  ]),
) as Record<SiteLocale, FlatMessageCatalog>;
