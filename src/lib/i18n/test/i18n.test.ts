import { afterEach, describe, expect, it, vi } from "vitest";

import { nav, theme } from "@/lib/i18n-keys";
import {
  createTranslator,
  getLocaleFromPathname,
  getLocaleModeFromStorage,
  getLocaleModeOrder,
  hasMessage,
  localizeHref,
  MISSING_MESSAGE,
  resolvePreferredLocale,
  stripLocalePrefix,
  switchLocalePath,
  t,
} from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";

describe("i18n helpers", () => {
  const originalAutoDetect = siteConfig.i18n.autoDetect;

  afterEach(() => {
    siteConfig.i18n.autoDetect = originalAutoDetect;
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("detects locale from pathname and strips locale prefix", () => {
    expect(getLocaleFromPathname("/")).toBe("zh-CN");
    expect(getLocaleFromPathname("/en")).toBe("en-US");
    expect(getLocaleFromPathname("/en/journey")).toBe("en-US");
    expect(stripLocalePrefix("/en")).toBe("/");
    expect(stripLocalePrefix("/en/journey")).toBe("/journey");
  });

  it("localizes internal hrefs and preserves hash and query parts", () => {
    expect(localizeHref("/journey", "en-US")).toBe("/en/journey");
    expect(localizeHref("/journey?tab=1#current", "en-US")).toBe("/en/journey?tab=1#current");
    expect(localizeHref("/en/journey", "zh-CN")).toBe("/journey");
    expect(localizeHref("mailto:test@example.com", "en-US")).toBe("mailto:test@example.com");
    expect(switchLocalePath("/en/journey?tab=1", "zh-CN")).toBe("/journey?tab=1");
  });

  it("resolves preferred locale from browser languages", () => {
    expect(resolvePreferredLocale(["en-GB", "zh-CN"])).toBe("en-US");
    expect(resolvePreferredLocale(["zh-TW"])).toBe("zh-CN");
    expect(resolvePreferredLocale(["fr-FR"])).toBe("zh-CN");
  });

  it("reads locale mode from storage and respects auto-detect config", () => {
    expect(getLocaleModeOrder()).toEqual(["auto", "zh-CN", "en-US"]);
    expect(getLocaleModeFromStorage()).toBe("auto");

    window.localStorage.setItem("site-locale-mode", "en-US");
    expect(getLocaleModeFromStorage()).toBe("en-US");

    siteConfig.i18n.autoDetect = false;
    expect(getLocaleModeOrder()).toEqual(["zh-CN", "en-US"]);
    window.localStorage.setItem("site-locale-mode", "auto");
    expect(getLocaleModeFromStorage("/en")).toBe("en-US");
  });

  it("translates by token and warns on missing vocabulary", () => {
    const zhT = createTranslator("zh-CN");
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    expect(zhT(nav.about.label)).toBe("关于");
    expect(t(theme.aria, "en-US", { mode: "Auto" })).toBe("Toggle theme, current mode Auto");
    expect(hasMessage(nav.about.label, "en-US")).toBe(true);
    expect(hasMessage("missing.key" as never, "en-US")).toBe(false);
    expect(t("missing.key" as never, "en-US")).toBe(MISSING_MESSAGE);
    expect(warnSpy).toHaveBeenCalledWith('[i18n] Missing message for locale "en-US": missing.key');
  });
});
