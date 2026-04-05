import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render } from "@/test/render";

vi.mock("gsap", () => {
  const gsap = {
    registerPlugin: vi.fn(),
    fromTo: vi.fn(),
    utils: {
      toArray: vi.fn((value: Iterable<Element>) => Array.from(value)),
    },
    context: vi.fn((callback?: () => void) => {
      callback?.();
      return {
        revert: vi.fn(),
      };
    }),
    ticker: {
      add: vi.fn(),
      remove: vi.fn(),
      lagSmoothing: vi.fn(),
    },
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

import { ScrollRevealText } from "../ScrollRevealText";

describe("ScrollRevealText", () => {
  afterEach(() => {
    cleanup();
  });

  const getVisibleUnits = (container: HTMLElement) =>
    Array.from(container.querySelectorAll('[aria-hidden="true"] span')).map(
      (node) => node.textContent,
    );

  it("keeps Chinese copy granular instead of collapsing the whole sentence into one word", () => {
    const { container } = render(<ScrollRevealText text="让界面像结构一样清晰" />);

    const units = getVisibleUnits(container);

    expect(units.length).toBeGreaterThan(5);
    expect(units.slice(0, 4)).toEqual(["让", "界", "面", "像"]);
  });

  it("keeps English copy segmented by words to match the official demo rhythm", () => {
    const { container } = render(<ScrollRevealText text="Make interfaces read like structure" />);

    const units = getVisibleUnits(container);

    expect(units).toEqual(["Make", "interfaces", "read", "like", "structure"]);
  });

  it("keeps mixed Chinese and Latin copy granular while preserving Latin abbreviations", () => {
    const { container } = render(
      <ScrollRevealText text="我信奉系统思维取代堆叠，追求用最少的 DOM 结构表达最清晰的信息层次。" />,
    );

    const units = getVisibleUnits(container);

    expect(units).toContain("DOM");
    expect(units.length).toBeGreaterThan(10);
    expect(units[0]).toBe("我");
  });
});
