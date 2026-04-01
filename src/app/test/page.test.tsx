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
    expect(screen.getAllByRole("link", { name: /EXPLORE CASE/ })[0]).toHaveAttribute(
      "href",
      "/curations",
    );
    expect(screen.getAllByText("数字建筑师")[0]).toBeInTheDocument();
    expect(screen.getAllByText(/鱼梦江湖/)[0]).toBeInTheDocument();
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
