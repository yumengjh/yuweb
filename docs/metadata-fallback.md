# Metadata 继承、覆盖与回退说明

这份文档专门说明当前项目中：

- 全站默认 metadata 在哪里定义
- 页面自己的 metadata 在哪里定义
- 为什么首页显示的不是 layout 里的默认 title
- 哪些情况下会发生回退（fallback）
- 当前这套设计为什么适合 SEO 控制

这不是泛泛的 Next.js metadata 教程，而是针对当前项目真实结构的说明。

---

# 一、当前项目里的 metadata 分成两层

当前项目中，metadata 主要分成两层：

## 1. 全站默认 metadata

文件：

- `src/app/layout.tsx`

当前写法大致是：

```ts
export const metadata: Metadata = {
  title: t(siteConfig.identity.name),
  description: t(siteConfig.identity.description),
};
```

这里的含义不是“所有页面永远都显示这两个值”，而是：

> **这是整个站点的默认 metadata。**

也可以理解为：

- 全站基础 title
- 全站基础 description
- 当某个页面没有自己定义 metadata 时的回退值

---

## 2. 路由级 metadata

例如首页文件：

- `src/app/page.tsx`

当前写法大致是：

```ts
export const metadata: Metadata = {
  title: t(siteConfig.homePage.metadata.title),
  description: t(siteConfig.homePage.metadata.description),
};
```

这说明：首页自己定义了一套更具体的 metadata。

所以首页最终显示的 title / description，不会继续使用 layout 里的默认值，而会优先使用它自己的值。

---

# 二、为什么 layout 里是“鱼梦江湖”，但首页显示的是“鱼梦江湖(@yumengjh)”

这是因为：

- `layout.tsx` 里定义的是默认 metadata
- `page.tsx` 里定义的是首页自己的 metadata
- 在 Next.js App Router 中，**离页面更近的 metadata 会覆盖父级同名字段**

所以你看到的是：首页自己的 metadata 生效了。

也就是说，当前项目里这两层实际是这样的关系：

## 默认层

来自：

- `siteConfig.identity.name`
- `siteConfig.identity.description`

用途：

- 给整个站点提供基础默认值
- 给没有单独配置 metadata 的页面兜底

## 页面层

来自：

- `siteConfig.homePage.metadata.title`
- `siteConfig.homePage.metadata.description`

用途：

- 给首页提供更具体的 SEO 信息
- 覆盖 layout 默认值

---

# 三、当前项目里这套设计的实际语义

## 1. `siteConfig.identity.*`

建议理解成：

- 网站身份信息
- 全站默认品牌信息
- metadata fallback 的默认来源

例如：

- 网站名
- 默认简介

这层更像“站点级默认值”。

---

## 2. `siteConfig.homePage.metadata.*`

建议理解成：

- 首页自己的 SEO title
- 首页自己的 SEO description

也就是说，它不是为了替代全站默认信息，而是为了给首页提供一套更明确的搜索展示信息。

---

## 3. `siteConfig.routeMeta.*`

当前项目中，其他页面也有自己的路由级 metadata 配置，例如：

- `routeMeta.about`
- `routeMeta.stack`
- `routeMeta.curations`
- `routeMeta.journey`
- `routeMeta.blog`
- 等等

这层的意义是：

> **每个路由都可以有自己单独的 title 和 description。**

这正是更细粒度 SEO 控制所需要的能力。

---

# 四、回退（fallback）是怎么发生的

当前可以这样理解：

## 情况 A：页面自己定义了 metadata

例如首页：

- `src/app/page.tsx`

它自己写了：

```ts
export const metadata = {
  title: ...,
  description: ...,
};
```

那么最终以页面自己的为准。

### 结果

- 使用页面自己的 title
- 使用页面自己的 description
- layout 里的默认值被同名字段覆盖

---

## 情况 B：页面没有定义 metadata

如果某个页面没有自己的：

```ts
export const metadata = ...
```

那它就会使用 layout 里的默认 metadata。

### 结果

会回退到：

- `siteConfig.identity.name`
- `siteConfig.identity.description`

所以你现在的理解是对的：

> **如果以后某个页面没有单独配置 title / description，它就会回退到 layout 里的默认信息。**

---

# 五、为什么这种设计是合理的

这套设计其实是比较适合站点 SEO 的。

## 1. 默认值兜底

站点不会因为某个页面漏配 metadata，就完全没有 title / description。

也就是说：

- 有默认值
- 不容易出现空 metadata
- 降低漏配风险

---

## 2. 页面可以单独控制 SEO

每个页面都可以有更适合自己内容的标题与描述。

例如：

- 首页强调站点整体定位
- 关于页强调个人介绍与站点背景
- 技术栈页强调技术方向与工程实践
- 博客页强调文章内容与主题方向

这会比所有页面统一显示“鱼梦江湖”更适合搜索展示。

---

## 3. 语义更清晰

当前这套结构可以这样记：

- `identity.*` = 全站默认
- `homePage.metadata.*` = 首页专属
- `routeMeta.*` = 路由专属

这三层职责不一样，所以共存是合理的。

---

# 六、当前项目里的推荐使用方式

## 1. layout.tsx 负责默认 metadata

文件：

- `src/app/layout.tsx`

这里继续放：

- 默认 title
- 默认 description

例如：

```ts
export const metadata: Metadata = {
  title: t(siteConfig.identity.name),
  description: t(siteConfig.identity.description),
};
```

这层不要塞太细的页面语义，它的职责是“默认兜底”。

---

## 2. page.tsx 负责页面自己的 metadata

例如首页：

- `src/app/page.tsx`

继续放自己的：

```ts
export const metadata: Metadata = {
  title: t(siteConfig.homePage.metadata.title),
  description: t(siteConfig.homePage.metadata.description),
};
```

例如其它页：

- `about`
- `stack`
- `curations`
- `journey`
- `blog`

则使用对应的 `routeMeta.*`。

---

## 3. 如果页面暂时没有单独 metadata，可以先不写

那它自然会回退到 layout 默认值。

这对当前项目很实用，因为：

- 并不是所有页面都必须立刻做完整 SEO 配置
- 可以先保证全站有默认 metadata
- 后续再逐页补精细化 title / description

---

# 七、当前项目里的一个简单判断原则

以后如果你在写某个页面，可以这样判断：

## 这个页面是不是需要自己的 SEO 标题和描述？

### 如果需要

就给这个页面单独写 metadata。

### 如果暂时不需要

那就先不写，让它回退到 layout 默认 metadata。

这个策略既不会让你一开始配置过重，也不会让页面完全裸奔。

---

# 八、一句话总结

当前项目里：

> **`layout.tsx` 提供全站默认 metadata，页面自己的 `page.tsx` metadata 会覆盖默认值；如果页面没有单独配置，就会自动回退到默认 metadata。**

因此，当前这套设计完全可以支持：

- 默认站点信息兜底
- 每个路由单独控制 title / description
- 更灵活地做 SEO
