---
title: "Hello World"
date: "2026-04-30"
tags: ["Notes", "Frontend"]
excerpt: "The first article, documenting the build process of this notes system."
---

# Hello World

This is the first article in the notes system.

## Features

- Auto-generate article list from Markdown files
- Support frontmatter metadata (title, date, tags, excerpt)
- Uses markdown-it for HTML rendering, same as VitePress

## Code Example

```typescript
import { getAllNotes } from "@/lib/notes/content";

const notes = getAllNotes("en-US");
console.log(notes);
```

## Usage

Create `.md` files in the `src/content/notes/en/` directory:

```markdown
---
title: "Article Title"
date: "2026-04-30"
tags: ["tag1", "tag2"]
excerpt: "Short excerpt"
---

Content here...
```

After saving, refresh the page and the article will appear in the list automatically.
