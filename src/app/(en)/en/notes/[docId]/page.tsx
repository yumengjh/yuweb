import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { buildRouteMetadata } from "@/lib/seo/metadata";
import { getAllSlugs, getNoteBySlug } from "@/lib/notes/content";
import { NoteDetail } from "@/components/note-detail/NoteDetail";

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllSlugs("en-US");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ docId: string }>;
}): Promise<Metadata> {
  const { docId } = await params;
  const note = await getNoteBySlug("en-US", docId);
  if (!note) return buildRouteMetadata("en-US", "notes");
  return {
    title: `${note.title} | Notes`,
    description: note.excerpt,
  };
}

export default async function EnglishNoteDocPage({
  params,
}: {
  params: Promise<{ docId: string }>;
}) {
  const { docId } = await params;
  const note = await getNoteBySlug("en-US", docId);

  if (!note) {
    notFound();
  }

  return <NoteDetail note={note} locale="en-US" />;
}
