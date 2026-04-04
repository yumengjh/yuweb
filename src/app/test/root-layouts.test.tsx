import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("app root locale layouts", () => {
  it("keeps zh and en in separate root layouts so html lang is correct before hydration", () => {
    const appDir = path.resolve(process.cwd(), "src/app");
    const zhLayoutPath = path.join(appDir, "(zh)", "layout.tsx");
    const enLayoutPath = path.join(appDir, "(en)", "layout.tsx");
    const legacyLayoutPath = path.join(appDir, "layout.tsx");

    expect(existsSync(zhLayoutPath)).toBe(true);
    expect(existsSync(enLayoutPath)).toBe(true);
    expect(existsSync(legacyLayoutPath)).toBe(false);

    const zhLayoutSource = readFileSync(zhLayoutPath, "utf8");
    const enLayoutSource = readFileSync(enLayoutPath, "utf8");

    expect(zhLayoutSource).toContain('<html lang="zh-CN"');
    expect(zhLayoutSource).toContain('data-locale="zh-CN"');
    expect(enLayoutSource).toContain('<html lang="en-US"');
    expect(enLayoutSource).toContain('data-locale="en-US"');
    expect(zhLayoutSource).toContain('buildRootMetadata("zh-CN")');
    expect(enLayoutSource).toContain('buildRootMetadata("en-US")');
  });
});
