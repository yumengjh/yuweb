"use client";

import { usePathname } from "next/navigation";

import { getLocaleFromPathname } from "@/lib/i18n";

import { NotFoundPage } from "./NotFoundPage";

export function NotFoundRouteBoundary() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);

  return <NotFoundPage locale={locale} />;
}
