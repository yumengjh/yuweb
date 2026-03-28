import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { createTranslator } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";
import { cleanup, render, screen } from "@/test/render";

import { SiteFooter } from "@/components/site-footer/SiteFooter";

const originalLocation = window.location;
const pushMock = vi.fn();
let pathnameMock = "/";

vi.mock("next/navigation", () => ({
  usePathname: () => pathnameMock,
  useRouter: () => ({
    push: pushMock,
  }),
}));

function setHostname(hostname: string) {
  Object.defineProperty(window, "location", {
    configurable: true,
    value: {
      ...originalLocation,
      hostname,
      search: "",
      hash: "",
      pathname: pathnameMock,
    } as Location,
  });
}

describe("SiteFooter", () => {
  beforeAll(() => {
    setHostname("localhost");
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
    pushMock.mockReset();
    pathnameMock = "/";
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

  it("renders the localized Chinese footer with navigation and toggles", () => {
    const zhT = createTranslator("zh-CN");
    const autoThemeLabel = zhT(siteConfig.themeToggle.modeLabels.auto);
    const autoLanguageLabel = zhT(siteConfig.languageToggle.modeLabels.auto);

    render(<SiteFooter locale="zh-CN" />);

    expect(
      screen.getByText(`${zhT(siteConfig.identity.name)} ${siteConfig.identity.brandLatin}`),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: zhT(siteConfig.footer.navAriaLabel) }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: zhT(siteConfig.themeToggle.ariaLabel, { mode: autoThemeLabel }),
      }),
    ).toHaveTextContent(`${zhT(siteConfig.themeToggle.label)} / ${autoThemeLabel}`);
    expect(
      screen.getByRole("button", {
        name: zhT(siteConfig.languageToggle.triggerAriaLabel, { mode: autoLanguageLabel }),
      }),
    ).toHaveTextContent(`${zhT(siteConfig.languageToggle.label)} / ${autoLanguageLabel}`);
    expect(screen.getByLabelText(zhT(siteConfig.footer.metaAriaLabel))).toBeInTheDocument();
    expect(screen.getByText(zhT(siteConfig.footer.metaItems[2].text))).toBeInTheDocument();
  });

  it("renders translated English footer navigation and control buttons", () => {
    const enT = createTranslator("en-US");
    pathnameMock = "/en";
    setHostname("localhost");

    render(<SiteFooter locale="en-US" />);

    expect(
      screen.getByRole("navigation", { name: enT(siteConfig.footer.navAriaLabel) }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Toggle theme/ })).toHaveTextContent("Theme / Auto");
    expect(
      screen.getByRole("button", {
        name: enT(siteConfig.languageToggle.triggerAriaLabel, {
          mode: enT(siteConfig.languageToggle.modeLabels.auto),
        }),
      }),
    ).toHaveTextContent("Language / Auto");
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "/en/about");
    expect(screen.getByText(enT(siteConfig.footer.metaItems[1].text))).toBeInTheDocument();
  });

  it("filters domain-restricted meta items by hostname", () => {
    const zhT = createTranslator("zh-CN");
    setHostname("other-domain.com");

    render(<SiteFooter locale="zh-CN" />);

    expect(screen.queryByText(zhT(siteConfig.footer.metaItems[3].text))).not.toBeInTheDocument();
  });
});
