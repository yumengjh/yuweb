/* cspell:ignore YUMENGJH */

import type { SiteFooterMetaItem } from "./site-config";
import { describe, expect, it } from "vitest";

import {
  getRouteConfigById,
  getRouteConfigByPathname,
  getVisibleFooterMetaItems,
  matchesDomainRule,
  normalizeHostname,
  siteConfig,
} from "./site-config";

describe("site-config", () => {
  it("matches route config by pathname", () => {
    expect(getRouteConfigByPathname("/")).toMatchObject({ id: "home" });
    expect(getRouteConfigByPathname("/about")).toMatchObject({ id: "about" });
    expect(getRouteConfigByPathname("/blog/post-1")).toMatchObject({ id: "blog" });
  });

  it("exposes shared site and layout config", () => {
    expect(siteConfig.name.length).toBeGreaterThan(0);
    expect(siteConfig.brandLatin).toBe("YUMENGJH");
    expect(getRouteConfigById("journey").layout).toMatchObject({
      showNavigation: true,
      showFooter: true,
      fixedNavigation: false,
      closeNavigationOnScroll: true,
    });
    expect(getRouteConfigById("journey").layout.activeNavigationKey).toBeTruthy();
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

  it("filters visible footer meta items by hostname", () => {
    const originalMetaItems = [...siteConfig.footer.metaItems];
    const testMetaItems: SiteFooterMetaItem[] = [
      {
        id: "copyright",
        label: "版权",
        text: "© 2026 鱼梦江湖",
      },
      {
        id: "icp",
        label: "备案号",
        text: "沪ICP备00000000号",
        domains: {
          exact: ["www.yumengjh.com"],
        },
      },
      {
        id: "police",
        label: "公安备案",
        text: "沪公网安备00000000000000号",
        domains: {
          suffix: ["yumengjh.com"],
        },
      },
    ];

    siteConfig.footer.metaItems = testMetaItems;

    try {
      expect(getVisibleFooterMetaItems()).toEqual([testMetaItems[0]]);
      expect(getVisibleFooterMetaItems("www.yumengjh.com")).toEqual(testMetaItems);
      expect(getVisibleFooterMetaItems("blog.yumengjh.com")).toEqual([
        testMetaItems[0],
        testMetaItems[2],
      ]);
      expect(getVisibleFooterMetaItems("other-domain.com").filter((item) => item.domains)).toEqual(
        [],
      );
      expect(getVisibleFooterMetaItems("exclusive-only.com")).toEqual([testMetaItems[0]]);
    } finally {
      siteConfig.footer.metaItems = originalMetaItems;
    }
  });

  it("returns an empty meta item list when nothing matches the current domain", () => {
    const originalMetaItems = [...siteConfig.footer.metaItems];
    const testMetaItems: SiteFooterMetaItem[] = [
      {
        id: "icp",
        label: "备案号",
        text: "沪ICP备00000000号",
        domains: {
          exact: ["beian.yumengjh.com"],
        },
      },
    ];

    siteConfig.footer.metaItems = testMetaItems;

    try {
      expect(getVisibleFooterMetaItems()).toEqual([]);
      expect(getVisibleFooterMetaItems("other-domain.com")).toEqual([]);
    } finally {
      siteConfig.footer.metaItems = originalMetaItems;
    }
  });
});
