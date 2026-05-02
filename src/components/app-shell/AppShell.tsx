"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { SiteFooter } from "@/components/site-footer/SiteFooter";
import { ExploreMenu } from "@/components/top-navigation-bar/ExploreMenu";
import {
  TopNavigationBar,
  type MenuContent,
  type MenuEntry,
  type MenuGroup,
  type NavigationItem,
} from "@/components/top-navigation-bar/TopNavigationBar";
import {
  createTranslator,
  getLocaleFromPathname,
  localizeHref,
  stripLocalePrefix,
} from "@/lib/i18n";
import {
  getRouteConfigByPathname,
  siteConfig,
  type SiteNavigationEntryConfig,
  type SiteNavigationGroupConfig,
  type SiteNavigationItemConfig,
} from "@/lib/site-config";

import styles from "./AppShell.module.scss";

function toMenuEntry(
  locale: ReturnType<typeof getLocaleFromPathname>,
  t: ReturnType<typeof createTranslator>,
  entry: SiteNavigationEntryConfig,
): MenuEntry {
  return {
    href: localizeHref(entry.href, locale),
    target: entry.target,
    title: t(entry.title),
    description: entry.description ? t(entry.description) : undefined,
  };
}

function toMenuGroups(
  locale: ReturnType<typeof getLocaleFromPathname>,
  t: ReturnType<typeof createTranslator>,
  groups: readonly SiteNavigationGroupConfig[],
): MenuGroup[] {
  return groups.map((group) => ({
    label: group.label ? t(group.label) : undefined,
    entries: group.entries.map((entry) => toMenuEntry(locale, t, entry)),
  }));
}

function toMenuContent(
  locale: ReturnType<typeof getLocaleFromPathname>,
  t: ReturnType<typeof createTranslator>,
  content: SiteNavigationItemConfig["menu"],
): MenuContent | undefined {
  if (!content) {
    return undefined;
  }

  if (content.kind === "entries") {
    return {
      kind: "entries",
      entries: content.entries.map((entry) => toMenuEntry(locale, t, entry)),
    };
  }

  if (content.kind === "component") {
    return {
      kind: "component",
      contentId: content.contentId,
    };
  }

  return {
    kind: "groups",
    groups: toMenuGroups(locale, t, content.groups),
  };
}

function toMobileMenuGroups(
  locale: ReturnType<typeof getLocaleFromPathname>,
  t: ReturnType<typeof createTranslator>,
  groups: readonly SiteNavigationGroupConfig[] | undefined,
): MenuGroup[] | undefined {
  if (!groups) {
    return undefined;
  }

  return toMenuGroups(locale, t, groups);
}

function buildNavigationItems(locale: ReturnType<typeof getLocaleFromPathname>): NavigationItem[] {
  const t = createTranslator(locale);

  return (siteConfig.topNavigationBar.items as readonly SiteNavigationItemConfig[]).map((item) => ({
    key: item.key,
    href: item.href ? localizeHref(item.href, locale) : undefined,
    label: t(item.label),
    menu: toMenuContent(locale, t, item.menu),
    mobileMenu: toMobileMenuGroups(locale, t, item.mobileMenu),
  }));
}

function buildNavigationLabels(locale: ReturnType<typeof getLocaleFromPathname>) {
  const t = createTranslator(locale);

  return {
    navAriaLabel: t(siteConfig.topNavigationBar.labels.navAriaLabel),
    desktopMenuAriaLabel: t(siteConfig.topNavigationBar.labels.desktopMenuAriaLabel),
    openMenuLabel: t(siteConfig.topNavigationBar.labels.openMenuLabel),
    closeMenuLabel: t(siteConfig.topNavigationBar.labels.closeMenuLabel),
  };
}

function buildMobileFooterLines(locale: ReturnType<typeof getLocaleFromPathname>) {
  const t = createTranslator(locale);
  return siteConfig.topNavigationBar.mobileFooter.lines.map((key) => t(key));
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const route = getRouteConfigByPathname(stripLocalePrefix(pathname));

  return (
    <>
      {route.layout.showNavigation && (
        <TopNavigationBar
          activeKey={route.layout.activeNavigationKey}
          closeOnScroll={route.layout.closeNavigationOnScroll}
          fixed={route.layout.fixedNavigation}
          brandHref={localizeHref("/", locale)}
          items={buildNavigationItems(locale)}
          labels={buildNavigationLabels(locale)}
          mobileFooterLines={buildMobileFooterLines(locale)}
          transitionConfig={siteConfig.topNavigationBar.transition}
          componentMap={{ "explore-menu": ExploreMenu }}
        />
      )}

      {route.layout.showNavigation && route.layout.fixedNavigation && (
        <div aria-hidden="true" className={styles.fixedOffset} />
      )}

      {children}

      {route.layout.showFooter && <SiteFooter locale={locale} />}
    </>
  );
}
