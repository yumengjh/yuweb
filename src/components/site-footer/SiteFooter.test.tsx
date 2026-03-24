import type { SiteFooterMetaItem } from "@/lib/site-config";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { siteConfig } from "@/lib/site-config";
import { cleanup, render, screen, waitFor } from "@/test/render";

import { SiteFooter } from "./SiteFooter";

const originalLocation = window.location;
const originalMetaItems = [...siteConfig.footer.metaItems];

function setHostname(hostname: string) {
  Object.defineProperty(window, "location", {
    configurable: true,
    value: {
      hostname,
    } as Location,
  });
}

describe("SiteFooter", () => {
  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === "(prefers-color-scheme: dark)" ? false : false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    cleanup();
    siteConfig.footer.metaItems = [...originalMetaItems];
    setHostname("localhost");
    window.localStorage.clear();
    document.documentElement.className = "";
    document.documentElement.dataset.theme = "";
  });

  afterAll(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    });
  });

  it("renders the existing footer content with common meta items", () => {
    siteConfig.footer.metaItems = [
      {
        id: "copyright",
        label: "版权",
        text: "© 2026 鱼梦江湖",
      },
    ];

    render(<SiteFooter />);

    expect(screen.getByText("鱼梦江湖 YUMENGJH")).toBeInTheDocument();
    expect(screen.getByText(siteConfig.footer.summary)).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "页脚导航" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Toggle theme/i })).toBeInTheDocument();
    expect(screen.getByLabelText("站点信息")).toBeInTheDocument();
    expect(screen.getByText("版权：")).toBeInTheDocument();
    expect(screen.getByText("© 2026 鱼梦江湖")).toBeInTheDocument();
  });

  it("renders domain-matched items and keeps href metadata", async () => {
    const testMetaItems: SiteFooterMetaItem[] = [
      {
        id: "copyright",
        label: "版权",
        text: "© 2026 鱼梦江湖",
      },
      {
        id: "icp",
        label: "备案号",
        text: "沪ICP备00000000号",
        domains: {
          suffix: ["yumengjh.com"],
        },
      },
      {
        id: "police",
        label: "公安备案",
        text: "沪公网安备00000000000000号",
        href: "https://beian.mps.gov.cn/#/query/webSearch",
        domains: {
          exact: ["www.yumengjh.com"],
        },
      },
    ];

    siteConfig.footer.metaItems = testMetaItems;
    setHostname("www.yumengjh.com");

    render(<SiteFooter />);

    await waitFor(() => {
      expect(screen.getByText("备案号：")).toBeInTheDocument();
      expect(screen.getByText("沪ICP备00000000号")).toBeInTheDocument();
    });

    const policeRecordLink = screen.getByRole("link", {
      name: /公安备案：沪公网安备00000000000000号/,
    });

    expect(policeRecordLink).toHaveAttribute("href", "https://beian.mps.gov.cn/#/query/webSearch");
  });

  it("does not render the meta section when no item matches the current domain", async () => {
    siteConfig.footer.metaItems = [
      {
        id: "icp",
        label: "备案号",
        text: "沪ICP备00000000号",
        domains: {
          exact: ["beian.yumengjh.com"],
        },
      },
    ];
    setHostname("other-domain.com");

    render(<SiteFooter />);

    await waitFor(() => {
      expect(screen.queryByLabelText("站点信息")).not.toBeInTheDocument();
    });
  });
});
