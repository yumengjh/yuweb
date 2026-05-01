export interface NoteMeta {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
}

export interface NoteDoc extends NoteMeta {
  content: string;
}

export type NoteSource = "local" | "remote";

export interface UnifiedNoteMeta {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  source: NoteSource;
  icon?: string;
}
