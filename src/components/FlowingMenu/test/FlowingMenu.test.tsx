import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, fireEvent, render, screen } from "@/test/render";

import { FlowingMenu } from "../FlowingMenu";

vi.mock("gsap", () => {
  const timelineInstance = {
    set: vi.fn().mockReturnThis(),
    to: vi.fn().mockReturnThis(),
    kill: vi.fn(),
  };

  return {
    gsap: {
      set: vi.fn(),
      to: vi.fn(() => ({ kill: vi.fn() })),
      timeline: vi.fn(() => timelineInstance),
    },
  };
});

describe("FlowingMenu", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders archive links and text-mode marquee metadata", () => {
    render(
      <FlowingMenu
        contentMode="text"
        items={[
          {
            link: "/collections",
            text: "Clean Architecture",
            meta: { author: "Robert C. Martin", year: "2017", id: "B-03" },
          },
          {
            link: "/collections",
            text: "Refactoring UI",
            meta: { author: "Adam Wathan", year: "2018", id: "B-04" },
          },
        ]}
      />,
    );

    expect(screen.getByRole("link", { name: "Clean Architecture" })).toHaveAttribute(
      "href",
      "/collections",
    );
    expect(screen.getByRole("link", { name: "Refactoring UI" })).toHaveAttribute(
      "href",
      "/collections",
    );

    expect(screen.getAllByText(/Robert C\. Martin · 2017 · B-03/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Adam Wathan · 2018 · B-04/).length).toBeGreaterThan(0);
    expect(screen.getAllByText("Refactoring UI").length).toBeGreaterThan(1);
    expect(document.querySelectorAll('[data-flowing-content-mode="text"]').length).toBeGreaterThan(
      0,
    );
  });

  it("uses image mode in auto mode when image is provided", () => {
    render(
      <FlowingMenu
        items={[
          {
            link: "/collections",
            text: "Mojave",
            image: "https://example.com/mojave.jpg",
          },
        ]}
      />,
    );

    expect(document.querySelectorAll('[data-flowing-content-mode="image"]').length).toBeGreaterThan(
      0,
    );
  });

  it("highlights active item while hovered", () => {
    render(
      <FlowingMenu
        contentMode="text"
        items={[{ link: "/collections", text: "The Design of Everyday Things" }]}
      />,
    );

    const link = screen.getByRole("link", { name: "The Design of Everyday Things" });
    const item = link.closest("[data-active]");
    expect(item).toHaveAttribute("data-active", "false");

    fireEvent.mouseEnter(link, { clientX: 10, clientY: 2 });
    expect(item).toHaveAttribute("data-active", "true");

    fireEvent.mouseLeave(link, { clientX: 10, clientY: 100 });
    expect(item).toHaveAttribute("data-active", "false");
  });
});
