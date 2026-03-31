"use client";

import { useMemo, useState } from "react";

import type { SiteLocale } from "@/lib/i18n";
import { getDocsCopy } from "@/features/docs/lib/docs-copy";
import type {
  PreferenceSettings,
  PublishedDocPageData,
  TagMeta,
} from "@/features/docs/lib/docs-types";
import {
  buildDocsRootStyle,
  formatDocsTime,
  getDocumentAuthorText,
  normalizeTagColor,
} from "@/features/docs/lib/docs-view";

import { DocVirtualReader } from "./DocVirtualReader";
import styles from "./DocDetailClient.module.scss";

type ReaderStats = {
  totalBlocks: number;
  loadedBlocks: number;
  renderedBlocks: number;
  hasMore: boolean;
  loadedChars: number;
};

export function DocDetailClient({
  docsApiBaseUrl,
  locale,
  pageData,
  settings,
  showDocDebugMeta,
  tagMap,
}: {
  docsApiBaseUrl: string;
  locale: SiteLocale;
  pageData: PublishedDocPageData;
  settings: PreferenceSettings;
  showDocDebugMeta: boolean;
  tagMap: Record<string, TagMeta>;
}) {
  const copy = getDocsCopy(locale);
  const initialLoadedChars = useMemo(
    () => pageData.initialState.items.reduce((sum, item) => sum + item.markdown.length, 0),
    [pageData.initialState.items],
  );
  const [readerStats, setReaderStats] = useState<ReaderStats>({
    totalBlocks: Math.max(pageData.initialState.totalBlocks, pageData.initialState.items.length, 0),
    loadedBlocks: pageData.initialState.items.length,
    renderedBlocks: Math.min(pageData.initialState.items.length, 40),
    hasMore: Boolean(pageData.initialState.hasMore && pageData.initialState.nextStartBlockId),
    loadedChars: initialLoadedChars,
  });

  const displayTags = useMemo(() => {
    if (!Array.isArray(pageData.meta.tags)) {
      return [];
    }

    const unique = new Set<string>();

    return pageData.meta.tags.flatMap((rawTagId) => {
      if (typeof rawTagId !== "string") return [];
      const tagId = rawTagId.trim();
      if (!tagId || unique.has(tagId)) return [];
      unique.add(tagId);

      const tagMeta = tagMap[tagId];
      const label =
        typeof tagMeta?.name === "string" && tagMeta.name.trim() ? tagMeta.name.trim() : tagId;
      const color = normalizeTagColor(tagMeta?.color);

      return [
        {
          tagId,
          label,
          style: color
            ? {
                borderColor: color,
                color,
              }
            : undefined,
        },
      ];
    });
  }, [pageData.meta.tags, tagMap]);

  const totalBlocks = Math.max(readerStats.totalBlocks, readerStats.loadedBlocks, 0);
  const remainingBlocks = Math.max(totalBlocks - readerStats.loadedBlocks, 0);
  const estimatedReadMinutes = (() => {
    const safeLoadedChars = Math.max(readerStats.loadedChars, 0);
    if (safeLoadedChars <= 0 || readerStats.loadedBlocks <= 0 || totalBlocks <= 0) return 1;
    const ratio = Math.max(readerStats.loadedBlocks / totalBlocks, 0.05);
    const estimatedTotalChars = Math.round(safeLoadedChars / ratio);
    return Math.max(1, Math.round(estimatedTotalChars / 450));
  })();

  return (
    <section className={styles.shell} style={buildDocsRootStyle(settings)}>
      {showDocDebugMeta ? (
        <div className={styles.metaSticky}>
          <div className={styles.metaInner}>
            <span>
              {copy.readTimeLabel} {estimatedReadMinutes} {copy.minuteUnit}
            </span>
            <span>
              {copy.loadedBlocksLabel} {readerStats.loadedBlocks} / {totalBlocks}
            </span>
            <span>
              {copy.remainingBlocksLabel} {remainingBlocks}
            </span>
            <span>
              {copy.versionLabel} v{pageData.publishedHead}
            </span>
            <span>
              {copy.hasMoreLabel} {readerStats.hasMore ? copy.yes : copy.no}
            </span>
            <span>
              {copy.renderedBlocksLabel} {readerStats.renderedBlocks}
            </span>
            <span>
              {copy.updatedAtLabel}{" "}
              <span suppressHydrationWarning>
                {formatDocsTime(
                  pageData.meta.updatedAt || pageData.meta.createdAt,
                  locale,
                  copy.unknownTime,
                )}
              </span>
            </span>
          </div>
        </div>
      ) : null}

      <div className={`${styles.container} ${styles.headerContainer}`}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            <span className={styles.titleIcon}>{pageData.meta.icon || "📄"}</span>
            <span>{pageData.meta.title || copy.untitledDocument}</span>
          </h1>

          <div className={styles.metaRow}>
            <div className={styles.submeta}>
              <span className={styles.submetaItem}>
                {copy.authorLabel}：{getDocumentAuthorText(pageData.meta, copy.unknownUser)}
              </span>
              <span className={styles.submetaItem}>
                {copy.timeLabel}：
                <span suppressHydrationWarning>
                  {formatDocsTime(
                    pageData.meta.updatedAt || pageData.meta.createdAt,
                    locale,
                    copy.unknownTime,
                  )}
                </span>
              </span>
            </div>

            {displayTags.length > 0 ? (
              <div className={styles.tags}>
                {displayTags.map((tag) => (
                  <span key={tag.tagId} className={styles.tag} style={tag.style}>
                    {tag.label}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </header>
      </div>

      <div className={styles.container}>
        <DocVirtualReader
          docsApiBaseUrl={docsApiBaseUrl}
          docId={pageData.meta.docId}
          initialState={pageData.initialState}
          locale={locale}
          onStatsChange={setReaderStats}
          publishedHead={pageData.publishedHead}
        />
      </div>
    </section>
  );
}
