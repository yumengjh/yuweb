# 项目结构与架构说明

这份文档用于说明当前项目的整体结构、设计思路、主要模块职责，以及多语言、测试和后续维护约定。

适用场景：

- 新接手项目时快速了解结构
- 后续做大重构时先确认边界
- 新增页面、组件、多语言时查目录与分层约定
- 避免继续把类型、数据、逻辑、测试全部堆进一个文件

---

# 一、项目定位

当前项目是一个基于 **Next.js App Router** 的个人站点，核心目标不是做成一个“大而全”的业务系统，而是做成一个：

- 可长期维护
- 可逐步扩展
- 结构清晰
- 视觉统一
- 支持多语言
- 对未来从 SSG 迁移到 SSR 也有准备

当前主要内容方向包括：

- 首页
- 关于
- 技术栈
- 精选项目
- 旅程
- 博客
- 笔记
- 项目
- 收藏

其中多语言目前以：

- 中文默认
- 英文 `/en`

为主。

---

# 二、当前目录结构总览

当前 `src` 主要结构如下：

```text
src/
  app/                 # Next.js App Router 页面入口
  components/          # 页面组件与通用组件
  lib/                 # 站点配置、多语言核心、领域级 helper
  locales/             # 多语言 JSON 文案源
  styles/              # SCSS tokens 与样式基础设施
  test/                # 测试运行基础设施（render/setup）
  utils/               # 通用纯函数
```

其中最关键的是四块：

1. `app/`
2. `components/`
3. `lib/`
4. `locales/`

---

# 三、页面层：`src/app/`

`src/app/` 是 Next.js App Router 的页面入口层，主要负责：

- 页面路由
- metadata
- layout
- 全局样式入口
- 不同语言页面的实际文件路径

## 当前页面结构特点

### 1. 中文页面走默认根路径

例如：

- `F:/yuweb/src/app/page.tsx` → `/`
- `F:/yuweb/src/app/about/page.tsx` → `/about`
- `F:/yuweb/src/app/stack/page.tsx` → `/stack`

### 2. 英文页面走 `/en` 前缀目录

例如：

- `F:/yuweb/src/app/en/page.tsx` → `/en`
- `F:/yuweb/src/app/en/about/page.tsx` → `/en/about`
- `F:/yuweb/src/app/en/stack/page.tsx` → `/en/stack`

### 3. 页面文件职责尽量简单

当前页面文件建议只负责三件事：

1. 确定 locale
2. 生成 metadata
3. 渲染页面组件

典型例子：

```ts
import type { Metadata } from "next";

import { HomePage } from "@/components/home-page/HomePage";
import { createTranslator } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";

const t = createTranslator("zh-CN");

export const metadata: Metadata = {
  title: t(siteConfig.homePage.metadata.title),
  description: t(siteConfig.homePage.metadata.description),
};

export default function Page() {
  return <HomePage locale="zh-CN" />;
}
```

也就是说：

> **页面文件尽量薄，不在这里堆业务数据与复杂逻辑。**

---

# 四、组件层：`src/components/`

`src/components/` 是站点 UI 的主体层。

当前可以大致分成三类：

## 1. 页面级组件

例如：

- `F:/yuweb/src/components/home-page/HomePage.tsx`
- `F:/yuweb/src/components/not-found-page/NotFoundPage.tsx`
- `F:/yuweb/src/components/route-placeholder/RoutePlaceholderPage.tsx`

这类组件通常负责一个页面主体区域的渲染。

## 2. 壳层与站点骨架组件

例如：

- `F:/yuweb/src/components/app-shell/AppShell.tsx`
- `F:/yuweb/src/components/top-navigation-bar/TopNavigationBar.tsx`
- `F:/yuweb/src/components/site-footer/SiteFooter.tsx`

这类组件负责：

- 导航
- footer
- 页面外层骨架
- 路由与布局之间的共享结构

## 3. 功能性小组件 / 通用组件

例如：

- `F:/yuweb/src/components/theme-toggle/ThemeToggleButton.tsx`
- `F:/yuweb/src/components/language-toggle/LanguageToggleButton.tsx`
- `F:/yuweb/src/components/common/select-menu/SelectMenu.tsx`
- `F:/yuweb/src/components/tech-counter/TechCounter.tsx`

这类组件主要负责较小的独立交互。

---

## 当前组件组织原则

### 1. 样式就近放

例如：

- `TopNavigationBar.tsx`
- `TopNavigationBar.module.scss`

### 2. 测试放到当前组件目录下的 `test/`

例如：

- `F:/yuweb/src/components/top-navigation-bar/test/TopNavigationBar.test.tsx`
- `F:/yuweb/src/components/site-footer/test/SiteFooter.test.tsx`

### 3. 组件尽量只保留：

- 视图结构
- 必要的状态逻辑
- 少量紧贴视图的 helper

如果一个组件里开始同时出现：

- 大量静态数据
- 一堆类型
- 多个业务 helper
- 多段可复用映射逻辑

那通常就该继续拆。

---

# 五、配置与领域逻辑层：`src/lib/`

`src/lib/` 现在已经不再只是“工具箱”，而是开始承担：

- 站点级配置
- 多语言核心
- 路由匹配与结构 helper
- 类型、数据、逻辑的分层组织

这是当前项目结构里最重要的一层。

---

## 1. `src/lib/i18n/`

这是当前项目的多语言核心目录。

### 当前结构

```text
src/lib/i18n/
  data/
    locale-catalogs.data.ts
  helpers/
    catalog.helpers.ts
    message.helpers.ts
    path.helpers.ts
    token.helpers.ts
  test/
    i18n.test.ts
    i18n-keys.test.ts
  types/
    i18n.types.ts
  index.ts
  keys.ts
  locale-registry.ts
```

### 各部分职责

#### `types/`
放 i18n 的纯类型：

- `MessageToken`
- `MessageParams`
- `NestedMessageCatalog`
- `FlatMessageCatalog`
- `TokenTree`

#### `data/`
放语言注册数据：

- `localeCatalogs`
- `supportedLocales`

#### `helpers/`
放纯逻辑 helper：

- token 构建
- catalog flatten
- message formatting
- 路径与 locale 解析

#### `index.ts`
作为主出口，向业务层提供：

- `createTranslator()`
- `t()`
- `localizeHref()`
- `getLocaleFromPathname()`
- `switchLocalePath()`
- `resolvePreferredLocale()`
- 等等

#### `keys.ts`
提供 token 对象：

- `route`
- `home`
- `nav`
- `footer`
- `language`
- 等

#### `locale-registry.ts`
提供 locale 类型和语言注册信息：

- `SiteLocale`
- `LocaleMode`
- `supportedLocales`
- `getLocaleCatalog()`

---

## 2. 兼容出口仍然保留

为了不让全项目 import 全部瞬间失效，目前还保留了三个兼容出口：

- `F:/yuweb/src/lib/i18n.ts`
- `F:/yuweb/src/lib/i18n-keys.ts`
- `F:/yuweb/src/lib/locale-registry.ts`

它们现在只是很薄的 re-export 文件。

也就是说：

```ts
import { createTranslator } from "@/lib/i18n";
import { route } from "@/lib/i18n-keys";
```

仍然可用。

这让内部结构可以慢慢重构，而不会逼着业务代码一次性全改。

---

## 3. `src/lib/site-config/`

这是站点结构配置层。

### 当前结构

```text
src/lib/site-config/
  data/
    app-routes.data.ts
    site-config.data.ts
  helpers/
    site-config.helpers.ts
  test/
    site-config.test.ts
  types/
    site-config.types.ts
  index.ts
```

### 职责

#### `types/`
放站点配置相关类型，例如：

- `AppRouteId`
- `AppRouteConfig`
- `SiteNavigationItemConfig`
- `SiteFooterMetaItemConfig`

#### `data/`
放静态结构配置，例如：

- `appRoutes`
- `siteConfig`

#### `helpers/`
放 helper，例如：

- `getRouteConfigById()`
- `getRouteConfigByPathname()`
- `matchesDomainRule()`

#### `test/`
放站点配置本身的测试。

---

## 4. `site-config` 的定位

`site-config` 不放最终展示文案，只放：

- 结构
- 行为
- token 引用

比如：

```ts
routeMeta: {
  home: {
    title: route.home.title,
    description: route.home.description,
  },
}
```

也就是说：

- 文案来自 `src/locales/*.json`
- token 来自 `src/lib/i18n/keys.ts`
- 结构来自 `src/lib/site-config/data/site-config.data.ts`

---

# 六、多语言设计

当前项目采用的是：

- **JSON 语言源**
- **token tree**
- **`t(token)` 渲染**
- **默认中文，无前缀**
- **英文 `/en` 前缀**

## 1. 为什么不用裸字符串 key

当前项目不推荐写：

```ts
t("route.home.title")
```

而推荐：

```ts
t(route.home.title)
```

原因是：

- 更不容易写错 key
- 使用时更接近对象访问
- 更利于 IDE 自动补全
- 以后新增字段时更直观

---

## 2. 为什么用 JSON 存文案

因为它更适合：

- 和结构分离
- 后续新增语言
- 对比不同语言字段是否齐全
- 保持文案源统一

当前语言源文件是：

- `F:/yuweb/src/locales/zh-CN.json`
- `F:/yuweb/src/locales/en-US.json`

---

## 3. 缺词策略

当前缺词策略是：

- 开发环境 `console.warn`
- 页面显示：

```ts
The vocabulary was not found!
```

这意味着：

> **新增字段时必须同步补齐所有语言 JSON。**

---

## 4. 新增语言时改哪里

至少要改：

1. `F:/yuweb/src/locales/<locale>.json`
2. `F:/yuweb/src/lib/i18n/data/locale-catalogs.data.ts`
3. 所有语言里的 `language.mode.<locale>`
4. 如需页面访问，再补 `src/app/<segment>/...`

详细步骤可查看：

- `F:/yuweb/docs/i18n-language-expansion.md`

---

# 七、样式设计

当前项目样式以：

- SCSS Modules
- 全局 SCSS tokens
- 主题变量

为主。

## 1. 组件样式

组件样式尽量与组件同目录：

- `TopNavigationBar.tsx`
- `TopNavigationBar.module.scss`

## 2. 全局样式入口

- `F:/yuweb/src/app/globals.scss`

## 3. 设计 token

- `F:/yuweb/src/styles/scss/_tokens.scss`

也就是说：

- **全局变量** 放 `styles/`
- **具体组件样式** 放组件目录内

---

# 八、测试组织

当前项目已经开始统一测试位置：

> **测试文件放到代码所在位置的 `test/` 子目录。**

## 例如

### 页面测试

- `F:/yuweb/src/app/test/page.test.tsx`
- `F:/yuweb/src/app/en/test/routes.test.tsx`

### 组件测试

- `F:/yuweb/src/components/app-shell/test/AppShell.test.tsx`
- `F:/yuweb/src/components/language-toggle/test/LanguageToggleButton.test.tsx`
- `F:/yuweb/src/components/top-navigation-bar/test/TopNavigationBar.test.tsx`

### lib 测试

- `F:/yuweb/src/lib/i18n/test/i18n.test.ts`
- `F:/yuweb/src/lib/i18n/test/i18n-keys.test.ts`
- `F:/yuweb/src/lib/site-config/test/site-config.test.ts`

### 测试基础设施

- `F:/yuweb/src/test/render.tsx`
- `F:/yuweb/src/test/setup.ts`

也就是说：

- **测试运行基础设施** 放 `src/test/`
- **具体模块测试** 放模块自己的 `test/`

---

# 九、当前项目的主要设计原则

## 1. 页面薄，组件负责渲染

页面文件尽量只做：

- metadata
- locale 确认
- 组件渲染

## 2. 文案与结构分离

- 文案 → `src/locales/*.json`
- 结构 → `src/lib/site-config/`

## 3. 类型、数据、逻辑、测试分开存放

不要再把这些全部堆到一个文件里。

当前已经开始按这个方向整改：

- `i18n` 已拆
- `site-config` 已拆
- 测试已迁到 `test/`

## 4. 兼容出口保留，内部结构逐步重构

这是为了避免每次大改都把整个项目 import 全部打断。

## 5. 新代码优先遵守目录化约定

以后新增模块时，优先考虑直接落成下面这种结构：

```text
xxx/
  data/
  helpers/
  test/
  types/
  index.ts
```

当然，不是每个模块都必须四件套，只有真的需要时再拆。

---

# 十、后续建议

当前项目已经比最开始更清晰，但还有继续整理空间。

## 建议优先继续拆的模块

### 1. `HomePage.tsx`

当前仍然存在：

- 图标小组件
- 页面视图
- 映射逻辑

后续可以继续拆成：

- `components/`
- `helpers/`
- `types/`

### 2. `AppShell.tsx`

当前仍承担较多：

- 路由判断
- locale-aware 导航映射
- 壳层渲染

后续可以继续拆。

### 3. 顶部导航的数据与渲染边界

导航结构已经从硬编码走向 config，但如果后面菜单继续变复杂，可以考虑继续把“导航数据适配逻辑”单独拆出来。

---

# 十一、快速查找指南

如果你想：

## 看页面入口
去：
- `F:/yuweb/src/app/`

## 看首页主体
去：
- `F:/yuweb/src/components/home-page/HomePage.tsx`

## 看多语言 JSON
去：
- `F:/yuweb/src/locales/`

## 看 i18n 核心
去：
- `F:/yuweb/src/lib/i18n/`

## 看站点结构配置
去：
- `F:/yuweb/src/lib/site-config/`

## 看测试基础设施
去：
- `F:/yuweb/src/test/`

## 看某个模块自己的测试
去它自己的：
- `test/` 子目录

---

# 十二、一句话总结

这个项目现在的核心方向是：

> **让页面、结构、文案、逻辑、测试逐步分层，既保持当前 SSG 可用，也为后续继续扩展语言、页面和架构重构留出空间。**
