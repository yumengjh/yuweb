# Notes 页面：Markdown 文章系统

这份文档用于记录本次为 Notes 页面实现的 Markdown 文章列表与渲染功能，包括技术选型、改动范围、文件结构与使用方式。

---

# 一、背景

项目已有 `/notes` 和 `/notes/[docId]` 路由（中英文），但一直是占位页（`RoutePlaceholderPage`）。目标是实现类似 VitePress 的功能：

- 在固定目录写 `.md` 文件
- 自动读取 frontmatter 元信息
- 生成文章列表
- 点击进入对应文章详情

关键约束：

- `output: "export"` 静态导出，所有页面必须构建时生成
- 项目无现有 markdown 处理依赖
- `src/content/` 目录已存在但为空

---

# 二、技术选型

选择了 **gray-matter + markdown-it** 方案：

| 库                   | 用途                                    |
| -------------------- | --------------------------------------- |
| `gray-matter`        | 解析 YAML frontmatter                   |
| `markdown-it`        | Markdown → HTML（VitePress 同款解析器） |
| `@types/markdown-it` | TypeScript 类型定义                     |

未选择 Velite、Contentlayer 等重型框架，保持项目依赖轻量。

---

# 三、改动清单

## 3.1 新增依赖

```
pnpm add gray-matter markdown-it
pnpm add -D @types/markdown-it
```

## 3.2 新建文件

### 类型与工具层

| 文件                       | 职责                                                        |
| -------------------------- | ----------------------------------------------------------- |
| `src/lib/notes/types.ts`   | `NoteMeta`、`NoteDoc` 类型定义                              |
| `src/lib/notes/content.ts` | 文章读取工具：`getAllNotes`、`getNoteBySlug`、`getAllSlugs` |

### 组件层

| 文件                                                | 职责                                       |
| --------------------------------------------------- | ------------------------------------------ |
| `src/components/notes-page/NotesPage.tsx`           | 文章列表组件（Server Component）           |
| `src/components/notes-page/NotesPage.module.scss`   | 列表页样式                                 |
| `src/components/note-detail/NoteDetail.tsx`         | 文章详情组件（Server Component）           |
| `src/components/note-detail/NoteDetail.module.scss` | 文章排版样式（标题、代码块、表格、引用等） |

### 内容层

| 文件                                  | 职责         |
| ------------------------------------- | ------------ |
| `src/content/notes/hello-world.md`    | 中文示例文章 |
| `src/content/notes/design-system.md`  | 中文示例文章 |
| `src/content/notes/en/hello-world.md` | 英文示例文章 |

## 3.3 修改文件

| 文件                                     | 改动说明                                                                     |
| ---------------------------------------- | ---------------------------------------------------------------------------- |
| `src/app/(zh)/notes/page.tsx`            | 替换 `RoutePlaceholderPage` 为 `<NotesPage locale="zh-CN" />`                |
| `src/app/(zh)/notes/[docId]/page.tsx`    | 使用 `getAllSlugs` 生成静态参数，`getNoteBySlug` 获取文章，动态生成 metadata |
| `src/app/(en)/en/notes/page.tsx`         | 同上，英文版                                                                 |
| `src/app/(en)/en/notes/[docId]/page.tsx` | 同上，英文版                                                                 |

---

# 四、内容目录结构

```
src/content/notes/
├── hello-world.md          # 中文文章
├── design-system.md
└── en/                     # 英文文章（缺失时该文章英文路由不可用）
    └── hello-world.md
```

## Markdown 文件格式

```markdown
---
title: "文章标题"
date: "2026-04-30"
tags: ["标签1", "标签2"]
excerpt: "简短摘要，用于列表展示"
---

正文内容，支持 GFM 语法（表格、代码块、删除线等）。
```

---

# 五、工作流程

```
构建时 / 开发时
    │
    ├─ fs.readdirSync 读取 md 文件列表
    │
    ├─ gray-matter 解析 frontmatter → title, date, tags, excerpt
    │
    ├─ markdown-it 渲染 markdown → HTML string
    │
    ├─ getAllNotes() → 列表页展示
    ├─ getNoteBySlug() → 详情页渲染
    └─ getAllSlugs() → generateStaticParams 静态导出
```

所有读取发生在 Server Component / 构建时，不涉及客户端请求。

---

# 六、与 i18n 的集成

- 中文文章存放在 `src/content/notes/`
- 英文文章存放在 `src/content/notes/en/`
- 两个 locale 各自独立读取对应目录
- 列表组件根据 locale 生成正确的链接前缀（`/notes/` 或 `/en/notes/`）
- 详情页 `generateStaticParams` 按 locale 分别生成参数

---

# 七、后续可扩展方向

- 增加文章分类 / 归档页（按日期或标签分组）
- 添加全文搜索
- 支持 MDX（如需在文章中嵌入 React 组件）
- 添加文章目录（TOC）导航
- 支持文章系列 / 上一篇 / 下一篇导航
