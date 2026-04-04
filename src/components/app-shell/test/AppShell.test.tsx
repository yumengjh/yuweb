import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "@/test/render";

import { AppShell } from "@/components/app-shell/AppShell";

let pathnameMock = "/about";
const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => pathnameMock,
  useRouter: () => ({
    push: pushMock,
  }),
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

afterEach(() => {
  cleanup();
  document.documentElement.lang = "zh-CN";
  document.documentElement.dataset.locale = "";
});

describe("AppShell", () => {
  it("keeps document lang untouched during client renders", () => {
    pathnameMock = "/en/about";
    document.documentElement.lang = "zh-CN";
    document.documentElement.dataset.locale = "";

    render(
      <AppShell>
        <main>
          <h1>About Body</h1>
        </main>
      </AppShell>,
    );

    expect(document.documentElement.lang).toBe("zh-CN");
    expect(document.documentElement.dataset.locale).toBe("");
  });

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
