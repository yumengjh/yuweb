import { describe, expect, it } from "vitest";

import { render, screen } from "@/test/render";

import HomePage from "./page";

describe("app/page", () => {
  it("renders business content directly", () => {
    render(<HomePage />);

    expect(screen.getByText(/Digital Minimalism/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /View Case/ })).toHaveAttribute("href", "/curations");
    expect(screen.getByText(/Project 02/)).toBeInTheDocument();
  });
});
