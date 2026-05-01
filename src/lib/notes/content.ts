import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

import type { SiteLocale } from "@/lib/i18n";
import type { NoteDoc, NoteMeta } from "./types";
import { getMarkdownRenderer } from "./highlight";

const NOTES_DIR = path.join(process.cwd(), "src/content/notes");

function getNotesDir(locale: SiteLocale): string {
  return locale === "en-US" ? path.join(NOTES_DIR, "en") : NOTES_DIR;
}

async function parseMarkdownFile(
  filePath: string
): Promise<{ meta: Omit<NoteMeta, "slug">; content: string }> {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content: rawContent } = matter(fileContent);
  const md = await getMarkdownRenderer();

  return {
    meta: {
      title: data.title ?? "Untitled",
      date: data.date ?? "",
      tags: Array.isArray(data.tags) ? data.tags : [],
      excerpt: data.excerpt ?? "",
    },
    content: md.render(rawContent),
  };
}

export async function getAllNotes(locale: SiteLocale): Promise<NoteMeta[]> {
  const dir = getNotesDir(locale);

  if (!fs.existsSync(dir)) {
    return [];
  }

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));

  const notes = await Promise.all(
    files.map(async (filename) => {
      const slug = filename.replace(/\.md$/, "");
      const filePath = path.join(dir, filename);
      const { meta } = await parseMarkdownFile(filePath);
      return { slug, ...meta };
    })
  );

  return notes.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getNoteBySlug(
  locale: SiteLocale,
  slug: string
): Promise<NoteDoc | null> {
  const dir = getNotesDir(locale);
  const filePath = path.join(dir, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const { meta, content } = await parseMarkdownFile(filePath);
  return { slug, ...meta, content };
}

export async function getAllSlugs(
  locale: SiteLocale
): Promise<{ docId: string }[]> {
  const notes = await getAllNotes(locale);
  return notes.map((note) => ({ docId: note.slug }));
}
