import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "@/test/render";

import EnglishAboutPage from "@/app/en/about/page";
import EnglishJourneyPage from "@/app/en/journey/page";
import EnglishNotesPage from "@/app/en/notes/page";

vi.mock("next/navigation", async () => {
  const actual = await vi.importActual<typeof import("next/navigation")>("next/navigation");

  return {
    ...actual,
    useRouter: () => ({
      refresh: vi.fn(),
    }),
  };
});

vi.mock("@/features/docs/lib/docs-page-data", () => ({
  getDocsListPageData: vi.fn(async () => ({
    docs: [
      {
        docId: "doc_001",
        title: "Launch Notes",
        icon: "📄",
        publishedHead: 3,
        updatedAt: "2026-03-30T10:00:00.000Z",
        tags: ["tag_1"],
      },
    ],
    docsError: null,
    workspace: {
      workspaceId: "ws_demo",
      name: "Docs Workspace",
      description: "Public notes from the shared workspace.",
      icon: "📚",
      ownerId: "user_001",
    },
    workspaceError: null,
    ownerProfile: {
      userId: "user_001",
      displayName: "Workspace Owner",
      username: "owner",
    },
    tags: [
      {
        tagId: "tag_1",
        workspaceId: "ws_demo",
        name: "Release",
        color: "#2563eb",
      },
    ],
    tagMap: {
      tag_1: {
        tagId: "tag_1",
        workspaceId: "ws_demo",
        name: "Release",
        color: "#2563eb",
      },
    },
    settings: {
      reader: {
        contentWidth: 800,
        fontSize: 16,
      },
      editor: {
        contentWidth: 800,
        fontSize: 16,
      },
      advanced: {
        compactList: true,
        codeFontFamily: "Inter",
      },
    },
    workspaceId: "ws_demo",
    showDocDebugMeta: false,
  })),
}));

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

  it("renders the English notes document list", async () => {
    render(await EnglishNotesPage());

    expect(screen.getByRole("heading", { level: 1, name: "Docs Workspace" })).toBeInTheDocument();
    expect(screen.getByText("Workspace Owner")).toBeInTheDocument();
    expect(screen.getByText("Launch Notes")).toBeInTheDocument();
    expect(screen.getByText("Document ID：doc_001")).toBeInTheDocument();
  });
});
