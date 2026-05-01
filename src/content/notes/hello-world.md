---
title: "Hello World"
date: "2026-04-30"
tags: ["笔记", "前端"]
excerpt: "第一篇文章，记录这个笔记系统的搭建过程。"
---

# Hello World

这是笔记系统的第一篇文章。

## 功能特性

- 基于 Markdown 文件自动生成文章列表
- 支持 frontmatter 元信息（标题、日期、标签、摘要）
- 使用 markdown-it 渲染 HTML，与 VitePress 同款

## 代码示例

```typescript
import { getAllNotes } from "@/lib/notes/content";

const notes = getAllNotes("zh-CN");
console.log(notes);
```

## 使用方式

在 `src/content/notes/` 目录下创建 `.md` 文件即可：

```markdown
---
title: "文章标题"
date: "2026-04-30"
tags: ["标签1", "标签2"]
excerpt: "简短摘要"
---

正文内容...
```

保存后刷新页面，文章会自动出现在列表中。

