import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render } from "@/test/render";

vi.mock("gsap", () => {
  const gsap = {
    registerPlugin: vi.fn(),
    fromTo: vi.fn(),
    context: vi.fn((callback?: () => void) => {
      callback?.();
      return {
        revert: vi.fn(),
      };
    }),
  };

  return {
    default: gsap,
    gsap,
  };
});

vi.mock("gsap/ScrollTrigger", () => {
  const ScrollTrigger = {
    update: vi.fn(),
    refresh: vi.fn(),
    getAll: vi.fn(() => []),
  };

  return { ScrollTrigger };
});

import { ScrollFloatTitle } from "../ScrollFloatTitle";

describe("ScrollFloatTitle", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders one visible unit per character while preserving spaces as non-breaking spaces", () => {
    const { container } = render(<ScrollFloatTitle text="React Bits" />);

    const hiddenRoot = container.querySelector('[aria-hidden="true"]');
    const units = Array.from(hiddenRoot?.querySelectorAll(":scope > span > span") ?? []).map(
      (node) => node.textContent,
    );

    expect(units).toEqual(["R", "e", "a", "c", "t", "\u00A0", "B", "i", "t", "s"]);
  });

  it("groups words into wrappers so multiline titles do not visually collapse during staggered entry", () => {
    const { container } = render(<ScrollFloatTitle text="Make interfaces read like structure" />);

    const hiddenRoot = container.querySelector('[aria-hidden="true"]');
    const words = Array.from(hiddenRoot?.children ?? []).map((node) =>
      (node.textContent ?? "").replace(/\u00A0/g, ""),
    );

    expect(words).toEqual(["Make", "interfaces", "read", "like", "structure"]);
  });
});
