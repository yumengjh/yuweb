"use client";

import { useEffect, useMemo, useState } from "react";

import { PixelCard, type PixelCardProps } from "@/components/common/pixel-card/PixelCard";

type ResolvedTheme = "light" | "dark";

type CollectionsPixelBackgroundProps = Omit<
  PixelCardProps,
  "colors" | "glowColor" | "children" | "interactive" | "noFocus" | "pulse" | "shimmer"
>;

const themeColorMap = {
  light: {
    colors: "#fef9c3,#fde68a,#facc15,#fbbf24",
    glowColor: "transparent",
  },
  dark: {
    colors: "#facc15,#eab308,#ca8a04,#a16207",
    glowColor: "transparent",
  },
} as const;

function getResolvedTheme(): ResolvedTheme {
  if (typeof document === "undefined") {
    return "light";
  }

  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function CollectionsPixelBackground(props: CollectionsPixelBackgroundProps) {
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => getResolvedTheme());

  useEffect(() => {
    const syncResolvedTheme = () => {
      setResolvedTheme(getResolvedTheme());
    };

    syncResolvedTheme();

    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      syncResolvedTheme();
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    const mediaQuery =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-color-scheme: dark)")
        : null;
    const handleMediaChange = () => {
      syncResolvedTheme();
    };

    mediaQuery?.addEventListener?.("change", handleMediaChange);

    return () => {
      observer.disconnect();
      mediaQuery?.removeEventListener?.("change", handleMediaChange);
    };
  }, []);

  const themeColors = useMemo(() => {
    return themeColorMap[resolvedTheme];
  }, [resolvedTheme]);

  return (
    <PixelCard
      {...props}
      colors={themeColors.colors}
      glowColor={themeColors.glowColor}
      interactive={false}
      noFocus
      pulse
      shimmer={false}
    />
  );
}
