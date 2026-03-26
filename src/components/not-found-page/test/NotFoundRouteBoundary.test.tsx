import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "@/test/render";

import { NotFoundRouteBoundary } from "@/components/not-found-page/NotFoundRouteBoundary";

let pathnameMock = "/en/missing";

vi.mock("next/navigation", () => ({
  usePathname: () => pathnameMock,
}));

describe("NotFoundRouteBoundary", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the English not found view for English paths", () => {
    pathnameMock = "/en/missing";

    render(<NotFoundRouteBoundary />);

    expect(screen.getByText("UNKNOWN COORDINATE")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /RETURN TO ROOT/ })).toHaveAttribute("href", "/en");
  });

  it("renders the Chinese not found view for default routes", () => {
    pathnameMock = "/missing";

    render(<NotFoundRouteBoundary />);

    expect(screen.getByText("未知坐标 / UNKNOWN")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /RETURN TO ROOT/ })).toHaveAttribute("href", "/");
  });
});
