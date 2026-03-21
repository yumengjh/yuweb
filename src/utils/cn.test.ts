import { describe, expect, it } from "vitest";

import { cn } from "./cn";

describe("cn", () => {
  it("joins truthy class names", () => {
    expect(cn("card", false, undefined, "active", null)).toBe("card active");
  });
});
