# SEO 增强记录

这份文档用于记录当前项目这一轮 SEO 增强实际做了什么、为什么这么做、改动落在哪里，以及后续还可以继续补哪些能力。

这不是泛泛的 SEO 教程，而是针对当前项目这次真实改动的说明。

---

# 一、背景

在这轮增强之前，项目已经具备基础的页面级 `title` 和 `description`，但整体上仍然偏“能用”，还没有把技术 SEO 基础设施补齐。

当时主要缺少这些能力：

- 全站统一的 `metadataBase`
- 明确的 `robots` 配置出口
- `sitemap.xml`
- 中英文页面统一的 canonical / hreflang 表达
- 完整的 Open Graph / Twitter metadata
- 结构化数据（JSON-LD）
- 某些页面因为是 client page，不适合直接承担 metadata 导出职责

也就是说，页面并不是完全没有 SEO，而是：

> 页面级基础 metadata 已经有了，但站点级与多语言相关的技术 SEO 设施还不完整。

---

# 二、本次改动目标

这次增强的目标不是做内容运营层面的 SEO，而是先把站点的技术 SEO 基础补齐。

具体目标包括：

- 补齐全站统一 metadata 基础配置
- 为搜索引擎提供 `robots.txt` 与 `sitemap.xml`
- 为中英文页面建立稳定的 canonical 与 hreflang 关系
- 为社交分享补齐 Open Graph 与 Twitter metadata
- 增加基础结构化数据，帮助搜索引擎理解站点身份
- 在不大改页面主体渲染逻辑的前提下，让路由页 metadata 更统一、可维护

这次改动的边界也比较明确：

- 做技术 SEO 基础设施
- 不展开做关键词运营策略
- 不批量重写页面文案
- 不引入额外分析脚本、埋点或第三方网络调用

---

# 三、本次具体增强

## 1. 增强全站默认 metadata

核心文件：

- `F:/yuweb/src/app/layout.tsx`

这次在根 layout 里补齐了站点级 metadata，主要包括：

- `metadataBase`
- `robots`
- `openGraph`
- `twitter`
- `authors`
- `creator`
- `publisher`
- `alternates.languages`

这一步的意义是：

- 给整个站点提供统一的默认 SEO 基线
- 让页面级 metadata 可以在这个基础上做覆盖，而不是每个页面各写各的
- 让 canonical、语言版本关系、分享信息有统一来源

可以把它理解成：

> `layout.tsx` 不再只是默认 title / description 的兜底层，而是升级成了全站 SEO 基础配置层。

---

## 2. 增加结构化数据 JSON-LD

核心文件：

- `F:/yuweb/src/app/layout.tsx`

这次还在 layout 中增加了基础 JSON-LD 结构化数据，用来描述站点与作者身份。

当前主要覆盖：

- `WebSite`
- `Person`

这样做的目的不是立刻追求富结果展示，而是先让搜索引擎更明确地理解：

- 这个站点是什么
- 站点归属谁
- 站点与作者的关系是什么

---

## 3. 新增 `robots.txt` 生成入口

新增文件：

- `F:/yuweb/src/app/robots.ts`

这个文件用于通过 Next.js App Router 的约定式路由输出 `robots.txt`。

这样做的好处是：

- 搜索引擎爬虫可以直接读取站点抓取规则
- 站点级 robots 配置不再分散在静态文件和 metadata 之间
- 后续如果需要精细化规则，可以继续集中维护

---

## 4. 新增 `sitemap.xml` 生成入口

新增文件：

- `F:/yuweb/src/app/sitemap.ts`

这个文件用于生成站点 sitemap。

当前它的主要作用是：

- 把首页与主要路由暴露给搜索引擎
- 把中英文版本都纳入 sitemap
- 给搜索引擎提供更明确的页面发现入口

对于一个采用 App Router、同时有多语言路径的站点来说，这一步非常关键。

---

## 5. 抽出页面级 SEO helper

新增文件：

- `F:/yuweb/src/lib/seo/metadata.ts`
- `F:/yuweb/src/lib/seo/test/metadata.test.ts`

这次没有把所有路由页的 metadata 逻辑继续散落在各个 `page.tsx` 里，而是抽出了一层专门的 SEO helper。

这层 helper 的价值在于：

- 统一生成页面 metadata
- 统一处理 canonical
- 统一处理中英文 alternates / hreflang
- 统一生成 Open Graph / Twitter 元数据
- 避免中文页和英文页各写一套近似逻辑

同时还补了测试，确保基础 metadata 组装逻辑可回归验证。

---

## 6. 为首页、404 与各主要中英文页面补齐 metadata

本次改动涉及的页面包括：

- `F:/yuweb/src/app/page.tsx`
- `F:/yuweb/src/app/not-found.tsx`
- `F:/yuweb/src/app/about/page.tsx`
- `F:/yuweb/src/app/blog/page.tsx`
- `F:/yuweb/src/app/collections/page.tsx`
- `F:/yuweb/src/app/curations/page.tsx`
- `F:/yuweb/src/app/journey/page.tsx`
- `F:/yuweb/src/app/notes/page.tsx`
- `F:/yuweb/src/app/projects/page.tsx`
- `F:/yuweb/src/app/stack/page.tsx`
- `F:/yuweb/src/app/en/page.tsx`
- `F:/yuweb/src/app/en/about/page.tsx`
- `F:/yuweb/src/app/en/blog/page.tsx`
- `F:/yuweb/src/app/en/collections/page.tsx`
- `F:/yuweb/src/app/en/curations/page.tsx`
- `F:/yuweb/src/app/en/journey/page.tsx`
- `F:/yuweb/src/app/en/notes/page.tsx`
- `F:/yuweb/src/app/en/projects/page.tsx`
- `F:/yuweb/src/app/en/stack/page.tsx`

这些页面在这轮增强中，主要补齐了：

- canonical
- hreflang alternates
- 基础 Open Graph 信息
- 基础 Twitter metadata
- 与当前路由内容对应的 title / description 输出

这样做之后：

- 中文页和英文页之间的关系更清晰
- 搜索引擎更容易识别哪个页面是当前语言版本的规范地址
- 社交平台抓取页面时能拿到更稳定的预览信息

---

## 7. 为 404 页面设置更合理的索引策略

核心文件：

- `F:/yuweb/src/app/not-found.tsx`

404 页虽然也是路由的一部分，但通常不应该参与正常索引。

因此，这次也把 404 页面纳入统一 SEO 处理，避免异常路径被错误地当成正常内容页对待。

这一步的重点不在于提升排名，而在于：

> 减少错误页面进入索引的概率。

---

## 8. 重构 About 页导出 metadata 的方式

相关文件：

- `F:/yuweb/src/app/about/page.tsx`
- `F:/yuweb/src/components/about-page/AboutPage.tsx`

这次 SEO 增强里一个比较实际的问题是：

- 中文 About 页原本是一个 client page
- client page 不适合作为页面级 metadata 的承载点

所以这次做了一个小范围结构调整：

- 把 `AboutPage` 主体拆到组件层
- 让 `src/app/about/page.tsx` 变成更薄的 server wrapper
- 由页面入口负责 metadata，组件负责真正渲染

这个调整不是为了重构而重构，而是为了满足 App Router 下更合理的 metadata 组织方式。

---

# 四、关键文件说明

这次 SEO 增强最关键的文件可以按职责分成四类。

## 1. 全站 SEO 基础入口

- `F:/yuweb/src/app/layout.tsx`

负责：

- 全站默认 metadata
- 站点级 Open Graph / Twitter / robots
- 语言 alternates
- JSON-LD 结构化数据注入

## 2. 爬虫入口

- `F:/yuweb/src/app/robots.ts`
- `F:/yuweb/src/app/sitemap.ts`

负责：

- 输出 `robots.txt`
- 输出 `sitemap.xml`

## 3. 页面级 SEO 组装逻辑

- `F:/yuweb/src/lib/seo/metadata.ts`
- `F:/yuweb/src/lib/seo/test/metadata.test.ts`

负责：

- 封装 metadata 构建逻辑
- 统一 canonical / hreflang / OG / Twitter 输出
- 为这层逻辑提供测试保障

## 4. 页面与组件结构配合

- `F:/yuweb/src/app/about/page.tsx`
- `F:/yuweb/src/components/about-page/AboutPage.tsx`

负责：

- 解决 client page 不便导出 metadata 的问题
- 让页面入口与页面渲染职责更清晰

---

# 五、这轮增强带来的直接收益

## 1. 搜索引擎更容易识别站点主域与页面规范地址

有了 `metadataBase`、canonical 以及更统一的 metadata 生成方式之后，页面的规范地址表达更明确了。

这能减少：

- 相似路径被当成不同页面理解
- 多语言页面互相抢 canonical 信号
- 页面级元信息表达不一致

## 2. 中英文页面关系更清晰

通过 alternates / hreflang 的统一输出，中文默认路径和英文 `/en` 路径之间的关系变得更明确。

这对多语言站点尤其重要，因为搜索引擎需要知道：

- 哪些页面互为不同语言版本
- 默认语言页面是谁
- 英文页面是谁

## 3. 搜索引擎可以直接读取抓取入口

`robots.txt` 和 `sitemap.xml` 补齐之后，爬虫拿到页面列表和抓取策略会更直接。

这意味着：

- 新页面更容易被发现
- 站点结构更容易被理解
- SEO 基础设施更完整

## 4. 社交分享预览更稳定

补齐 Open Graph 和 Twitter metadata 后，页面被分享到社交平台时，标题、描述、站点身份等基础信息会更稳定。

虽然这不完全等同于搜索排名，但它确实影响：

- 页面在外部传播时的展示质量
- 链接点击意愿
- 页面信息的一致性

## 5. 404 页面更不容易被错误索引

把 404 页纳入 SEO 管理后，可以降低异常页面参与索引的概率。

## 6. 后续继续扩展更容易

因为这次已经把 SEO 逻辑集中到了 helper 和站点级配置层，后续如果要继续加：

- 文章页 schema
- OG 图片
- 更细的 robots 规则
- Search Console 验证
- 发布日期 / 更新时间 metadata

整体成本都会比每个页面临时拼一份 metadata 更低。

---

# 六、已验证项

## 1. 项目检查通过

已执行：

```powershell
pnpm check
```

结果：通过。

## 2. SEO helper 补了测试

新增测试文件：

- `F:/yuweb/src/lib/seo/test/metadata.test.ts`

这意味着页面级 metadata 的核心拼装逻辑，不完全依赖人工肉眼检查，而是有基础自动化回归保障。

---

# 七、这次没有覆盖的部分

虽然这次已经把技术 SEO 的基础设施补齐了一大块，但仍然有一些内容还没有展开。

当前还没有重点处理的部分包括：

- 真实页面的专属 OG 图片资产
- 更细的关键词策略与页面文案优化
- 博客 / 笔记 / 项目等内容页的细粒度 schema
- Breadcrumb 结构化数据
- 搜索引擎站长平台验证
- 内容更新时间、发布日期、作者字段的更细化输出

也就是说，这次更像是：

> 先把地基打牢，再考虑更细的内容 SEO 和展示增强。

---

# 八、后续建议

如果后面要继续增强 SEO，建议按下面顺序推进。

## 1. 补 OG 图片

建议优先为这些页面补上稳定的社交分享图：

- 首页
- About
- Blog
- Projects
- Notes

## 2. 为内容页增加更细的结构化数据

例如：

- `Article`
- `BlogPosting`
- `CollectionPage`
- `BreadcrumbList`

这会比当前的 `WebSite` / `Person` 更贴近具体页面内容。

## 3. 为真实内容补发布时间与更新时间

如果后面博客、笔记、项目页开始有真实内容数据，建议把这些字段继续补齐到页面 metadata 与结构化数据里：

- `publishedTime`
- `modifiedTime`
- `authors`

## 4. 接入站长平台验证

建议后续补：

- Google Search Console
- Bing Webmaster Tools

这样可以更直接观察：

- 页面收录情况
- sitemap 提交结果
- canonical 判断情况
- 多语言页面索引表现

## 5. 持续收敛 metadata 配置方式

当前已经有 `F:/yuweb/src/lib/seo/metadata.ts` 这层 helper，后续新增页面时，建议继续复用这套方式，不要重新回到每个页面自己散写一套 metadata 的模式。

这样能保持：

- 结构统一
- 行为一致
- 后续维护成本更低

---

# 九、一句话总结

这次 SEO 增强的核心成果是：

> 把当前项目从“只有基础 title / description 的页面级 SEO”，提升到了“具备全站 metadata、robots、sitemap、多语言 canonical / hreflang、社交分享 metadata 与基础结构化数据”的技术 SEO 基础状态。

对当前项目来说，这一步最重要的价值不是立刻追求搜索流量增长，而是：

- 先把站点的 SEO 基础设施补齐
- 先把多语言页面关系表达清楚
- 先把后续继续扩展 SEO 的结构打稳
