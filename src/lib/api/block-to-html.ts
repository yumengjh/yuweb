import MarkdownIt from "markdown-it";

import type { ApiBlockNode } from "./client";

let mdInstance: MarkdownIt | null = null;

function getMd(): MarkdownIt {
  if (!mdInstance) {
    mdInstance = new MarkdownIt({
      html: false,
      linkify: true,
      typographer: true,
    });
  }
  return mdInstance;
}

/** Render markdown inline (bold, italic, code, links) without wrapping <p>. */
function renderInlineMd(text: string): string {
  return getMd().renderInline(text);
}

/**
 * Detect if text is a markdown heading (e.g. "# Title", "## Subtitle").
 * Returns { level, text } if heading, null otherwise.
 */
function extractHeading(text: string): { level: number; text: string } | null {
  const match = text.match(/^(#{1,6})\s+(.+)$/);
  if (!match) return null;
  return { level: match[1].length, text: match[2] };
}

function renderListItem(item: Record<string, unknown> | string): string {
  if (typeof item === "string") {
    return `<li>${renderInlineMd(item)}</li>`;
  }

  const text = typeof item.text === "string" ? item.text : "";
  const children = item.children;

  let childrenHtml = "";
  if (Array.isArray(children) && children.length > 0) {
    const items = children
      .map((child: Record<string, unknown> | string) => renderListItem(child))
      .join("");
    childrenHtml = `<ul>${items}</ul>`;
  }

  return `<li>${renderInlineMd(text)}${childrenHtml}</li>`;
}

function renderBlock(node: ApiBlockNode): string {
  const childrenHtml = (node.children ?? []).map(renderBlock).join("");

  switch (node.type) {
    case "root":
      return childrenHtml;

    case "heading": {
      const level =
        typeof node.payload.level === "number" ? Math.min(6, Math.max(1, node.payload.level)) : 1;
      const text = typeof node.payload.text === "string" ? node.payload.text : "";
      return `<h${level}>${renderInlineMd(text)}</h${level}>`;
    }

    case "paragraph": {
      const text = typeof node.payload.text === "string" ? node.payload.text : "";
      // Backend may store headings as paragraph with "# text" — detect and promote
      const heading = extractHeading(text);
      if (heading) {
        return `<h${heading.level}>${renderInlineMd(heading.text)}</h${heading.level}>`;
      }
      return `<p>${renderInlineMd(text)}</p>`;
    }

    case "list": {
      const listType = node.payload.type;
      const tag = listType === "ordered" ? "ol" : "ul";
      const items = node.payload.items;
      if (Array.isArray(items)) {
        const itemsHtml = items
          .map((item: Record<string, unknown> | string) => renderListItem(item))
          .join("");
        return `<${tag}>${itemsHtml}</${tag}>`;
      }
      return `<${tag}>${childrenHtml}</${tag}>`;
    }

    case "code": {
      const text = typeof node.payload.text === "string" ? node.payload.text : "";
      const lang = typeof node.payload.language === "string" ? node.payload.language : "";
      const langAttr = lang ? ` class="language-${lang}"` : "";
      return `<pre><code${langAttr}>${text}</code></pre>`;
    }

    case "quote": {
      const text = typeof node.payload.text === "string" ? node.payload.text : "";
      return `<blockquote><p>${renderInlineMd(text)}</p>${childrenHtml}</blockquote>`;
    }

    case "image": {
      const url = typeof node.payload.url === "string" ? node.payload.url : "";
      const caption = typeof node.payload.caption === "string" ? node.payload.caption : "";
      return `<img src="${url}" alt="${caption}">`;
    }

    case "divider":
      return "<hr>";

    default: {
      const text = typeof node.payload.text === "string" ? node.payload.text : "";
      return `<p>${renderInlineMd(text)}</p>`;
    }
  }
}

export function blockTreeToHtml(tree: ApiBlockNode): string {
  return renderBlock(tree);
}
