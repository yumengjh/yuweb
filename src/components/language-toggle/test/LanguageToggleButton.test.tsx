import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createTranslator } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";
import { cleanup, render, screen } from "@/test/render";

import { LanguageToggleButton } from "@/components/language-toggle/LanguageToggleButton";

const pushMock = vi.fn();
let pathnameMock = "/";

vi.mock("next/navigation", () => ({
  usePathname: () => pathnameMock,
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe("LanguageToggleButton", () => {
  const originalAutoDetect = siteConfig.i18n.autoDetect;

  beforeEach(() => {
    pathnameMock = "/";
    pushMock.mockReset();
    window.localStorage.clear();
    Object.defineProperty(window.navigator, "languages", {
      configurable: true,
      value: ["en-US", "en"],
    });
  });

  afterEach(() => {
    cleanup();
    siteConfig.i18n.autoDetect = originalAutoDetect;
  });

  it("opens a popup selector and switches to English when auto detect is enabled", async () => {
    const user = userEvent.setup();
    const zhT = createTranslator("zh-CN");
    const autoLabel = zhT(siteConfig.languageToggle.modeLabels.auto);
    const chineseLabel = zhT(siteConfig.languageToggle.modeLabels["zh-CN"]);
    const englishLabel = zhT(siteConfig.languageToggle.modeLabels["en-US"]);

    render(<LanguageToggleButton locale="zh-CN" />);

    const button = screen.getByRole("button", {
      name: zhT(siteConfig.languageToggle.triggerAriaLabel, { mode: autoLabel }),
    });

    expect(button).toHaveTextContent(`${zhT(siteConfig.languageToggle.label)} / ${autoLabel}`);

    await user.click(button);

    expect(await screen.findByRole("menuitemradio", { name: autoLabel })).toBeInTheDocument();
    expect(screen.getByRole("menuitemradio", { name: chineseLabel })).toBeInTheDocument();

    await user.click(screen.getByRole("menuitemradio", { name: englishLabel }));

    expect(window.localStorage.getItem("site-locale-mode")).toBe("en-US");
    expect(pushMock).toHaveBeenLastCalledWith("/en");
  });

  it("omits auto mode from the popup when auto detect is disabled", async () => {
    const user = userEvent.setup();
    const enT = createTranslator("en-US");
    const chineseLabel = enT(siteConfig.languageToggle.modeLabels["zh-CN"]);
    const englishLabel = enT(siteConfig.languageToggle.modeLabels["en-US"]);
    siteConfig.i18n.autoDetect = false;
    pathnameMock = "/en";

    render(<LanguageToggleButton locale="en-US" />);

    const button = screen.getByRole("button", {
      name: enT(siteConfig.languageToggle.triggerAriaLabel, { mode: englishLabel }),
    });

    expect(button).toHaveTextContent(`${enT(siteConfig.languageToggle.label)} / ${englishLabel}`);

    await user.click(button);

    expect(await screen.findByRole("menuitemradio", { name: englishLabel })).toBeInTheDocument();
    expect(
      screen.queryByRole("menuitemradio", { name: enT(siteConfig.languageToggle.modeLabels.auto) }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("menuitemradio", { name: chineseLabel }));

    expect(window.localStorage.getItem("site-locale-mode")).toBe("zh-CN");
    expect(pushMock).toHaveBeenLastCalledWith("/");
  });
});
