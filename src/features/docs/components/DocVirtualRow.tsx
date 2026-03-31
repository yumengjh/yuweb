"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef } from "react";

import styles from "./DocVirtualReader.module.scss";

export function DocVirtualRow({
  blockId,
  depth,
  html,
  onMeasured,
  renderKey,
  top,
}: {
  blockId: string;
  depth: number;
  top: number;
  html: string;
  renderKey: string;
  onMeasured: (blockId: string, height: number) => void;
}) {
  const rowRef = useRef<HTMLElement | null>(null);
  const safeDepth = Math.max(0, Math.min(6, Math.floor(depth || 0)));
  const depthClass = useMemo(() => {
    if (safeDepth <= 0) return "";
    return styles[`depth${safeDepth}` as keyof typeof styles] || "";
  }, [safeDepth]);

  useEffect(() => {
    const reportSize = () => {
      const height = rowRef.current?.getBoundingClientRect().height;
      if (!height || Number.isNaN(height)) {
        return;
      }

      onMeasured(blockId, Math.ceil(height) + 8);
    };

    queueMicrotask(reportSize);

    if (typeof ResizeObserver === "undefined" || !rowRef.current) {
      return;
    }

    const observer = new ResizeObserver(reportSize);
    observer.observe(rowRef.current);

    return () => observer.disconnect();
  }, [blockId, onMeasured, renderKey, html]);

  return (
    <article
      ref={rowRef}
      className={`${styles.row} ${depthClass}`.trim()}
      style={{ "--row-top": `${top}px` } as CSSProperties}
    >
      <div className={styles.rowContent} dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}
