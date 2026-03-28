# 当前项目多语言设计与扩展说明

这份文档说明当前项目的多语言实现方式，以及后续如何：

1. 新增一门语言
2. 给现有语言新增字段
3. 新增语言页面
4. 在页面和组件里正确使用 `t(token)`
5. 按当前项目的新目录结构放置测试

这份文档基于**当前仓库真实结构**编写，不是泛泛的 i18n 介绍。

---

# 一、当前项目的多语言整体设计

当前项目的多语言可以分成四层来看：

1. **语言源文件层**：`src/locales/*.json`
2. **i18n 核心层**：`src/lib/i18n/`
3. **站点结构配置层**：`src/lib/site-config/`
4. **页面与组件消费层**：`src/app/...`、`src/components/...`

当前推荐的调用方式是：

```ts
import { createTranslator } from "@/lib/i18n";
import { route, home, language } from "@/lib/i18n-keys";

const t = createTranslator(locale);

const title = t(route.home.title);
const summary = t(home.hero.summary);
const label = t(language.label);
```

---

# 二、当前真实目录结构

## 1. 语言源文件

位置：

- `F:/yuweb/src/locales/zh-CN.json`
- `F:/yuweb/src/locales/en-US.json`

这里存放所有最终展示给用户的文案，例如：

- 页面标题
- 导航文案
- footer 文案
- 首页文案
- 404 文案
- 主题切换 / 语言切换文案

原则：

> **用户可见文案，只放在 `src/locales/*.json` 里。**

不要把中英文重新散落写回组件。

---

## 2. i18n 核心目录

当前位置：

- `F:/yuweb/src/lib/i18n/`

当前已经拆成下面这些子目录和文件：

### `types/`

- `F:/yuweb/src/lib/i18n/types/i18n.types.ts`

这里放：

- `MessageToken`
- `MessageParams`
- `NestedMessageCatalog`
- `FlatMessageCatalog`
- `TokenTree`

也就是说：

> **纯类型定义，放这里。**

---

### `data/`

- `F:/yuweb/src/lib/i18n/data/locale-catalogs.data.ts`

这里放语言 catalog 数据注册：

```ts
export const localeCatalogs = {
  "zh-CN": zhCNMessages,
  "en-US": enUSMessages,
} as const;
```

这里是“语言文件集合”的真正来源。

---

### `helpers/`

- `F:/yuweb/src/lib/i18n/helpers/token.helpers.ts`
- `F:/yuweb/src/lib/i18n/helpers/catalog.helpers.ts`
- `F:/yuweb/src/lib/i18n/helpers/message.helpers.ts`
- `F:/yuweb/src/lib/i18n/helpers/path.helpers.ts`

职责分别是：

#### `token.helpers.ts`

- 根据 `zh-CN.json` 构建 token tree
- 提供 `getMessageToken()`
- 提供 `keys`

#### `catalog.helpers.ts`

- 把嵌套 JSON flatten 成 `a.b.c` 结构
- 提供 `flatLocaleCatalogs`

#### `message.helpers.ts`

- 处理 `formatMessage()`
- 处理缺词 warning

#### `path.helpers.ts`

- 处理 locale 路径前缀
- 处理 `localizeHref()`
- 处理 `getLocaleFromPathname()`
- 处理 `resolvePreferredLocale()`

也就是说：

> **纯逻辑 helper，放 `helpers/`。**

---

### `index.ts`

- `F:/yuweb/src/lib/i18n/index.ts`

这是 i18n 的主出口，负责组合导出：

- `createTranslator()`
- `t()`
- `getLocaleFromPathname()`
- `localizeHref()`
- `switchLocalePath()`
- `resolvePreferredLocale()`
- `LOCALE_STORAGE_KEY`
- `MISSING_MESSAGE`
- 等等

通常业务代码优先从这里 import：

```ts
import { createTranslator, localizeHref } from "@/lib/i18n";
```

---

### `keys.ts`

- `F:/yuweb/src/lib/i18n/keys.ts`

这里负责导出 token 对象：

```ts
export const {
  site,
  route,
  nav,
  footer,
  home,
  notFound,
  comingSoon,
  theme,
  language,
} = keys;
```

所以业务代码可以这样写：

```ts
import { route, home, language } from "@/lib/i18n-keys";
```

---

### `locale-registry.ts`

- `F:/yuweb/src/lib/i18n/locale-registry.ts`

这里负责：

- `SiteLocale`
- `LocaleMode`
- `supportedLocales`
- `getLocaleCatalog()`

---

### `test/`

- `F:/yuweb/src/lib/i18n/test/i18n.test.ts`
- `F:/yuweb/src/lib/i18n/test/i18n-keys.test.ts`

现在 `i18n` 自己的测试已经放到它自己的 `test/` 子目录里了。

原则：

> **测试文件尽量放在代码所在位置的 `test/` 子目录。**

---

## 3. 兼容出口文件

为了不让全项目 import 一次性全部改炸，当前还保留了三个兼容出口：

- `F:/yuweb/src/lib/i18n.ts`
- `F:/yuweb/src/lib/i18n-keys.ts`
- `F:/yuweb/src/lib/locale-registry.ts`

这三个文件现在都只是**很薄的 re-export**。

所以你现有代码里继续写：

```ts
import { createTranslator } from "@/lib/i18n";
import { route } from "@/lib/i18n-keys";
import type { SiteLocale } from "@/lib/locale-registry";
```

仍然是可以工作的。

也就是说：

> **内部结构已经拆开，但对业务层的 import 习惯暂时保持兼容。**

---

## 4. site-config 现在也已经拆分

当前位置：

- `F:/yuweb/src/lib/site-config/`

已经拆成：

- `types/site-config.types.ts`
- `data/site-config.data.ts`
- `data/app-routes.data.ts`
- `helpers/site-config.helpers.ts`
- `test/site-config.test.ts`
- `index.ts`

旧的：

- `F:/yuweb/src/lib/site-config.ts`

现在也只是兼容出口。

原则同样是：

> **类型、数据、helper、测试分开存放。**

---

# 三、当前项目里，路径和语言是怎么对应的

当前规则：

- `zh-CN` → 默认语言 → 无前缀，例如 `/about`
- `en-US` → 非默认语言 → `/en` 前缀，例如 `/en/about`

路径前缀来自 locale 的前半段：

```ts
function getLocaleSegment(locale: SiteLocale) {
  return locale.split("-")[0].toLowerCase();
}
```

所以如果以后新增：

- `ja-JP`

默认就会对应：

- `/ja`

---

# 四、新增一门语言的完整步骤

下面用 **新增 `ja-JP`** 为例说明。

---

## 步骤 1：新建语言 JSON 文件

目录：

- `F:/yuweb/src/locales/`

新建：

- `F:/yuweb/src/locales/ja-JP.json`

最简单的做法是先复制现有语言文件：

```bash
Copy-Item 'F:/yuweb/src/locales/en-US.json' 'F:/yuweb/src/locales/ja-JP.json'
```

然后改 value。

### 注意

不是只补几条翻译，而是要补成一整份和现有 schema 一致的文件。

也就是说：

- 保持 key 一致
- 只改 value
- 不要改结构
- 不要改 key 名

---

## 步骤 2：注册语言

改这里：

- `F:/yuweb/src/lib/i18n/data/locale-catalogs.data.ts`

修改前：

```ts
export const localeCatalogs = {
  "zh-CN": zhCNMessages,
  "en-US": enUSMessages,
} as const;
```

修改后：

```ts
import jaJPMessages from "@/locales/ja-JP.json";

export const localeCatalogs = {
  "zh-CN": zhCNMessages,
  "en-US": enUSMessages,
  "ja-JP": jaJPMessages,
} as const;
```

这一步完成后：

- `SiteLocale` 自动包含 `ja-JP`
- `supportedLocales` 自动包含 `ja-JP`
- locale 路径逻辑也会知道它

---

## 步骤 3：补 `language.mode.ja-JP`

当前语言切换器是根据 `supportedLocales` 动态生成的。

它显示的文字来自：

```ts
language.mode.<locale>
```

所以新增 `ja-JP` 后，要改：

- `F:/yuweb/src/locales/zh-CN.json`
- `F:/yuweb/src/locales/en-US.json`
- `F:/yuweb/src/locales/ja-JP.json`

例如：

### `zh-CN.json`

```json
{
  "language": {
    "mode": {
      "ja-JP": "日语"
    }
  }
}
```

### `en-US.json`

```json
{
  "language": {
    "mode": {
      "ja-JP": "Japanese"
    }
  }
}
```

### `ja-JP.json`

```json
{
  "language": {
    "mode": {
      "ja-JP": "日本語"
    }
  }
}
```

如果漏掉这里，菜单里就会出现缺词占位文案。

---

## 步骤 4：决定是否新增页面

### 情况 A：只让系统认识这门语言

那只需要：

1. 新建 JSON
2. 注册 locale
3. 补 `language.mode.<locale>`

### 情况 B：要让这门语言真的能访问页面

那就要新增页面目录，例如：

- `F:/yuweb/src/app/ja/page.tsx`
- `F:/yuweb/src/app/ja/about/page.tsx`
- `F:/yuweb/src/app/ja/stack/page.tsx`
- `F:/yuweb/src/app/ja/curations/page.tsx`
- `F:/yuweb/src/app/ja/journey/page.tsx`
- `F:/yuweb/src/app/ja/blog/page.tsx`

如果 notes / projects / collections 也要开放，也继续加：

- `F:/yuweb/src/app/ja/notes/page.tsx`
- `F:/yuweb/src/app/ja/projects/page.tsx`
- `F:/yuweb/src/app/ja/collections/page.tsx`

---

## 步骤 5：新增首页

文件：

- `F:/yuweb/src/app/ja/page.tsx`

参考：

- `F:/yuweb/src/app/en/page.tsx`

典型写法：

```ts
import type { Metadata } from "next";

import { HomePage } from "@/components/home-page/HomePage";
import { createTranslator } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";

const t = createTranslator("ja-JP");

export const metadata: Metadata = {
  title: t(siteConfig.homePage.metadata.title),
  description: t(siteConfig.homePage.metadata.description),
};

export default function JapaneseHomePage() {
  return <HomePage locale="ja-JP" />;
}
```

---

## 步骤 6：新增其它页面

如果页面还没真正翻译完成，可以先复用占位页：

- `F:/yuweb/src/components/route-placeholder/RoutePlaceholderPage.tsx`

例如：

- `F:/yuweb/src/app/ja/about/page.tsx`

```ts
import type { Metadata } from "next";

import { RoutePlaceholderPage } from "@/components/route-placeholder/RoutePlaceholderPage";
import { createTranslator } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";

const t = createTranslator("ja-JP");

export const metadata: Metadata = {
  title: `${t(siteConfig.routeMeta.about.title)} | ${siteConfig.identity.brandLatin}`,
  description: t(siteConfig.routeMeta.about.description),
};

export default function JapaneseAboutPage() {
  return <RoutePlaceholderPage locale="ja-JP" routeId="about" />;
}
```

---

## 步骤 7：新增测试放哪里

如果你给 `i18n` 本身补测试，放这里：

- `F:/yuweb/src/lib/i18n/test/`

如果你给某个组件补测试，放它自己的：

- `F:/yuweb/src/components/xxx/test/`

如果你给某个 app 页面补测试，放：

- `F:/yuweb/src/app/test/`
- 或 `F:/yuweb/src/app/en/test/`

当前约定是：

> **测试文件放在代码所在位置的 `test/` 子目录，不再和源码平铺。**

---

## 步骤 8：最后验证

至少跑：

```bash
pnpm typecheck
pnpm test
pnpm build
```

说明：

- `pnpm typecheck`：检查类型、路径和导出
- `pnpm test`：检查行为和多语言逻辑
- `pnpm build`：检查 Next 构建与页面导出

---

# 五、给现有语言新增一个字段，完整步骤

例如你要新增：

- `language.dialog.title`
- `footer.help.text`
- `home.hero.badge`

---

## 步骤 1：先决定 namespace

当前常用 namespace：

- `site`
- `route`
- `nav`
- `footer`
- `home`
- `notFound`
- `comingSoon`
- `theme`
- `language`

举例：

- 页面标题 / 描述 → `route`
- 导航 → `nav`
- footer → `footer`
- 首页 → `home`
- 404 → `notFound`
- 主题 / 语言切换 → `theme` / `language`

例如“语言弹窗标题”适合放：

```json
language.dialog.title
```

---

## 步骤 2：先改 `zh-CN.json`

文件：

- `F:/yuweb/src/locales/zh-CN.json`

例如：

```json
{
  "language": {
    "dialog": {
      "title": "选择语言"
    }
  }
}
```

为什么先改它？

因为当前 token tree 是基于 `zh-CN.json` 生成的，它是 schema 基准。

---

## 步骤 3：同步所有其它语言 JSON

例如：

- `F:/yuweb/src/locales/en-US.json`

```json
{
  "language": {
    "dialog": {
      "title": "Choose language"
    }
  }
}
```

如果项目以后还有：

- `ja-JP.json`
- `fr-FR.json`

也必须一起补。

最重要的规则是：

> **所有 locale JSON 的 leaf path 必须一致。**

不一致就会触发缺词逻辑，页面显示：

```ts
The vocabulary was not found!
```

---

## 步骤 4：判断是否要改 `keys.ts`

### 情况 A：只是给已有 namespace 新增字段

例如：

- `language.dialog.title`
- `home.hero.badge`

这种通常**不需要改**：

- `F:/yuweb/src/lib/i18n/keys.ts`

因为：

- `language`
- `home`

这些顶层 namespace 已经导出了。

你可以直接用：

```ts
import { language } from "@/lib/i18n-keys";

language.dialog.title;
```

---

### 情况 B：新增了全新的顶层 namespace

例如你新增：

```json
{
  "profile": {
    "intro": {
      "title": "..."
    }
  }
}
```

那就要改：

- `F:/yuweb/src/lib/i18n/keys.ts`

把 `profile` 也导出出来：

```ts
export const {
  site,
  route,
  nav,
  footer,
  home,
  notFound,
  comingSoon,
  theme,
  language,
  profile,
} = keys;
```

---

## 步骤 5：判断是否要改 `site-config`

### 情况 A：只是局部组件临时使用

那可以直接用 token，不一定要进 site-config。

例如：

```ts
import { createTranslator } from "@/lib/i18n";
import { language } from "@/lib/i18n-keys";

const t = createTranslator(locale);

return <h2>{t(language.dialog.title)}</h2>;
```

### 情况 B：属于共享结构配置的一部分

那就应该进入：

- `F:/yuweb/src/lib/site-config/data/site-config.data.ts`

例如：

```ts
languageToggle: {
  label: language.label,
  triggerAriaLabel: language.aria.trigger,
  menuAriaLabel: language.aria.menu,
  dialogTitle: language.dialog.title,
  modeLabels: languageToggleModeLabels,
}
```

后续组件再通过：

```ts
t(siteConfig.languageToggle.dialogTitle);
```

来读。

---

## 步骤 6：在页面或组件里使用

### 直接用 token

```ts
const t = createTranslator(locale);

return <div>{t(language.dialog.title)}</div>;
```

### 通过 site-config 用

```ts
const t = createTranslator(locale);

return <div>{t(siteConfig.languageToggle.dialogTitle)}</div>;
```

---

## 步骤 7：补测试放哪里

如果是 `i18n` 逻辑本身：

- `F:/yuweb/src/lib/i18n/test/`

如果是 `site-config`：

- `F:/yuweb/src/lib/site-config/test/`

如果是组件：

- 对应组件自己的 `test/`

---

## 步骤 8：验证

```bash
pnpm typecheck
pnpm test
pnpm build
```

---

# 六、页面和组件里到底怎么接入 i18n

## 1. metadata

例如：

```ts
import type { Metadata } from "next";

import { createTranslator } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";

const t = createTranslator("zh-CN");

export const metadata: Metadata = {
  title: t(siteConfig.homePage.metadata.title),
  description: t(siteConfig.homePage.metadata.description),
};
```

---

## 2. 页面组件

例如：

```ts
import { HomePage } from "@/components/home-page/HomePage";

export default function ChineseHomePage() {
  return <HomePage locale="zh-CN" />;
}
```

或者：

```ts
import { RoutePlaceholderPage } from "@/components/route-placeholder/RoutePlaceholderPage";

export default function EnglishAboutPage() {
  return <RoutePlaceholderPage locale="en-US" routeId="about" />;
}
```

---

## 3. 普通组件

```ts
import { createTranslator } from "@/lib/i18n";
import { home } from "@/lib/i18n-keys";

export function SomeComponent({ locale }: { locale: SiteLocale }) {
  const t = createTranslator(locale);

  return <p>{t(home.hero.summary)}</p>;
}
```

原则：

- 从上层传 `locale`
- 组件内部 `createTranslator(locale)`
- 统一使用 `t(token)`

---

# 七、最后记住这几个原则

## 原则 1：用户可见文案只放 `src/locales/*.json`

## 原则 2：`zh-CN.json` 是当前 token schema 基准

## 原则 3：所有 locale JSON 结构必须一致

## 原则 4：`i18n` 和 `site-config` 现在都已经目录化拆分

## 原则 5：兼容出口还保留着，但新代码应该优先理解目录结构

## 原则 6：测试放到代码所在位置的 `test/` 子目录

---

如果你后面继续扩语言，推荐工作流就是：

1. 先补 JSON
2. 再注册 locale
3. 再补页面
4. 必要时补 site-config
5. 最后补 test 并跑 `typecheck / test / build`
