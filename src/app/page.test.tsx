import { describe, expect, it } from "vitest";

import { render, screen } from "@/test/render";

import HomePage from "./page";

describe("app/page", () => {
  it("renders business content directly", () => {
    render(<HomePage />);

    expect(screen.getByText(/INDEX \/ FULL INVENTORY/)).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /EXPLORE/ })[0]).toHaveAttribute(
      "href",
      "/curations",
    );
    expect(screen.getAllByText(/鱼梦江湖/)[0]).toBeInTheDocument();
  });
});
