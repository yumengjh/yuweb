"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

import { createTranslator, type SiteLocale } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";
import type { NoteMeta, UnifiedNoteMeta } from "@/lib/notes/types";

import { useRemoteNotes } from "./useRemoteNotes";
import { RemoteNoteView } from "./RemoteNoteView";

import styles from "./NotesPage.module.scss";

export function NotesPage({
  staticNotes,
  locale,
}: {
  staticNotes: NoteMeta[];
  locale: SiteLocale;
}) {
  const t = createTranslator(locale);
  const localePrefix = locale === "en-US" ? "/en" : "";
  const { remoteNotes, loading } = useRemoteNotes();

  const [activeRemoteId, setActiveRemoteId] = useState<string | null>(null);

  // Hash routing: listen for hash changes to show remote doc detail
  useEffect(() => {
    function onHashChange() {
      const hash = window.location.hash.slice(1);
      setActiveRemoteId(hash || null);
    }

    // Check initial hash
    onHashChange();

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const handleBack = useCallback(() => {
    window.location.hash = "";
    setActiveRemoteId(null);
  }, []);

  // If viewing a remote document, show detail view
  if (activeRemoteId) {
    return (
      <main className={styles.page}>
        <div className={styles.inner}>
          <RemoteNoteView docId={activeRemoteId} locale={locale} onBack={handleBack} />
        </div>
      </main>
    );
  }

  // Merge static + remote notes, sort by date descending
  const allNotes: UnifiedNoteMeta[] = [
    ...staticNotes.map((n) => ({ ...n, source: "local" as const })),
    ...remoteNotes,
  ].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>{t(siteConfig.routeMeta.notes.title)}</h1>
        <p className={styles.description}>{t(siteConfig.routeMeta.notes.description)}</p>

        <ul className={styles.list}>
          {allNotes.map((note) => (
            <li key={`${note.source}-${note.slug}`} className={styles.card}>
              {note.source === "local" ? (
                <Link href={`${localePrefix}/notes/${note.slug}/`} className={styles.cardLink}>
                  <NoteCardContent note={note} />
                </Link>
              ) : (
                <a href={`#${note.slug}`} className={styles.cardLink}>
                  <NoteCardContent note={note} />
                </a>
              )}
            </li>
          ))}
        </ul>

        {loading && (
          <p className={styles.loading}>
            {locale === "zh-CN" ? "加载远程文档中..." : "Loading remote documents..."}
          </p>
        )}

        {!loading && allNotes.length === 0 && (
          <p className={styles.empty}>{locale === "zh-CN" ? "暂无文章" : "No articles yet"}</p>
        )}
      </div>
    </main>
  );
}

function NoteCardContent({ note }: { note: UnifiedNoteMeta }) {
  return (
    <>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>
          {note.icon && <span className={styles.cardIcon}>{note.icon}</span>}
          {note.title}
        </h2>
        <time className={styles.cardDate}>{note.date}</time>
      </div>
      {note.excerpt && <p className={styles.cardExcerpt}>{note.excerpt}</p>}
      {note.tags.length > 0 && (
        <div className={styles.cardTags}>
          {note.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </>
  );
}
