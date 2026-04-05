import { appRoutes, fallbackRoute, notFoundRoute } from "../data/app-routes.data";
import type {
  AppRouteConfig,
  AppRouteConfigId,
  SiteFooterDomainRule,
} from "../types/site-config.types";

function isPathnameRoute(
  route: AppRouteConfig,
): route is Extract<AppRouteConfig, { pathname: string }> {
  return "pathname" in route;
}

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

export function getRouteConfigById(id: AppRouteConfigId): AppRouteConfig {
  return appRoutes.find((route) => route.id === id) ?? fallbackRoute;
}

export function getRouteConfigByPathname(pathname: string): AppRouteConfig {
  if (!pathname) {
    return fallbackRoute;
  }

  const pathnameRoutes = appRoutes.filter(isPathnameRoute);
  const exactMatch = pathnameRoutes.find(
    (route) => route.match === "exact" && route.pathname === pathname,
  );

  if (exactMatch) {
    return exactMatch;
  }

  const prefixMatch = pathnameRoutes.find(
    (route) =>
      route.match === "prefix" &&
      (pathname === route.pathname || pathname.startsWith(`${route.pathname}/`)),
  );

  return prefixMatch ?? notFoundRoute;
}
