"use client";

import { useState, useEffect } from "react";

import type { UnifiedNoteMeta } from "@/lib/notes/types";
import { fetchDocuments } from "@/lib/api/client";

const WORKSPACE_ID = process.env.NEXT_PUBLIC_WORKSPACE_ID ?? "";

export function useRemoteNotes() {
  const [remoteNotes, setRemoteNotes] = useState<UnifiedNoteMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const data = await fetchDocuments(WORKSPACE_ID);
        if (cancelled) return;

        const notes: UnifiedNoteMeta[] = (data.items ?? [])
          .filter((doc) => doc.visibility === "public" && doc.publishedHead > 0)
          .map((doc) => ({
            slug: doc.docId,
            title: doc.title,
            date: doc.updatedAt?.split("T")[0] ?? doc.createdAt?.split("T")[0] ?? "",
            tags: [],
            excerpt: doc.category ?? "",
            source: "remote" as const,
            icon: doc.icon || undefined,
          }));

        setRemoteNotes(notes);
        setError(null);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load remote notes");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { remoteNotes, loading, error };
}
