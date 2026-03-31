// cspell:ignore shiki Shiki

import { createHighlighter, type Highlighter } from "shiki";

export type CodeThemeMode = "light" | "dark";

const LANGUAGE_ALIAS_MAP: Record<string, string> = {
  js: "javascript",
  jsx: "jsx",
  ts: "typescript",
  tsx: "tsx",
  yml: "yaml",
  sh: "bash",
  shell: "bash",
  zsh: "bash",
  text: "plaintext",
  plain: "plaintext",
};

let highlighterPromise: Promise<Highlighter> | null = null;

function normalizeLanguage(language?: string) {
  const raw = (language || "").trim().toLowerCase();
  if (!raw) return "plaintext";
  return LANGUAGE_ALIAS_MAP[raw] || raw;
}

export function getCodeThemeByMode(mode: CodeThemeMode) {
  return mode === "dark" ? "github-dark" : "github-light";
}

export function getShikiHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["github-light", "github-dark"],
      langs: [
        "plaintext",
        "bash",
        "json",
        "yaml",
        "markdown",
        "javascript",
        "typescript",
        "tsx",
        "jsx",
        "html",
        "css",
        "sql",
        "python",
        "java",
        "go",
        "rust",
      ],
    });
  }

  return highlighterPromise;
}

export function resolveCodeLanguageForShiki(highlighter: Highlighter, language?: string) {
  const normalized = normalizeLanguage(language);
  return highlighter.getLoadedLanguages().includes(normalized as never) ? normalized : "plaintext";
}
