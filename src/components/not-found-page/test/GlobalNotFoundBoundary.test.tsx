import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "@/test/render";

import { GlobalNotFoundBoundary } from "@/components/not-found-page/GlobalNotFoundBoundary";

let pathnameMock = "/en/missing";
const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => pathnameMock,
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe("GlobalNotFoundBoundary", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the English 404 view with the shared navigation shell for English paths", () => {
    pathnameMock = "/en/missing";

    render(<GlobalNotFoundBoundary />);

    expect(document.querySelector('[data-name="Top Navigation Bar"]')).not.toBeNull();
    expect(document.documentElement.lang).toBe("en-US");
    expect(screen.getByText("UNKNOWN COORDINATE")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /RETURN TO ROOT/ })).toHaveAttribute("href", "/en");
  });

  it("renders the default locale 404 view with the shared navigation shell for default routes", () => {
    pathnameMock = "/missing";

    render(<GlobalNotFoundBoundary />);

    expect(document.querySelector('[data-name="Top Navigation Bar"]')).not.toBeNull();
    expect(document.documentElement.lang).toBe("zh-CN");
    expect(screen.getByRole("link", { name: "YUMENGJH" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: /RETURN TO ROOT/ })).toHaveAttribute("href", "/");
  });
});
