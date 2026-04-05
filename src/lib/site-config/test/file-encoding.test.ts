import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const filesToCheck = [
  "src/lib/site-config/data/app-routes.data.ts",
  "src/lib/site-config/types/site-config.types.ts",
  "src/lib/site-config/helpers/site-config.helpers.ts",
  "src/app/sitemap.ts",
] as const;

describe("site-config file encoding", () => {
  it("keeps touched files in UTF-8 BOM and preserves readable Chinese comments", () => {
    for (const relativePath of filesToCheck) {
      const absolutePath = path.resolve(process.cwd(), relativePath);
      const contentBuffer = readFileSync(absolutePath);

      expect(Array.from(contentBuffer.subarray(0, 3))).toEqual([0xef, 0xbb, 0xbf]);

      const content = contentBuffer.toString("utf8");

      if (relativePath.endsWith("app-routes.data.ts")) {
        expect(content).toContain("缺点：这里只能覆盖“未知 pathname 触发的 404”导航");
      }
    }
  });
});
