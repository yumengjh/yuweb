"use client";

import { useState, useEffect } from "react";

import type { SiteLocale } from "@/lib/i18n";
import type { NoteDoc } from "@/lib/notes/types";
import { fetchDocument, fetchDocumentContent } from "@/lib/api/client";
import { blockTreeToHtml } from "@/lib/api/block-to-html";

import styles from "./RemoteNoteView.module.scss";

export function RemoteNoteView({
  docId,
  locale,
  onBack,
}: {
  docId: string;
  locale: SiteLocale;
  onBack: () => void;
}) {
  const [note, setNote] = useState<NoteDoc | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [meta, content] = await Promise.all([
          fetchDocument(docId),
          fetchDocumentContent(docId),
        ]);
        if (cancelled) return;

        const html = blockTreeToHtml(content.tree);
        setNote({
          slug: docId,
          title: meta.title,
          date: meta.updatedAt?.split("T")[0] ?? meta.createdAt?.split("T")[0] ?? "",
          tags: [],
          excerpt: meta.category ?? "",
          content: html,
        });
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load document");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [docId]);

  if (error) {
    return (
      <div className={styles.wrapper}>
        <button className={styles.back} onClick={onBack} type="button">
          &larr; {locale === "zh-CN" ? "返回列表" : "Back to notes"}
        </button>
        <p className={styles.error}>{error}</p>
      </div>
    );
  }

  if (!note) {
    return (
      <div className={styles.wrapper}>
        <button className={styles.back} onClick={onBack} type="button">
          &larr; {locale === "zh-CN" ? "返回列表" : "Back to notes"}
        </button>
        <div className={styles.skeleton}>
          <div className={styles.skeletonTitle} />
          <div className={styles.skeletonMeta} />
          <div className={styles.skeletonLine} />
          <div className={styles.skeletonLine} />
          <div className={styles.skeletonLineShort} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <button className={styles.back} onClick={onBack} type="button">
        &larr; {locale === "zh-CN" ? "返回列表" : "Back to notes"}
      </button>

      <article className={styles.article}>
        <header className={styles.header}>
          <h1 className={styles.title}>{note.title}</h1>
          <div className={styles.meta}>
            <time className={styles.date}>{note.date}</time>
          </div>
        </header>

        <div className={styles.content} dangerouslySetInnerHTML={{ __html: note.content }} />
      </article>
    </div>
  );
}
