"use client";

import { useEffect, useState } from "react";

const THEME_STORAGE_KEY = "site-theme-mode";
const SYSTEM_THEME_QUERY = "(prefers-color-scheme: dark)";

type ThemeMode = "auto" | "light" | "dark";

const themeModeOrder: ThemeMode[] = ["auto", "light", "dark"];
const themeModeLabels: Record<ThemeMode, string> = {
  auto: "Auto",
  light: "Light",
  dark: "Dark",
};

function getSystemThemeMatcher() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return null;
  }

  return window.matchMedia(SYSTEM_THEME_QUERY);
}

function getStoredThemeMode(): ThemeMode {
  if (typeof window === "undefined") {
    return "auto";
  }

  const savedMode = window.localStorage.getItem(THEME_STORAGE_KEY);
  return savedMode === "auto" || savedMode === "light" || savedMode === "dark" ? savedMode : "auto";
}

function resolveTheme(mode: ThemeMode): "light" | "dark" {
  if (mode === "light" || mode === "dark") {
    return mode;
  }

  return getSystemThemeMatcher()?.matches ? "dark" : "light";
}

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  const resolvedTheme = resolveTheme(mode);

  root.dataset.theme = mode;
  root.classList.toggle("dark", resolvedTheme === "dark");
}

function getNextThemeMode(mode: ThemeMode): ThemeMode {
  const currentIndex = themeModeOrder.indexOf(mode);
  return themeModeOrder[(currentIndex + 1) % themeModeOrder.length];
}

export function ThemeToggleButton({ className }: { className?: string }) {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => getStoredThemeMode());

  useEffect(() => {
    applyTheme(themeMode);

    const media = getSystemThemeMatcher();
    if (!media) {
      return;
    }

    const handleChange = () => {
      if (document.documentElement.dataset.theme === "auto") {
        applyTheme("auto");
      }
    };

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", handleChange);
      return () => media.removeEventListener("change", handleChange);
    }

    media.addListener?.(handleChange);
    return () => media.removeListener?.(handleChange);
  }, [themeMode]);

  const handleToggle = () => {
    const nextMode = getNextThemeMode(themeMode);
    setThemeMode(nextMode);
    window.localStorage.setItem(THEME_STORAGE_KEY, nextMode);
    applyTheme(nextMode);
  };

  return (
    <button
      aria-label={`Toggle theme, current mode ${themeModeLabels[themeMode]}`}
      className={className}
      type="button"
      onClick={handleToggle}
    >
      <span>{`Theme / ${themeModeLabels[themeMode]}`}</span>
    </button>
  );
}
