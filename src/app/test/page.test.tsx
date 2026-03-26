import { afterEach, describe, expect, it } from "vitest";

import { cleanup, render, screen } from "@/test/render";

import EnglishHomePage from "@/app/en/page";
import HomePage from "@/app/page";

describe("app/page", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders localized Chinese home content", () => {
    render(<HomePage />);

    expect(screen.getByText(/INDEX \/ FULL INVENTORY/)).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /EXPLORE CASE/ })[0]).toHaveAttribute(
      "href",
      "/curations",
    );
    expect(screen.getAllByText(/鱼梦江湖/)[0]).toBeInTheDocument();
  });

  it("renders localized English home content and prefixes internal links", () => {
    render(<EnglishHomePage />);

    expect(screen.getByText("Open for Collaboration")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /EXPLORE CASE/ })[0]).toHaveAttribute(
      "href",
      "/en/curations",
    );
    expect(screen.getByText("Lead Architect")).toBeInTheDocument();
  });
});
