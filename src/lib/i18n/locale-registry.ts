import { localeCatalogs, supportedLocales } from "./data/locale-catalogs.data";

export { localeCatalogs, supportedLocales };

export type SiteLocale = keyof typeof localeCatalogs;
export type LocaleMode = "auto" | SiteLocale;

export function getLocaleCatalog(locale: SiteLocale) {
  return localeCatalogs[locale];
}
