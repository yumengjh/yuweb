import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { buildRouteMetadata } from "@/lib/seo/metadata";
import { getAllSlugs, getNoteBySlug } from "@/lib/notes/content";
import { NoteDetail } from "@/components/note-detail/NoteDetail";

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllSlugs("zh-CN");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ docId: string }>;
}): Promise<Metadata> {
  const { docId } = await params;
  const note = await getNoteBySlug("zh-CN", docId);
  if (!note) return buildRouteMetadata("zh-CN", "notes");
  return {
    title: `${note.title} | 笔记`,
    description: note.excerpt,
  };
}

export default async function NoteDocPage({ params }: { params: Promise<{ docId: string }> }) {
  const { docId } = await params;
  const note = await getNoteBySlug("zh-CN", docId);

  if (!note) {
    notFound();
  }

  return <NoteDetail note={note} locale="zh-CN" />;
}
