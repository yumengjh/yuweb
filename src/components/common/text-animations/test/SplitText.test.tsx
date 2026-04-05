import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "@/test/render";

vi.mock("@gsap/react", () => ({
  useGSAP: vi.fn((callback?: () => void) => {
    callback?.();
  }),
}));

vi.mock("gsap", () => {
  const gsap = {
    registerPlugin: vi.fn(),
    fromTo: vi.fn(() => ({
      kill: vi.fn(),
      scrollTrigger: { kill: vi.fn() },
    })),
  };

  return {
    default: gsap,
    gsap,
  };
});

vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: {
    getAll: vi.fn(() => []),
  },
}));

vi.mock("gsap/SplitText", () => ({
  SplitText: class MockSplitText {
    chars: Element[] = [];
    words: Element[] = [];
    lines: Element[] = [];
    revert = vi.fn();
  },
}));

import { SplitText } from "../SplitText";

describe("SplitText", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the provided text content with the requested semantic tag", () => {
    render(<SplitText text="Make interfaces read like structure" tag="h2" />);

    expect(
      screen.getByRole("heading", { level: 2, name: "Make interfaces read like structure" }),
    ).toBeInTheDocument();
  });
});
