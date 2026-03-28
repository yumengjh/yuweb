import { appRoutes, fallbackRoute } from "../data/app-routes.data";
import type { AppRouteConfig, AppRouteId, SiteFooterDomainRule } from "../types/site-config.types";

export function normalizeHostname(hostname?: string | null): string {
  if (!hostname) {
    return "";
  }

  return hostname.trim().toLowerCase().replace(/:\d+$/, "");
}

export function matchesDomainRule(
  hostname: string | null | undefined,
  domains?: SiteFooterDomainRule,
): boolean {
  if (!domains) {
    return true;
  }

  const normalizedHostname = normalizeHostname(hostname);

  if (!normalizedHostname) {
    return false;
  }

  const exactMatches = domains.exact?.map(normalizeHostname).filter(Boolean) ?? [];
  if (exactMatches.includes(normalizedHostname)) {
    return true;
  }

  const suffixMatches = domains.suffix?.map(normalizeHostname).filter(Boolean) ?? [];
  return suffixMatches.some(
    (suffix) => normalizedHostname === suffix || normalizedHostname.endsWith(`.${suffix}`),
  );
}

export function getRouteConfigById(id: AppRouteId): AppRouteConfig {
  return appRoutes.find((route) => route.id === id) ?? fallbackRoute;
}

export function getRouteConfigByPathname(pathname: string): AppRouteConfig {
  if (!pathname) {
    return fallbackRoute;
  }

  const exactMatch = appRoutes.find(
    (route) => route.match === "exact" && route.pathname === pathname,
  );

  if (exactMatch) {
    return exactMatch;
  }

  const prefixMatch = appRoutes.find(
    (route) =>
      route.match === "prefix" &&
      (pathname === route.pathname || pathname.startsWith(`${route.pathname}/`)),
  );

  return prefixMatch ?? fallbackRoute;
}
