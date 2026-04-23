# Pop Brutalism 首页首屏与设计系统重构设计

日期：2026-04-23

## 背景

当前首页使用偏克制的编辑/建筑感视觉：白底、细线、留白、较轻的导航玻璃态，以及首页顶部的大标题与摘要。参考项目 `rotating-scene-navigator (2)/app/page.tsx` 提供了一个 Neo-Brutalism / Pop Art 风格的圆盘多场景拼合轮播：彩色扇区、粗黑边框、硬阴影、拖拽切换、左右按钮和中央文字卡片。

本次目标已从“替换首页顶部区域”扩展为：先建立全站可复用的 Pop Brutalism 设计系统基础，再把它落地到首页顶部，并让顶部导航栏在不改变结构的前提下融入新风格。

## 目标

第一阶段交付以下内容：

1. 建立 Pop Brutalism 设计 tokens：高饱和色、粗边框、硬阴影、圆角、焦点样式与 motion 基础。
2. 将首页顶部替换为 7 场景圆盘导航，吸收参考项目的圆盘拼合轮播效果。
3. 在首页顶部加入适度沉浸式交互：拖拽、按钮切换、弹性阴影、贴纸/角标、轻量视差，以及 `prefers-reduced-motion` 降级。
4. 保留顶部导航栏现有结构、数据和交互逻辑，仅调整颜色、边框、阴影，并加入少量小物件点缀。
5. 保证中文与英文首页共用组件，链接按 locale 正确生成。
6. 用测试覆盖新增场景导航、首页核心内容与导航行为回归。

## 非目标

第一阶段不做以下内容：

- 不一次性重排全站所有页面。
- 不重写顶部导航栏组件逻辑。
- 不改变导航信息架构和菜单数据。
- 不引入复杂 3D、粒子系统或重量级新动画依赖。
- 不调整路由结构。
- 不把所有内容页都改成强视觉页面；内容页后续应逐步应用新 tokens。

## 视觉方向

主方向为 **活泼 Pop Brutalism**：

- 亮绿色、黄色、蓝色、粉色、橙红色等高饱和色块。
- 粗黑边框与明确的 offset hard shadow。
- 贴纸感标签、小圆点、小色块和轻微旋转元素。
- 大字号、强对比、直接的按钮与卡片形态。
- 交互反馈要“弹”，但不能损害导航和正文可读性。

首页首屏可以最张扬；下方内容和内容页应更收敛，使用“白纸卡片 + 粗边框 + 强调色贴纸”承载信息。

## 设计系统 tokens

在保留现有 `--c-*` 变量体系的基础上扩展 brutal 语义变量，优先放在 `src/styles/scss/_tokens.scss`：

- `--c-brutal-ink`：近黑色，用于文字、粗边框和硬阴影。
- `--c-brutal-paper`：白色或浅色纸面，用于卡片和导航面板。
- `--c-brutal-green`：主背景绿，承接参考项目的活泼底色。
- `--c-brutal-red`：CTA、当前场景卡片和重点按钮。
- `--c-brutal-yellow`：徽章、标签和强调态。
- `--c-brutal-blue`：技术、系统或工程场景。
- `--c-brutal-pink`：收藏、视觉或生活化场景。
- `--c-brutal-purple`：实验、沉浸和特殊强调层。

形态变量建议包括：

- `--brutal-border-sm/md/lg/xl`：3px、4px、6px、8px。
- `--brutal-shadow-sm/md/lg`：4px、8px、12px offset hard shadow。
- `--brutal-radius-sm/md/lg/pill`：小物件、卡片、大面板和胶囊按钮圆角。
- `--brutal-motion-spring` 或局部 transition token：用于 hover 位移、按压回弹和场景切换。

暗色主题暂时不做完整反转设计，但变量应在 dark mixin 中有可读的 fallback，避免暗色模式下文字或边框失效。

## 首页顶部：7 场景圆盘导航

新增独立组件目录：

```text
src/components/home-page/rotating-scene-navigator/
  RotatingSceneNavigator.tsx
  RotatingSceneNavigator.module.scss
  test/RotatingSceneNavigator.test.tsx
```

场景组成：

1. **Hero / Intro**：保留当前 `YUMENGJH.`、数字建筑师身份、摘要角色轮播的核心内容。
2. **Tech Stack**：承接当前首页顶部下方的 TechLogoLoop 信息，作为技术栈入口。
3. **Capabilities**：对应能力卡片区域。
4. **Works**：对应作品/项目入口。
5. **Gear**：对应设备/工作台区域。
6. **Archive**：对应阅读与收藏区域。
7. **Experience**：对应经历/旅程区域。

每个场景应包含：

- `id`
- `eyebrow`
- `title`
- `description`
- `href`
- `themeColor`
- `illustrationKind`

组件通过 `locale` 和当前 `siteConfig.homePage` 派生文案与链接，内部使用 `createTranslator`、`localizeHref` 等现有 i18n 工具，避免重复硬编码中英文文案。

## 首页顶部交互

圆盘轮播继承参考项目核心机制：

- 底部锚定的大圆盘。
- 圆盘按场景数切为 7 个彩色扇区。
- 当前页索引控制圆盘旋转角度。
- 左右按钮切换场景。
- 横向拖拽切换场景。
- 中央卡片展示当前场景文案。
- 场景切换时卡片滑入滑出。

沉浸层控制在轻量范围：

- 场景插画使用 CSS/SVG 小组件，不依赖图片或重型渲染。
- 当前场景可带贴纸、角标、小圆点或轻微旋转元素。
- 按钮和卡片 hover/active 使用硬阴影位移。
- 桌面端可以添加轻量视差，但必须不影响点击区域。
- `prefers-reduced-motion: reduce` 时关闭弹性旋转、视差和自动动效，只保留可读的按钮切换。

移动端策略：

- 圆盘仍作为背景场景，但中央卡片、箭头和触摸拖拽区域需要压缩。
- 触摸拖拽优先保留；按钮面积不小于可点击最小尺寸。
- 场景标题不应被导航栏遮挡。

## 顶部导航栏保留策略

继续使用现有 `TopNavigationBar.tsx`。第一阶段主要修改 `TopNavigationBar.module.scss`。

必须保留：

- 组件结构。
- 桌面下拉菜单逻辑。
- 移动端菜单逻辑。
- 导航项数据。
- hover/open/active 状态行为。
- 当前布局节奏。

采用“小物件点缀”方案：

- 导航背景改为 brutal paper / 亮色组合。
- 细线改为更粗、更明确的边框或硬分割线。
- 品牌区域可加小红点、小色块或贴纸标签。
- 当前激活项使用黄色或橙红底的粗边框胶囊。
- 下拉面板改为白纸卡片质感：粗黑边框、硬阴影、彩色分组标签。
- 移动端抽屉保留现有展开方式，但改成更粗分割线、彩色 active 状态和硬阴影按钮。

约束：

- 小物件必须是装饰层，不能影响点击区域。
- 导航 z-index 仍然高于首页圆盘。
- 固定在顶部时必须和首屏彩色背景形成足够对比。
- 不能为了风格牺牲可读性和可访问性。

## 首页下方内容边界

第一阶段下方内容不大改结构。允许做最小视觉衔接：

- 页面背景和 section 边界使用新 tokens。
- 能力卡片、作品卡片、装备卡片可逐步继承粗边框、硬阴影和贴纸标签。
- 不移动主要内容顺序。
- 不删除现有内容模块。

TechLogoLoop 若被纳入首页顶部场景，仍需保证“技术栈信息可访问”。可以保留独立 TechLogoLoop 区块，或在场景内提供可点击/可读的技术栈摘要；具体实现计划阶段决定。

## 测试策略

新增或更新 Vitest 测试：

### RotatingSceneNavigator

- 渲染 7 个场景。
- 初始展示 Hero / Intro 场景。
- 点击下一项按钮切换到下一个场景。
- 点击上一项按钮可以回到前一个场景或循环到末尾。
- CTA 链接按中文和英文 locale 正确生成。
- reduced-motion 或无动画环境下仍能渲染并可通过按钮操作。

### 首页测试

- 首页出现新的场景导航区域。
- 原有核心身份内容仍可找到，例如 `YUMENGJH.`、角色或摘要内容。
- Tech Stack 信息不丢失。
- 作品、收藏等关键链接仍按 locale 正确。

### 顶部导航测试

- 现有导航测试继续通过。
- active/open/mobile 菜单行为不因样式改造变化。
- 如新增装饰元素，应使用 `aria-hidden`，避免污染可访问名称。

## 验证命令

实现后至少运行：

```bash
pnpm test -- src/components/home-page/rotating-scene-navigator/test/RotatingSceneNavigator.test.tsx
pnpm test -- src/app/test/page.test.tsx
pnpm test -- src/components/top-navigation-bar/test/TopNavigationBar.test.tsx
pnpm typecheck
```

视改动范围再运行：

```bash
pnpm lint
pnpm check
```

## 实施阶段建议

后续实现计划应按以下顺序拆分：

1. 写 RotatingSceneNavigator 失败测试。
2. 新增 brutal tokens。
3. 实现 RotatingSceneNavigator 数据结构与基础渲染。
4. 实现按钮切换与拖拽交互。
5. 接入 HomePage，替换原 hero 区域并处理 TechLogoLoop 关系。
6. 调整 TopNavigationBar.module.scss，保留 TSX 逻辑。
7. 更新首页和导航测试。
8. 运行验证命令并修复问题。

## 风险与缓解

- **风险：首屏过重。** 缓解：插画优先 CSS/SVG，不引入重型依赖。
- **风险：风格过强影响阅读。** 缓解：首页首屏最张扬，下方内容区使用白纸卡片承载。
- **风险：导航装饰影响可访问名称。** 缓解：装饰元素全部 `aria-hidden` 或纯 CSS pseudo-element。
- **风险：拖拽与按钮点击冲突。** 缓解：拖拽层和按钮 z-index/事件边界在组件中明确分离。
- **风险：英文和中文内容不一致。** 缓解：从 `siteConfig.homePage` 和 i18n 工具派生场景内容。
