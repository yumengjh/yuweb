import { describe, expect, it } from "vitest";

import sitemap from "@/app/sitemap";

describe("sitemap", () => {
  it("only includes pathname-based routes and excludes system routes like notFound", () => {
    const entries = sitemap();

    expect(entries.length).toBeGreaterThan(0);
    expect(entries.every((entry) => !entry.url.includes("/404/"))).toBe(true);
    expect(entries.every((entry) => !entry.url.endsWith("/404"))).toBe(true);
  });
});
