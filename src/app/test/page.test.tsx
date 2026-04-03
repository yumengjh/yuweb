// cspell:words avator
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen, waitFor } from "@/test/render";

vi.mock("@/components/SplashCursor/SplashCursor", () => ({
  default: () => null,
}));

vi.mock("gsap", () => ({
  gsap: {
    registerPlugin: vi.fn(),
    set: vi.fn(),
    to: vi.fn(),
    getProperty: vi.fn(() => 0),
    utils: {
      clamp: (min: number, max: number, value: number) => Math.min(Math.max(value, min), max),
    },
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

import EnglishHomePage from "@/app/en/page";
import HomePage from "@/app/page";

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
  });
});
