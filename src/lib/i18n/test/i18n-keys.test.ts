import { describe, expect, it } from "vitest";

import enUSMessages from "@/locales/en-US.json";
import zhCNMessages from "@/locales/zh-CN.json";

import { footer, home, route } from "@/lib/i18n-keys";

interface NestedCatalog {
  [key: string]: string | string[] | NestedCatalog;
}

function collectLeafPaths(catalog: NestedCatalog, prefix = ""): string[] {
  return Object.entries(catalog).flatMap(([key, value]) => {
    const nextPath = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") {
      return [nextPath];
    }
    if (Array.isArray(value)) {
      return [];
    }
    return collectLeafPaths(value, nextPath);
  });
}

describe("i18n token tree", () => {
  it("keeps locale JSON leaf paths in sync", () => {
    expect(collectLeafPaths(enUSMessages as NestedCatalog)).toEqual(
      collectLeafPaths(zhCNMessages as NestedCatalog),
    );
  });

  it("exposes token objects with the same nested access shape", () => {
    expect(route.home.title).toBe("route.home.title");
    expect(home.hero.title).toBe("home.hero.title");
    expect(footer.meta.github.text).toBe("footer.meta.github.text");
  });
});
