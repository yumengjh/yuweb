import Link from "next/link";

import type { SiteLocale } from "@/lib/i18n";
import { localizeHref } from "@/lib/i18n";
import type { DocumentMeta, TagMeta } from "@/features/docs/lib/docs-types";
import { getDocsCopy } from "@/features/docs/lib/docs-copy";
import { formatDocsTime, normalizeTagColor } from "@/features/docs/lib/docs-view";

import styles from "./DocCard.module.scss";

const MAX_VISIBLE_TAGS = 4;

function normalizeTagIds(value?: string[]) {
  if (!Array.isArray(value)) {
    return [];
  }

  const unique = new Set<string>();
  const result: string[] = [];

  value.forEach((item) => {
    if (typeof item !== "string") {
      return;
    }

    const normalized = item.trim();
    if (!normalized || unique.has(normalized)) {
      return;
    }

    unique.add(normalized);
    result.push(normalized);
  });

  return result;
}

export function DocCard({
  doc,
  locale,
  tagMap,
}: {
  doc: DocumentMeta;
  locale: SiteLocale;
  tagMap: Record<string, TagMeta>;
}) {
  const copy = getDocsCopy(locale);
  const allTagIds = normalizeTagIds(doc.tags);
  const visibleTagIds = allTagIds.slice(0, MAX_VISIBLE_TAGS);
  const hiddenTagCount = Math.max(allTagIds.length - MAX_VISIBLE_TAGS, 0);

  return (
    <Link className={styles.link} href={localizeHref(`/notes/${doc.docId}`, locale)}>
      <article className={styles.card}>
        <header className={styles.header}>
          <span className={styles.icon}>{doc.icon || "📄"}</span>
          <h2 className={styles.title}>{doc.title || copy.untitledDocument}</h2>
        </header>

        <div className={styles.meta}>
          {visibleTagIds.length > 0 ? (
            <div className={styles.tags}>
              {visibleTagIds.map((tagId) => {
                const tag = tagMap[tagId];
                const color = normalizeTagColor(tag?.color);

                return (
                  <span
                    key={tagId}
                    className={styles.tag}
                    style={color ? { borderColor: color, color } : undefined}
                  >
                    {tag?.name?.trim() || tagId}
                  </span>
                );
              })}
              {hiddenTagCount > 0 ? (
                <span className={`${styles.tag} ${styles.tagMore}`}>+{hiddenTagCount}</span>
              ) : null}
            </div>
          ) : null}

          <div>
            {copy.docIdLabel}：{doc.docId}
          </div>
          <div>
            {copy.publishedVersionLabel}：v{doc.publishedHead}
          </div>
          <div>{formatDocsTime(doc.updatedAt || doc.createdAt, locale, copy.unknownTime)}</div>
        </div>
      </article>
    </Link>
  );
}
