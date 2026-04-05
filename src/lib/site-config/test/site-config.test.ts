import { describe, expect, it } from "vitest";

import { createTranslator } from "@/lib/i18n";

import {
  getRouteConfigById,
  getRouteConfigByPathname,
  matchesDomainRule,
  normalizeHostname,
  siteConfig,
  type SiteFooterMetaItemConfig,
} from "@/lib/site-config";

describe("site-config", () => {
  it("matches route config by pathname", () => {
    expect(getRouteConfigByPathname("/")).toMatchObject({ id: "home" });

    expect(getRouteConfigByPathname("/about")).toMatchObject({ id: "about" });

    expect(getRouteConfigByPathname("/blog/post-1")).toMatchObject({ id: "blog" });

    expect(getRouteConfigByPathname("/notes")).toMatchObject({ id: "notes" });

    expect(getRouteConfigByPathname("/projects/demo")).toMatchObject({ id: "projects" });

    expect(getRouteConfigByPathname("/collections/archive")).toMatchObject({ id: "collections" });

    expect(getRouteConfigByPathname("/missing-page")).toMatchObject({ id: "notFound" });
  });

  it("exposes shared site behavior config and message-key based structures", () => {
    const zhT = createTranslator("zh-CN");

    const enT = createTranslator("en-US");

    expect(siteConfig.i18n.defaultLocale).toBe("zh-CN");

    expect(siteConfig.identity.name).toBe("site.identity.name");

    expect(siteConfig.topNavigationBar.items[0].label).toBe("nav.about.label");

    expect(siteConfig.topNavigationBar.items[1].label).toBe("nav.notes.label");

    expect(siteConfig.footer.links[0].label).toBe("nav.about.label");

    expect(zhT(siteConfig.identity.name)).toBe("鱼梦江湖(@yumengjh)");

    expect(enT(siteConfig.routeMeta.journey.title)).toBe("Journey");

    expect(enT(siteConfig.routeMeta.notes.title)).toBe("Notes");

    expect(getRouteConfigById("journey").layout).toMatchObject({
      showNavigation: true,

      showFooter: true,

      fixedNavigation: false,

      closeNavigationOnScroll: true,

      activeNavigationKey: "journey",
    });
  });

  it("keeps visible copy in messages while base config only stores keys", () => {
    const enT = createTranslator("en-US");

    expect(siteConfig.homePage.hero.title).toBe("home.hero.title");

    expect(siteConfig.notFoundPage.summary).toBe("notFound.summary");

    expect(siteConfig.themeToggle.label).toBe("theme.label");

    expect(siteConfig.languageToggle.triggerAriaLabel).toBe("language.aria.trigger");

    expect(enT(siteConfig.footer.summary)).toContain("ever-evolving personal space");
  });

  it("normalizes hostname and strips port", () => {
    expect(normalizeHostname("WWW.YUMENGJH.COM:3001")).toBe("www.yumengjh.com");

    expect(normalizeHostname("")).toBe("");
  });

  it("matches exact domain rules after normalization", () => {
    expect(
      matchesDomainRule("www.yumengjh.com:443", {
        exact: ["WWW.YUMENGJH.COM"],
      }),
    ).toBe(true);

    expect(
      matchesDomainRule("blog.yumengjh.com", {
        exact: ["yumengjh.com"],
      }),
    ).toBe(false);
  });

  it("matches suffix domain rules for root domains and subdomains", () => {
    expect(
      matchesDomainRule("yumengjh.com", {
        suffix: ["YUMENGJH.COM"],
      }),
    ).toBe(true);

    expect(
      matchesDomainRule("blog.yumengjh.com", {
        suffix: ["yumengjh.com"],
      }),
    ).toBe(true);

    expect(
      matchesDomainRule("fakeyumengjh.com", {
        suffix: ["yumengjh.com"],
      }),
    ).toBe(false);
  });

  it("filters domain-restricted footer meta items by hostname with shared rules", () => {
    const localhostVisible = (
      siteConfig.footer.metaItems as readonly SiteFooterMetaItemConfig[]
    ).filter((item) => matchesDomainRule("localhost", item.domains));

    const externalVisible = (
      siteConfig.footer.metaItems as readonly SiteFooterMetaItemConfig[]
    ).filter((item) => matchesDomainRule("other-domain.com", item.domains));

    expect(localhostVisible).toHaveLength(4);

    expect(externalVisible.map((item) => item.id)).toEqual(["email", "github", "copyright"]);
  });
});
