import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { render, screen } from "@/test/render";

import { ThemeToggleButton } from "@/components/theme-toggle/ThemeToggleButton";

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

    render(<ThemeToggleButton locale="zh-CN" />);

    const button = screen.getByRole("button");

    expect(button).toHaveTextContent("主题 / 自动");
    expect(document.documentElement.dataset.theme).toBe("auto");

    await user.click(button);
    expect(button).toHaveTextContent("主题 / 浅色");
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(window.localStorage.getItem("site-theme-mode")).toBe("light");

    await user.click(button);
    expect(button).toHaveTextContent("主题 / 深色");
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    await user.click(button);
    expect(button).toHaveTextContent("主题 / 自动");
    expect(document.documentElement.dataset.theme).toBe("auto");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});
