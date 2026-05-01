import Link from "next/link";

import type { SiteLocale } from "@/lib/i18n";
import { createTranslator } from "@/lib/i18n";
import type { NoteDoc } from "@/lib/notes/types";

import styles from "./NoteDetail.module.scss";

export function NoteDetail({
  note,
  locale,
}: {
  note: NoteDoc;
  locale: SiteLocale;
}) {
  const t = createTranslator(locale);
  const localePrefix = locale === "en-US" ? "/en" : "";

  return (
    <main className={styles.page}>
      <article className={styles.article}>
        <Link href={`${localePrefix}/notes/`} className={styles.back}>
          &larr; {locale === "zh-CN" ? "返回列表" : "Back to notes"}
        </Link>

        <header className={styles.header}>
          <h1 className={styles.title}>{note.title}</h1>
          <div className={styles.meta}>
            <time className={styles.date}>{note.date}</time>
            {note.tags.length > 0 && (
              <div className={styles.tags}>
                {note.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: note.content }}
        />
      </article>
    </main>
  );
}
