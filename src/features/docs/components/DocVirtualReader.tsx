"use client";
// cspell:ignore Shiki

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { DOC_READER_PAGE_LIMIT } from "@/features/docs/lib/docs-reader";
import type { RenderBlock, VirtualReaderInitialState } from "@/features/docs/lib/docs-types";
import {
  contentTreeToFlatBlocks,
  mergeRenderBlocks,
  resolvePagination,
  toRenderBlocks,
} from "@/features/docs/lib/docs-transform";
import {
  getCodeThemeByMode,
  getShikiHighlighter,
  resolveCodeLanguageForShiki,
  type CodeThemeMode,
} from "@/features/docs/lib/docs-code-highlight";
import { getDocsCopy } from "@/features/docs/lib/docs-copy";
import type { SiteLocale } from "@/lib/i18n";

import { DocsAlert } from "./DocsAlert";
import { DocsEmpty } from "./DocsEmpty";
import { DocsLoading } from "./DocsLoading";
import styles from "./DocVirtualReader.module.scss";

const highlightHtmlCache = new Map<string, string>();

type ReaderStats = {
  totalBlocks: number;
  loadedBlocks: number;
  renderedBlocks: number;
  hasMore: boolean;
  loadedChars: number;
};

type ReadStatus = "idle" | "loading" | "append_loading" | "success" | "error" | "done";

type ContentResponse = {
  docId: string;
  tree?: Parameters<typeof contentTreeToFlatBlocks>[0]["tree"];
  pagination?: Parameters<typeof resolvePagination>[0];
  totalBlocks?: number;
  hasMore?: boolean;
  nextStartBlockId?: string | null;
};

function normalizeErrorMessage(input: unknown) {
  if (!input || typeof input !== "object") return "加载文档失败";
  const withMessage = input as { message?: unknown };
  if (typeof withMessage.message === "string" && withMessage.message.trim()) {
    return withMessage.message;
  }
  return "加载文档失败";
}

async function fetchDocumentContent(
  docsApiBaseUrl: string,
  docId: string,
  query: Record<string, string | number | undefined>,
) {
  if (!docsApiBaseUrl) {
    throw new Error("缺少 NEXT_PUBLIC_DOCS_API_BASE_URL，无法继续加载正文");
  }

  const url = new URL(
    `${docsApiBaseUrl.replace(/\/+$/, "")}/api/v1/documents/${encodeURIComponent(docId)}/content`,
  );

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    url.searchParams.set(key, String(value));
  });

  const response = await fetch(url.toString(), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`请求失败（${response.status}）`);
  }

  const payload = (await response.json()) as {
    success?: boolean;
    data?: ContentResponse;
    error?: { message?: string | string[] };
  };

  if (payload.success !== true || payload.data === undefined) {
    throw new Error(normalizeErrorMessage({ message: payload.error?.message }));
  }

  return payload.data;
}

export function DocVirtualReader({
  docsApiBaseUrl,
  docId,
  initialState,
  locale,
  onStatsChange,
  publishedHead,
}: {
  docsApiBaseUrl: string;
  docId: string;
  publishedHead: number;
  initialState: VirtualReaderInitialState;
  locale: SiteLocale;
  onStatsChange: (stats: ReaderStats) => void;
}) {
  const copy = getDocsCopy(locale);
  const [status, setStatus] = useState<ReadStatus>(() =>
    initialState.hasMore ? "success" : "done",
  );
  const [error, setError] = useState<string>();
  const [items, setItems] = useState<RenderBlock[]>(() => initialState.items || []);
  const [totalBlocks, setTotalBlocks] = useState(
    () => initialState.totalBlocks || initialState.items.length || 0,
  );
  const [returnedBlocks, setReturnedBlocks] = useState(
    () => initialState.returnedBlocks || initialState.items.length || 0,
  );
  const [hasMore, setHasMore] = useState(() => Boolean(initialState.hasMore));
  const [nextStartBlockId, setNextStartBlockId] = useState<string | null>(
    () => initialState.nextStartBlockId || null,
  );
  const [themeMode, setThemeMode] = useState<CodeThemeMode>("light");
  const [highlighter, setHighlighter] = useState<Awaited<
    ReturnType<typeof getShikiHighlighter>
  > | null>(null);
  const isLoadingNextPageRef = useRef(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const loadedChars = useMemo(
    () => items.reduce((sum, item) => sum + item.markdown.length, 0),
    [items],
  );

  const renderItemHtml = useCallback(
    (item: RenderBlock) => {
      if (!highlighter || item.normalized.type !== "code") return item.html;

      const cacheKey = `${item.renderKey}:${themeMode}`;
      const cached = highlightHtmlCache.get(cacheKey);
      if (cached) return cached;

      try {
        const lang = resolveCodeLanguageForShiki(highlighter, item.normalized.language);
        const highlighted = highlighter.codeToHtml(item.normalized.text || "", {
          lang,
          theme: getCodeThemeByMode(themeMode),
        });
        highlightHtmlCache.set(cacheKey, highlighted);
        return highlighted;
      } catch {
        return item.html;
      }
    },
    [highlighter, themeMode],
  );

  const emitStats = useCallback(
    (nextItems: RenderBlock[], nextTotalBlocks: number, nextHasMore: boolean) => {
      onStatsChange({
        totalBlocks: nextTotalBlocks,
        loadedBlocks: nextItems.length,
        renderedBlocks: nextItems.length,
        hasMore: nextHasMore,
        loadedChars: nextItems.reduce((sum, item) => sum + item.markdown.length, 0),
      });
    },
    [onStatsChange],
  );

  const loadNextPage = useCallback(async () => {
    if (!docId || !hasMore || !nextStartBlockId) return false;
    if (status === "append_loading" || status === "loading" || isLoadingNextPageRef.current) {
      return false;
    }

    isLoadingNextPageRef.current = true;
    setStatus("append_loading");
    setError(undefined);

    try {
      const content = await fetchDocumentContent(docsApiBaseUrl, docId, {
        version: publishedHead,
        startBlockId: nextStartBlockId,
        limit: DOC_READER_PAGE_LIMIT,
      });
      const incoming = toRenderBlocks(contentTreeToFlatBlocks(content));

      let nextItems: RenderBlock[] = items;
      let nextTotal = totalBlocks;
      let nextHasMoreValue: boolean = hasMore;
      let nextBlockId: string | null = nextStartBlockId;

      setItems((currentItems) => {
        nextItems = mergeRenderBlocks(currentItems, incoming);
        const currentCount = nextItems.length;
        const progressed = currentCount > currentItems.length;
        const pagination = resolvePagination(
          content.pagination,
          {
            totalBlocks: content.totalBlocks,
            hasMore: content.hasMore,
            nextStartBlockId: content.nextStartBlockId,
          },
          currentCount,
          totalBlocks,
        );
        const fallbackNextBlockId =
          incoming.length > 0 ? incoming[incoming.length - 1]?.blockId : nextStartBlockId;

        nextBlockId =
          pagination.responseNextStartBlockId ||
          ((pagination.responseHasMore || pagination.inferredHasMore) && progressed
            ? fallbackNextBlockId
            : null);
        nextHasMoreValue = Boolean(
          (pagination.responseHasMore || pagination.inferredHasMore) && progressed && nextBlockId,
        );
        nextTotal = pagination.totalBlocks;

        setTotalBlocks(nextTotal);
        setReturnedBlocks(currentCount);
        setHasMore(nextHasMoreValue);
        setNextStartBlockId(nextBlockId || null);

        return nextItems;
      });

      setStatus(nextHasMoreValue ? "success" : "done");
      setError(undefined);
      emitStats(nextItems, nextTotal, nextHasMoreValue);
      isLoadingNextPageRef.current = false;
      return true;
    } catch (loadError) {
      setStatus("error");
      setError(normalizeErrorMessage(loadError));
      isLoadingNextPageRef.current = false;
      return false;
    }
  }, [
    docId,
    docsApiBaseUrl,
    emitStats,
    hasMore,
    items,
    nextStartBlockId,
    publishedHead,
    status,
    totalBlocks,
  ]);

  useEffect(() => {
    highlightHtmlCache.clear();
    isLoadingNextPageRef.current = false;
    emitStats(
      initialState.items || [],
      initialState.totalBlocks || initialState.items.length || 0,
      Boolean(initialState.hasMore),
    );
  }, [emitStats, initialState]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = (isDark: boolean) => setThemeMode(isDark ? "dark" : "light");
    applyTheme(media.matches);

    const onThemeChange = (event: MediaQueryListEvent) => {
      applyTheme(event.matches);
      highlightHtmlCache.clear();
    };

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", onThemeChange);
      return () => media.removeEventListener("change", onThemeChange);
    }

    media.addListener(onThemeChange);
    return () => media.removeListener(onThemeChange);
  }, []);

  useEffect(() => {
    let active = true;
    getShikiHighlighter()
      .then((instance) => {
        if (active) setHighlighter(instance);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!hasMore || !loadMoreRef.current || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const matched = entries.some((entry) => entry.isIntersecting);
        if (matched) {
          void loadNextPage();
        }
      },
      {
        rootMargin: "320px 0px",
      },
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasMore, loadNextPage]);

  if (status === "loading" && items.length === 0) {
    return <DocsLoading label={copy.loading} />;
  }

  if (items.length === 0) {
    return <DocsEmpty description={copy.emptyContent} title={copy.emptyTitle} />;
  }

  return (
    <div className={styles.shell}>
      {error && items.length > 0 ? (
        <div className={styles.topAlert}>
          <DocsAlert body={error} title={copy.detailLoadFailedTitle} tone="warning" />
        </div>
      ) : null}

      <section className={styles.host}>
        <div className={styles.inner}>
          {items.map((item) => (
            <article key={item.renderKey} className={styles.row}>
              <div
                className={styles.rowContent}
                dangerouslySetInnerHTML={{ __html: renderItemHtml(item) }}
              />
            </article>
          ))}
        </div>
      </section>

      {(status === "append_loading" || hasMore || Boolean(error)) && (
        <div className={styles.bottomStatus}>
          {status === "append_loading" ? (
            <div className={styles.bottomLoading}>
              <span aria-hidden="true">•</span>
              <span>{copy.loadingMore}</span>
            </div>
          ) : hasMore ? (
            <div>{copy.continueToLoad}</div>
          ) : null}

          <div className={styles.bottomMeta}>
            {copy.loadedBlocksLabel} {returnedBlocks} / {totalBlocks || returnedBlocks}
          </div>

          {error && status !== "append_loading" ? (
            <button
              type="button"
              className={styles.retryButton}
              onClick={() => void loadNextPage()}
            >
              {copy.retryLoadMore}
            </button>
          ) : null}
        </div>
      )}

      {hasMore ? <div ref={loadMoreRef} className={styles.loadMoreSentinel} /> : null}

      <div className={styles.footerMeta}>
        {copy.loadedBlocksLabel} {items.length} / {totalBlocks || items.length}
        <span aria-hidden="true"> · </span>
        {copy.readTimeLabel} {Math.max(1, Math.round(loadedChars / 450))} {copy.minuteUnit}
      </div>
    </div>
  );
}
