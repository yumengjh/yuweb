// cspell:words avator
import { readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen, waitFor } from "@/test/render";

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

  it("renders localized Chinese home content", async () => {
    render(<HomePage />);
    window.dispatchEvent(new Event("load"));

    expect(screen.getByText(/INDEX \/ FULL INVENTORY/)).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Our tech stack" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "React" })).toHaveAttribute(
      "href",
      "https://react.dev/",
    );
    expect(screen.getByRole("link", { name: "Vue" })).toHaveAttribute("href", "https://vuejs.org/");
    expect(screen.getByRole("link", { name: "OpenAI" })).toHaveAttribute(
      "href",
      "https://openai.com/",
    );
    expect(screen.getByRole("link", { name: "VS Code" })).toHaveAttribute(
      "href",
      "https://code.visualstudio.com/",
    );
    expect(
      screen.getByText((_, element) => {
        return (
          element?.textContent === "YUMENGJH." && element.className.includes("text-pressure-title")
        );
      }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getAllByAltText("Homepage avatar sticker")).toHaveLength(3);
    });

    const stickerImages = screen.getAllByAltText("Homepage avatar sticker");
    expect(stickerImages[0]).toHaveAttribute("src", "/image/avator01.png");

    const stickerStage = screen.getAllByTestId("sticker-peel")[0];
    const pageRoot = stickerStage.closest("main");
    expect(pageRoot).toBeTruthy();
    expect(stickerStage.parentElement).toBe(pageRoot);

    expect(screen.getAllByRole("link", { name: /EXPLORE CASE/ })[0]).toHaveAttribute(
      "href",
      "/curations",
    );

    expect(screen.getAllByRole("heading", { level: 2 }).length).toBeGreaterThan(1);
    expect(screen.getAllByRole("heading", { level: 3 }).length).toBeGreaterThan(3);
  });

  it("renders localized English home content and prefixes internal links", () => {
    render(<EnglishHomePage />);

    expect(screen.getByText("Open for Collaboration")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /EXPLORE CASE/ })[0]).toHaveAttribute(
      "href",
      "/en/curations",
    );
    expect(screen.getAllByText("digital architect")[0]).toBeInTheDocument();
    expect(screen.getByText("Lead Architect")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Space, Logic, and Digital Order.", level: 2 }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "In the context of a digital architect, the screen is not merely a flat canvas but a physical environment that can be organized and reasoned about. Whitespace is not absence; it is a load-bearing material that defines rhythm and hierarchy.",
      ),
    ).toBeInTheDocument();
  });

  it("keeps the home page free of text-animation component hookups", () => {
    const homePageSource = readFileSync(
      path.resolve(process.cwd(), "src/components/home-page/HomePage.tsx"),
      "utf8",
    );

    expect(homePageSource).not.toContain("<SplitText");
    expect(homePageSource).not.toContain("<ScrollRevealText");
  });

  it("renders the philosophy section from the original paragraph list", () => {
    const homePageSource = readFileSync(
      path.resolve(process.cwd(), "src/components/home-page/HomePage.tsx"),
      "utf8",
    );

    expect(homePageSource).toContain("homePage.philosophy.paragraphs.map");
    expect(homePageSource).toContain(
      "<h2 className={styles.statementTitle}>{t(homePage.philosophy.title)}</h2>",
    );
  });

  it("does not enable Lenis-based damped scrolling through the home page component", () => {
    const homePageSource = readFileSync(
      path.resolve(process.cwd(), "src/components/home-page/HomePage.tsx"),
      "utf8",
    );

    expect(homePageSource).not.toContain("HomeSmoothScroll");
  });

  it("keeps the philosophy copy in the original responsive two-column layout", () => {
    const stylesSource = readFileSync(
      path.resolve(process.cwd(), "src/app/page.module.scss"),
      "utf8",
    );

    expect(stylesSource).toContain(".statementText");
    expect(stylesSource).toContain("grid-template-columns: 1fr 1fr;");
  });
});
