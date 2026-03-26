"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { SelectMenu, type SelectMenuOption } from "@/components/common/select-menu/SelectMenu";
import {
  createTranslator,
  getLocaleModeFromStorage,
  getLocaleModeOrder,
  LOCALE_STORAGE_KEY,
  resolveLocaleForMode,
  switchLocalePath,
  type LocaleMode,
  type SiteLocale,
} from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";

function getCurrentPathname(pathname: string) {
  if (typeof window === "undefined") {
    return pathname;
  }

  return `${pathname}${window.location.search}${window.location.hash}`;
}

export function LanguageToggleButton({
  className,
  locale,
}: {
  className?: string;
  locale: SiteLocale;
}) {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const [mode, setMode] = useState<LocaleMode>(() => getLocaleModeFromStorage(pathname));
  const t = createTranslator(locale);
  const modeOrder = useMemo(() => getLocaleModeOrder(), []);
  const options = useMemo<readonly SelectMenuOption<LocaleMode>[]>(
    () =>
      modeOrder.map((localeMode) => ({
        value: localeMode,
        label: t(siteConfig.languageToggle.modeLabels[localeMode]),
      })),
    [modeOrder, t],
  );

  useEffect(() => {
    setMode(getLocaleModeFromStorage(pathname));
  }, [pathname]);

  if (!siteConfig.i18n.enabled) {
    return null;
  }

  const handleValueChange = (nextMode: LocaleMode) => {
    if (nextMode === mode) {
      return;
    }

    const nextLocale = resolveLocaleForMode(
      nextMode,
      typeof navigator === "undefined" ? [] : navigator.languages,
    );
    const nextPath = switchLocalePath(getCurrentPathname(pathname), nextLocale);

    setMode(nextMode);
    window.localStorage.setItem(LOCALE_STORAGE_KEY, nextMode);
    router.push(nextPath);
  };

  const modeLabel = t(siteConfig.languageToggle.modeLabels[mode]);

  return (
    <SelectMenu
      className={className}
      menuAriaLabel={t(siteConfig.languageToggle.menuAriaLabel)}
      onValueChange={handleValueChange}
      options={options}
      side="top"
      triggerAriaLabel={t(siteConfig.languageToggle.triggerAriaLabel, { mode: modeLabel })}
      triggerLabel={`${t(siteConfig.languageToggle.label)} / ${modeLabel}`}
      value={mode}
    />
  );
}
