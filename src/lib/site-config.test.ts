/* cspell:ignore YUMENGJH */

import { describe, expect, it } from "vitest";

import { getRouteConfigById, getRouteConfigByPathname, siteConfig } from "./site-config";

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
});
