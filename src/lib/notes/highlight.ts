import { createHighlighter } from "shiki";
import { fromHighlighter } from "@shikijs/markdown-it";
import MarkdownIt from "markdown-it";

let mdPromise: Promise<MarkdownIt> | null = null;

function getMarkdownRenderer(): Promise<MarkdownIt> {
  if (!mdPromise) {
    mdPromise = (async () => {
      const highlighter = await createHighlighter({
        themes: ["github-light", "github-dark"],
        langs: [
          "javascript",
          "typescript",
          "jsx",
          "tsx",
          "css",
          "scss",
          "html",
          "json",
          "bash",
          "shell",
          "python",
          "markdown",
          "vue",
          "yaml",
          "diff",
        ],
      });

      const md = new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true,
      });

      md.use(
        fromHighlighter(highlighter, {
          themes: {
            light: "github-light",
            dark: "github-dark",
          },
        }),
      );

      return md;
    })();
  }

  return mdPromise;
}

export { getMarkdownRenderer };
