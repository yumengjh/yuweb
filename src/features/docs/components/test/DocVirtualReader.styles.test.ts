import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const stylesheetPath = "F:/yuweb/src/features/docs/components/DocVirtualReader.module.scss";

describe("DocVirtualReader layout stylesheet", () => {
  it("keeps rows in normal document flow instead of absolute positioning", () => {
    const source = readFileSync(stylesheetPath, "utf8");

    expect(source).toContain(".row {");
    expect(source).not.toMatch(/\.row\s*\{[\s\S]*?position:\s*absolute/);
    expect(source).toContain(".loadMoreSentinel");
  });
});
