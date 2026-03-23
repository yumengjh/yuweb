import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { render, screen } from "@/test/render";

import { ThemeToggleButton } from "./ThemeToggleButton";

beforeEach(() => {
  window.localStorage.clear();
  document.documentElement.dataset.theme = "";
  document.documentElement.classList.remove("dark");
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  configurable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: query === "(prefers-color-scheme: dark)" ? false : false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe("ThemeToggleButton", () => {
  it("cycles theme mode and applies it to document root", async () => {
    const user = userEvent.setup();

    render(<ThemeToggleButton />);

    const button = screen.getByRole("button");

    expect(button).toHaveTextContent("Theme / Auto");
    expect(document.documentElement.dataset.theme).toBe("auto");

    await user.click(button);
    expect(button).toHaveTextContent("Theme / Light");
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(window.localStorage.getItem("site-theme-mode")).toBe("light");

    await user.click(button);
    expect(button).toHaveTextContent("Theme / Dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    await user.click(button);
    expect(button).toHaveTextContent("Theme / Auto");
    expect(document.documentElement.dataset.theme).toBe("auto");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});
