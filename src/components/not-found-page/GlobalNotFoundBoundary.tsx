"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { AppShell } from "@/components/app-shell/AppShell";
import { createTranslator, getLocaleFromPathname } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";

import { NotFoundPage } from "./NotFoundPage";

function resolvePathname(pathname: string | null) {
  if (pathname) {
    return pathname;
  }

  if (typeof window !== "undefined") {
    return window.location.pathname;
  }

  return "/";
}

export function GlobalNotFoundBoundary() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(resolvePathname(pathname));
  const t = createTranslator(locale);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dataset.locale = locale;
    document.title = `${t(siteConfig.notFoundPage.title)} | ${siteConfig.identity.brandLatin}`;
  }, [locale, t]);

  return (
    <AppShell>
      <NotFoundPage locale={locale} />
    </AppShell>
  );
}
