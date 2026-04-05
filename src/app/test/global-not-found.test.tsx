import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("global not found", () => {
  it("keeps a dedicated global 404 page for unmatched routes", () => {
    const appDir = path.resolve(process.cwd(), "src/app");
    const globalNotFoundPath = path.join(appDir, "global-not-found.tsx");
    const nextConfigPath = path.resolve(process.cwd(), "next.config.ts");

    expect(existsSync(globalNotFoundPath)).toBe(true);
    expect(existsSync(nextConfigPath)).toBe(true);

    const globalNotFoundSource = readFileSync(globalNotFoundPath, "utf8");
    const nextConfigSource = readFileSync(nextConfigPath, "utf8");

    expect(globalNotFoundSource).toContain("GlobalNotFoundBoundary");
    expect(globalNotFoundSource).toContain("buildGlobalNotFoundMetadata()");
    expect(globalNotFoundSource).toContain("<html lang={defaultLocale}");
    expect(globalNotFoundSource).toContain('import "./globals.scss"');
    expect(globalNotFoundSource).toContain("getGlobalNotFoundBootScript");
    expect(nextConfigSource).toContain("globalNotFound: true");
  });
});
