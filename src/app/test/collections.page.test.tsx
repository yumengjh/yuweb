import { afterEach, describe, expect, it } from "vitest";

import { createTranslator } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";
import { cleanup, render, screen } from "@/test/render";

import CollectionsPage from "@/app/collections/page";

describe("app/collections/page", () => {
  afterEach(() => {
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
    expect(screen.getByTestId("collections-pixel-background")).toHaveAttribute(
      "data-active",
      "true",
    );
  });
});
