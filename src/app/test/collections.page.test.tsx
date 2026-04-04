import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act } from "react";

import { createTranslator } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";
import { cleanup, render, screen } from "@/test/render";

import CollectionsPage from "@/app/(zh)/collections/page";

describe("app/collections/page", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  it("renders the placeholder content with an active pixel background", () => {
    const t = createTranslator("zh-CN");

    render(<CollectionsPage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: t(siteConfig.routeMeta.collections.title),
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(t(siteConfig.comingSoonPage.description))).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(screen.getByTestId("collections-pixel-background")).toHaveAttribute(
      "data-active",
      "true",
    );
  });
});
