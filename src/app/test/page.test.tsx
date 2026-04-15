// cspell:words avator
import { readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "@/test/render";

vi.mock("@/components/SplashCursor/SplashCursor", () => ({
  default: () => null,
}));

vi.mock("gsap", () => ({
  default: {
    registerPlugin: vi.fn(),
    set: vi.fn(),
    to: vi.fn(),
    fromTo: vi.fn(() => ({
      scrollTrigger: { kill: vi.fn() },
      kill: vi.fn(),
    })),
    context: vi.fn((callback?: () => void) => {
      callback?.();
      return { revert: vi.fn() };
    }),
    ticker: {
      add: vi.fn(),
      remove: vi.fn(),
      lagSmoothing: vi.fn(),
    },
    getProperty: vi.fn(() => 0),
    utils: {
      clamp: (min: number, max: number, value: number) => Math.min(Math.max(value, min), max),
    },
  },
  gsap: {
    registerPlugin: vi.fn(),
    set: vi.fn(),
    to: vi.fn(),
    fromTo: vi.fn(() => ({
      scrollTrigger: { kill: vi.fn() },
      kill: vi.fn(),
    })),
    context: vi.fn((callback?: () => void) => {
      callback?.();
      return { revert: vi.fn() };
    }),
    ticker: {
      add: vi.fn(),
      remove: vi.fn(),
      lagSmoothing: vi.fn(),
    },
    getProperty: vi.fn(() => 0),
    utils: {
      clamp: (min: number, max: number, value: number) => Math.min(Math.max(value, min), max),
    },
  },
}));

vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: {
    update: vi.fn(),
    refresh: vi.fn(),
    getAll: vi.fn(() => []),
  },
}));

vi.mock("gsap/Draggable", () => ({
  Draggable: {
    create: vi.fn(() => [
      {
        kill: vi.fn(),
        update: vi.fn(),
      },
    ]),
  },
}));

vi.mock("lenis", () => ({
  default: class MockLenis {
    on = vi.fn();
    raf = vi.fn();
    destroy = vi.fn();
  },
}));

import EnglishHomePage from "@/app/(en)/en/page";
import HomePage from "@/app/(zh)/page";

describe("app/page", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders current localized Chinese home content", () => {
    render(<HomePage />);

    expect(screen.getByText("INDEX / FULL INVENTORY")).toBeInTheDocument();
    expect(screen.getByText("GUANGZHOU, CN")).toBeInTheDocument();
    expect(screen.getByText("CURRENT ROLE IDENTIFICATION //")).toBeInTheDocument();
    expect(screen.getByText(/开放合作 \/ Available/)).toBeInTheDocument();
    expect(screen.getByText(/逻辑先行，留白承重/)).toBeInTheDocument();
    expect(screen.getByTestId("home-grid-motion")).toBeInTheDocument();
  });

  it("renders current localized English home content", () => {
    render(<EnglishHomePage />);

    expect(screen.getByText("INDEX / FULL INVENTORY")).toBeInTheDocument();
    expect(screen.getByText("GUANGZHOU, CN")).toBeInTheDocument();
    expect(screen.getByText(/Open for Collaboration/)).toBeInTheDocument();
    expect(screen.getByText("CURRENT ROLE IDENTIFICATION //")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Logic first, whitespace load-bearing. Every line of code or pixel aligned to structure, rhythm, and stability.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Design & Code")).toBeInTheDocument();
    expect(screen.getByTestId("home-grid-motion")).toBeInTheDocument();
  });

  it("keeps the home page free of old text-animation component hookups", () => {
    const homePageSource = readFileSync(
      path.resolve(process.cwd(), "src/components/home-page/HomePage.tsx"),
      "utf8",
    );

    expect(homePageSource).not.toContain("<SplitText");
    expect(homePageSource).not.toContain("<ScrollRevealText");
  });

  it("keeps Lenis smooth scrolling mounted on the home page", () => {
    const homePageSource = readFileSync(
      path.resolve(process.cwd(), "src/components/home-page/HomePage.tsx"),
      "utf8",
    );

    expect(homePageSource).toContain("import { HomeSmoothScroll }");
    expect(homePageSource).toContain("<HomeSmoothScroll />");
  });

  it("defines the grid motion background styles in the home page stylesheet", () => {
    const stylesSource = readFileSync(
      path.resolve(process.cwd(), "src/app/page.module.scss"),
      "utf8",
    );

    expect(stylesSource).toContain(".gridMotionContainer");
    expect(stylesSource).toContain("transform: rotate(-15deg);");
    expect(stylesSource).toContain("--home-frame-top");
  });
});
