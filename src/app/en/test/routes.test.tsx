import { afterEach, describe, expect, it } from "vitest";

import { cleanup, render, screen } from "@/test/render";

import EnglishAboutPage from "@/app/en/about/page";
import EnglishJourneyPage from "@/app/en/journey/page";
import EnglishNotesPage from "@/app/en/notes/page";

describe("app/en routes", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders a coming soon placeholder for the English about page", () => {
    render(<EnglishAboutPage />);

    expect(screen.getByRole("heading", { level: 1, name: "About" })).toBeInTheDocument();
    expect(screen.getByText("Coming soon.")).toBeInTheDocument();
  });

  it("renders a coming soon placeholder for the English journey page", () => {
    render(<EnglishJourneyPage />);

    expect(screen.getByRole("heading", { level: 1, name: "Journey" })).toBeInTheDocument();
    expect(
      screen.getByText("The English version of this page is not available yet."),
    ).toBeInTheDocument();
  });

  it("renders a coming soon placeholder for the English notes page", () => {
    render(<EnglishNotesPage />);

    expect(screen.getByRole("heading", { level: 1, name: "Notes" })).toBeInTheDocument();
    expect(screen.getByText("Coming soon.")).toBeInTheDocument();
  });
});
