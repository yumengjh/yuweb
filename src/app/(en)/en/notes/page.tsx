import type { Metadata } from "next";

import { buildRouteMetadata } from "@/lib/seo/metadata";
import { getAllNotes } from "@/lib/notes/content";
import { NotesPage } from "@/components/notes-page/NotesPage";

export const metadata: Metadata = buildRouteMetadata("en-US", "notes");

export default async function EnNotesPage() {
  const staticNotes = await getAllNotes("en-US");
  return <NotesPage staticNotes={staticNotes} locale="en-US" />;
}
