import { describe, expect, it, vi } from "vitest";

import { render, screen } from "@/test/render";

import { AppShell } from "./AppShell";

vi.mock("next/navigation", () => ({
  usePathname: () => "/about",
}));

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

describe("AppShell", () => {
  it("renders shared navigation and footer from route config", () => {
    render(
      <AppShell>
        <main>
          <h1>About Body</h1>
        </main>
      </AppShell>,
    );

    expect(document.querySelector('[data-name="Top Navigation Bar"]')).not.toBeNull();
    expect(screen.getByRole("heading", { level: 1, name: "About Body" })).toBeInTheDocument();
    expect(document.querySelector("footer")).not.toBeNull();
  });
});
