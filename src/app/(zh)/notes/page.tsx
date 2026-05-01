import type { Metadata } from "next";

import { buildRouteMetadata } from "@/lib/seo/metadata";
import { getAllNotes } from "@/lib/notes/content";
import { NotesPage } from "@/components/notes-page/NotesPage";

export const metadata: Metadata = buildRouteMetadata("zh-CN", "notes");

export default async function ZhNotesPage() {
  const staticNotes = await getAllNotes("zh-CN");
  return <NotesPage staticNotes={staticNotes} locale="zh-CN" />;
}
