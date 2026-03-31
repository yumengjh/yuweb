import type { CSSProperties } from "react";

import type { DocumentMeta, PreferenceSettings, TagMeta } from "@/features/docs/lib/docs-types";

export function createTagMap(items: TagMeta[]) {
  const map: Record<string, TagMeta> = {};

  items.forEach((tag) => {
    const tagId = typeof tag?.tagId === "string" ? tag.tagId.trim() : "";
    if (!tagId) {
      return;
    }

    map[tagId] = tag;
  });

  return map;
}

export function normalizeTagColor(value?: string) {
  if (typeof value !== "string") {
    return "";
  }

  const color = value.trim();
  if (!color) {
    return "";
  }

  return /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(color) ? color : "";
}

export function formatDocsTime(value: string | undefined, locale: string, fallback: string) {
  if (!value) {
    return fallback;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString(locale, { hour12: false });
}

export function getDocumentAuthorText(meta: DocumentMeta | undefined, fallback: string) {
  if (!meta) {
    return fallback;
  }

  const isLikelyUserId = (value: string) => {
    const normalized = value.trim();
    return /^u_[a-z0-9_]+$/i.test(normalized) || /^user[_-]/i.test(normalized);
  };

  const candidates = [
    meta.authorDisplayName,
    meta.displayName,
    meta.createdByDisplayName,
    meta.authorName,
    meta.createdByName,
    meta.authorUsername,
    meta.createdByUsername,
    meta.username,
    typeof meta.author === "string" && !isLikelyUserId(meta.author) ? meta.author : undefined,
  ];

  const picked = candidates.find((item) => typeof item === "string" && item.trim().length > 0);
  return picked ? String(picked) : fallback;
}

export function buildDocsRootStyle(settings: PreferenceSettings) {
  return {
    "--doc-reader-content-width": `${settings.reader.contentWidth}px`,
    "--doc-reader-font-size": `${settings.reader.fontSize}px`,
    "--doc-code-font-family": settings.advanced.codeFontFamily,
    "--doc-list-spacing": settings.advanced.compactList ? "0px" : "8px",
  } as CSSProperties;
}
