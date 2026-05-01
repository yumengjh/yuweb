# 远程文档集成方案

## 概述

将知识库后端（InfiniteDoc）的远程文档与本地 Markdown 静态笔记合并显示，在笔记列表页混合展示两种来源的文档。

- **本地文档**：`src/content/notes/*.md`，构建时渲染为静态 HTML
- **远程文档**：后端 API 的 block 树结构，运行时 CSR 获取并渲染
- **渲染引擎**：Next.js 16 SSG（`output: "export"`），不做 SSR
- **后端地址**：`https://api-zzz.yumgjs.com/`
- **认证方式**：JWT，客户端直连后端 API，凭证通过 `NEXT_PUBLIC_*` 环境变量注入

---

## 架构总览

```
浏览器
  │
  ├── 访问 /notes/（列表页）
  │   ├── Server Component (page.tsx) ──→ 读取本地 .md 文件 → 传入 staticNotes
  │   └── Client Component (NotesPage.tsx)
  │       ├── 接收 staticNotes 渲染本地文档卡片（<Link> 跳转）
  │       ├── useRemoteNotes() hook ──→ GET /api/v1/documents → 过滤 → 渲染远程卡片（<a href="#docId">）
  │       └── hashchange 监听 → 有 #docId → 渲染 RemoteNoteView
  │
  ├── 访问 /notes/hello-world/（本地详情）
  │   └── Server Component → getNoteBySlug() → NoteDetail（构建时已预渲染为静态 HTML）
  │
  └── 点击远程文档卡片 → URL 变为 /notes/#doc_xxx
      └── RemoteNoteView 客户端组件
          ├── GET /api/v1/documents/:docId（元数据）
          ├── GET /api/v1/documents/:docId/content（block 树）
          ├── blockTreeToHtml() 转换 → HTML 字符串
          └── dangerouslySetInnerHTML 渲染
```

### 关键设计决策

| 决策 | 方案 | 原因 |
|------|------|------|
| 远程文档路由 | Hash 路由 `/notes/#docId` | `output: "export"` 下无法为运行时才知晓的路径生成静态 HTML |
| 认证方式 | 客户端 JWT 直连 | 保持 SSG，不做服务端代理 |
| 内容渲染 | Block 树 → markdown-it 渲染 | 后端 text 字段包含原始 markdown 语法 |
| 文档过滤 | `visibility === "public" && publishedHead > 0` | 只显示已发布的公开文档 |

---

## 文件结构

```
src/
├── lib/
│   ├── api/
│   │   ├── client.ts              # API 客户端（JWT 认证 + 文档接口）
│   │   └── block-to-html.ts       # Block 树 → HTML 转换器
│   └── notes/
│       ├── types.ts               # 类型定义（新增 UnifiedNoteMeta）
│       ├── content.ts             # 本地 Markdown 加载（未改动）
│       └── highlight.ts           # Shiki 渲染器（未改动）
├── components/
│   └── notes-page/
│       ├── NotesPage.tsx           # 列表页（客户端组件，合并展示）
│       ├── NotesPage.module.scss   # 列表页样式
│       ├── useRemoteNotes.ts       # 远程笔记列表 hook
│       ├── RemoteNoteView.tsx      # 远程文档详情组件
│       └── RemoteNoteView.module.scss  # 远程文档详情样式
├── app/
│   ├── (zh)/notes/page.tsx        # 中文列表页（传入 staticNotes）
│   └── (en)/en/notes/page.tsx     # 英文列表页（传入 staticNotes）
└── .env                           # 环境变量（API 地址、凭证、workspace ID）
```

---

## 模块详解

### 1. 环境变量 `.env`

```env
NEXT_PUBLIC_WORKSPACE_ID=ws_1777597341536_714ae45b
NEXT_PUBLIC_API_BASE_URL=https://api-zzz.yumgjs.com
NEXT_PUBLIC_API_USERNAME=john_doe
NEXT_PUBLIC_API_PASSWORD=SecurePass123!
NEXT_PUBLIC_SHOW_DOC_DEBUG_META=false
```

- `NEXT_PUBLIC_` 前缀使变量在客户端 bundle 中可用
- `WORKSPACE_ID`：后端工作空间 ID，用于文档列表查询
- `API_USERNAME` / `API_PASSWORD`：预注册的只读账号凭证
- 后端后续将支持根据请求来源（origin）自动鉴权，届时可移除凭证

---

### 2. API 客户端 `src/lib/api/client.ts`

#### 认证流程

```
首次请求
  → getAccessToken() 发现 tokenCache 为空
  → apiLogin() 用用户名密码登录
  → 缓存 accessToken + refreshToken，过期时间 23 小时
  → 返回 accessToken

Token 过期（> 23 小时）
  → getAccessToken() 发现已过期
  → apiLogin() 重新登录
  → 更新缓存

请求返回 401
  → apiRefresh() 用 refreshToken 刷新
  → 刷新失败则 apiLogin() 重新登录
  → 重试原请求
```

#### 核心函数

```typescript
// 通用请求方法，自动附加 JWT token，401 时自动刷新重试
apiFetch<T>(path: string, options?: RequestInit): Promise<T>

// 获取文档列表（分页，按更新时间倒序）
fetchDocuments(workspaceId?: string): Promise<ApiDocListResponse>

// 获取单个文档元数据
fetchDocument(docId: string): Promise<ApiDocument>

// 获取文档内容（block 树，limit=10000 全量返回）
fetchDocumentContent(docId: string): Promise<ApiContentResponse>
```

#### API 响应格式

所有后端 API 统一返回：

```json
{
  "success": true,
  "data": { ... }
}
```

`apiFetch` 自动解包 `.data`，调用方直接获得 data 内容。

#### 类型定义

```typescript
// 文档元数据
interface ApiDocument {
  docId: string;
  title: string;
  icon: string;            // emoji 图标
  status: string;          // "draft" | "normal" | "archived"
  visibility: string;      // "private" | "workspace" | "public"
  publishedHead: number;   // > 0 表示已发布
  createdAt: string;       // ISO 8601
  updatedAt: string;
  category: string;
  tags: string[];
  // ... 其他字段
}

// Block 节点（递归树结构）
interface ApiBlockNode {
  blockId: string;
  type: string;            // "root" | "paragraph" | "heading" | "list" | "code" | ...
  payload: Record<string, unknown>;
  parentId: string;
  sortKey: string;
  indent: number;
  collapsed: boolean;
  children: ApiBlockNode[];
}

// 文档内容响应
interface ApiContentResponse {
  docId: string;
  docVer: number;
  title: string;
  tree: ApiBlockNode;      // 根 block，递归包含所有子 block
  pagination: { ... };
}
```

---

### 3. Block 树 → HTML 转换器 `src/lib/api/block-to-html.ts`

#### 后端 Block 结构

后端使用 block 树存储文档内容。每个 block 有 `type` 和 `payload`，通过 `children` 形成树结构。

实际 API 返回示例：

```json
{
  "blockId": "b_1777597357827_78f89c27",
  "type": "root",
  "payload": { "type": "root", "children": [] },
  "children": [
    {
      "type": "paragraph",
      "payload": { "text": "你好，我是鱼" },
      "children": []
    },
    {
      "type": "paragraph",
      "payload": { "text": "# 文档 API" },
      "children": []
    },
    {
      "type": "paragraph",
      "payload": { "text": "支持 `@SitePublic()` 开放访问" },
      "children": []
    }
  ]
}
```

#### Block 类型映射

| Block 类型 | payload 字段 | HTML 输出 | 说明 |
|-----------|-------------|----------|------|
| `root` | `{ text: "" }` | 递归 children | 根节点，不产生 HTML 标签 |
| `heading` | `{ text, level }` | `<h1>`-`<h6>` | level 1-6 |
| `paragraph` | `{ text }` | `<p>` | 检测 `#` 语法，自动提升为标题 |
| `list` | `{ type, items }` | `<ol>`/`<ul>` | type: "ordered"/"unordered" |
| `code` | `{ text, language? }` | `<pre><code>` | 代码块，不解析 markdown |
| `quote` | `{ text }` | `<blockquote>` | 引用块 |
| `image` | `{ url, caption? }` | `<img>` | 图片 |
| `divider` | `{}` | `<hr>` | 分割线 |

#### Markdown 渲染

后端 block 的 `payload.text` 包含**原始 markdown 语法**（如 `**粗体**`、`` `代码` ``、`# 标题`），不是纯文本。转换器使用 `markdown-it` 的 `renderInline()` 渲染：

```
输入: "支持 `@SitePublic()` 开放**匿名**访问"
输出: "支持 <code>@SitePublic()</code> 开放<strong>匿名</strong>访问"
```

#### 标题检测

后端有时将标题存储为 `type: "paragraph"` + `text: "# 标题"`。转换器通过 `extractHeading()` 检测并提升为 `<h1>`-`<h6>`：

```typescript
// text: "## 站点公开访问说明"
// → 检测为 heading level 2
// → 输出: <h2>站点公开访问说明</h2>
```

#### 转换入口

```typescript
blockTreeToHtml(tree: ApiBlockNode): string
  → renderBlock(rootNode)
    → 递归处理 children
    → 每个节点根据 type 分发到对应渲染函数
    → 返回完整 HTML 字符串
```

---

### 4. 类型定义 `src/lib/notes/types.ts`

```typescript
// 原有类型（未改动）
interface NoteMeta {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
}

interface NoteDoc extends NoteMeta {
  content: string;  // 渲染后的 HTML
}

// 新增类型
type NoteSource = "local" | "remote";

interface UnifiedNoteMeta {
  slug: string;           // 本地: 文件名（如 "hello-world"）; 远程: docId（如 "doc_xxx"）
  title: string;
  date: string;           // YYYY-MM-DD 格式
  tags: string[];
  excerpt: string;
  source: NoteSource;     // 来源标识
  icon?: string;          // 远程文档的 emoji 图标
}
```

---

### 5. 远程笔记列表 Hook `src/components/notes-page/useRemoteNotes.ts`

```typescript
useRemoteNotes() → { remoteNotes: UnifiedNoteMeta[], loading: boolean, error: string | null }
```

执行流程：

1. 组件挂载时触发 `useEffect`
2. 调用 `fetchDocuments(WORKSPACE_ID)` 获取文档列表
3. 过滤：`visibility === "public" && publishedHead > 0`
4. 转换为 `UnifiedNoteMeta[]` 格式
5. 更新状态，组件重新渲染

取消机制：`cancelled` 标志防止组件卸载后设置状态。

---

### 6. 远程文档详情组件 `src/components/notes-page/RemoteNoteView.tsx`

```typescript
<RemoteNoteView docId="doc_xxx" locale="zh-CN" onBack={() => {}} />
```

三种状态：

| 状态 | 显示内容 |
|------|---------|
| Loading | 骨架屏（skeleton pulse 动画） |
| Error | 错误信息 + 返回按钮 |
| Loaded | 返回按钮 + 文章标题 + 日期 + 渲染内容 |

加载流程：

```typescript
useEffect(() => {
  // 并行请求元数据和内容
  const [meta, content] = await Promise.all([
    fetchDocument(docId),
    fetchDocumentContent(docId),
  ]);
  // block 树 → HTML
  const html = blockTreeToHtml(content.tree);
  // 构造 NoteDoc 形状
  setNote({ slug, title, date, tags, excerpt, content: html });
}, [docId]);
```

样式复用：`RemoteNoteView.module.scss` 的 `.content` 类包含完整的排版样式（标题、段落、代码块、列表、引用、表格、图片等），与 `NoteDetail.module.scss` 一致。

---

### 7. 笔记列表页 `src/components/notes-page/NotesPage.tsx`

#### 数据流

```
page.tsx (Server Component)
  → getAllNotes("zh-CN") 获取本地笔记
  → <NotesPage staticNotes={...} locale="zh-CN" />

NotesPage.tsx (Client Component)
  → 接收 staticNotes
  → useRemoteNotes() 获取远程笔记
  → 合并 + 按日期排序
  → 渲染统一列表
```

#### Hash 路由

远程文档使用 hash 路由，因为 `output: "export"` 无法为动态路径生成 HTML 文件：

- 列表页 URL：`/notes/`
- 远程文档 URL：`/notes/#doc_1777597357827_30355bc1`
- 本地文档 URL：`/notes/hello-world/`（Next.js 静态路由）

实现：

```typescript
// 监听 hash 变化
useEffect(() => {
  function onHashChange() {
    const hash = window.location.hash.slice(1);
    setActiveRemoteId(hash || null);
  }
  onHashChange();  // 检查初始 hash
  window.addEventListener("hashchange", onHashChange);
  return () => window.removeEventListener("hashchange", onHashChange);
}, []);

// 有 hash → 渲染远程文档详情
// 无 hash → 渲染列表
```

#### 列表渲染

```typescript
// 本地文档卡片：<Link> 跳转到 /notes/slug/
// 远程文档卡片：<a href="#docId"> 触发 hash 变化
{allNotes.map((note) => (
  <li key={`${note.source}-${note.slug}`}>
    {note.source === "local" ? (
      <Link href={`${localePrefix}/notes/${note.slug}/`}>...</Link>
    ) : (
      <a href={`#${note.slug}`}>...</a>
    )}
  </li>
))}
```

Key 使用 `${source}-${slug}` 防止本地和远程 slug 冲突。

---

### 8. 页面入口 `src/app/(zh)/notes/page.tsx`

```typescript
export default async function ZhNotesPage() {
  const staticNotes = await getAllNotes("zh-CN");  // 构建时读取本地 .md 文件
  return <NotesPage staticNotes={staticNotes} locale="zh-CN" />;
}
```

- Server Component，构建时执行
- 调用 `getAllNotes()` 读取本地 Markdown 文件
- 将结果作为 props 传给客户端组件 `NotesPage`
- `metadata` 由 `buildRouteMetadata()` 生成（SEO 不变）

英文版 `src/app/(en)/en/notes/page.tsx` 结构相同，使用 `locale="en-US"`。

---

## 数据转换完整流程

以一篇包含标题、段落和代码块的远程文档为例：

### 后端 Block 树

```json
{
  "type": "root",
  "children": [
    { "type": "paragraph", "payload": { "text": "# 项目介绍" } },
    { "type": "paragraph", "payload": { "text": "这是一个**知识库**管理系统" } },
    { "type": "code", "payload": { "text": "console.log('hello')", "language": "javascript" } },
    { "type": "list", "payload": { "type": "unordered", "items": [
      { "text": "支持 `markdown` 格式" },
      { "text": "支持**嵌套**列表" }
    ]}}
  ]
}
```

### 转换过程

```
blockTreeToHtml(root)
  ├─ renderBlock(paragraph "# 项目介绍")
  │   └─ extractHeading() → level=1, text="项目介绍"
  │   └─ <h1>项目介绍</h1>
  │
  ├─ renderBlock(paragraph "这是一个**知识库**管理系统")
  │   └─ renderInlineMd("这是一个**知识库**管理系统")
  │   └─ <p>这是一个<strong>知识库</strong>管理系统</p>
  │
  ├─ renderBlock(code "console.log('hello')")
  │   └─ <pre><code class="language-javascript">console.log('hello')</code></pre>
  │
  └─ renderBlock(list)
      ├─ renderListItem("支持 `markdown` 格式")
      │   └─ <li>支持 <code>markdown</code> 格式</li>
      └─ renderListItem("支持**嵌套**列表")
          └─ <li>支持<strong>嵌套</strong>列表</li>
      └─ <ul><li>...</li><li>...</li></ul>
```

### 最终 HTML

```html
<h1>项目介绍</h1>
<p>这是一个<strong>知识库</strong>管理系统</p>
<pre><code class="language-javascript">console.log('hello')</code></pre>
<ul>
  <li>支持 <code>markdown</code> 格式</li>
  <li>支持<strong>嵌套</strong>列表</li>
</ul>
```

---

## 未改动的文件

以下文件未做任何修改：

| 文件 | 说明 |
|------|------|
| `next.config.ts` | 保持 `output: "export"` |
| `src/lib/notes/content.ts` | 本地 Markdown 加载逻辑不变 |
| `src/lib/notes/highlight.ts` | Shiki 语法高亮不变 |
| `src/components/note-detail/NoteDetail.tsx` | 本地文档详情组件不变 |
| `src/app/(zh)/notes/[docId]/page.tsx` | 本地文档详情页不变（SSG 预渲染） |
| `src/app/(en)/en/notes/[docId]/page.tsx` | 英文版同上 |

---

## SSR 迁移路径

后续切换 SSR 时需修改：

1. `next.config.ts`：移除 `output: "export"`
2. `[docId]/page.tsx`：添加 `dynamicParams = true`，允许未知 docId 通过
3. 页面组件：静态文档走 Server Component，远程文档可直接服务端调用 API（不走浏览器）
4. 路由：将 hash 路由 `/notes/#docId` 改为正常路由 `/notes/docId/`
5. `generateMetadata`：可服务端获取远程文档标题，优化 SEO
6. 认证：凭证不再需要 `NEXT_PUBLIC_` 前缀，仅服务端使用
