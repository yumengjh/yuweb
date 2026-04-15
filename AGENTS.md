# Repository Guidelines

## 项目结构与模块组织

`src/app` 存放 Next.js App Router 入口、国际化路由（如 `(zh)`、`(en)`、`en/`）以及应用级样式，例如 `globals.scss`。可复用 UI 组件放在 `src/components/<feature>/`，通常会在同目录下配套 `test/`。共享业务逻辑放在 `src/lib`，通用工具放在 `src/utils`，静态内容放在 `src/content`，多语言资源放在 `src/locales`，测试公共辅助放在 `src/test`。静态资源统一放在 `public/fonts`、`public/image`、`public/model` 和 `public/og`。

## 构建、测试与开发命令

统一使用 `pnpm`：

- `pnpm dev`：启动本地开发服务，端口为 `3001`
- `pnpm build` / `pnpm start`：构建并启动生产版本
- `pnpm lint` / `pnpm lint:fix`：检查或自动修复 ESLint 问题
- `pnpm format` / `pnpm format:check`：格式化或校验 Prettier
- `pnpm typecheck`：执行 TypeScript 类型检查
- `pnpm test` / `pnpm test:watch` / `pnpm test:coverage`：运行 Vitest、监听模式或覆盖率统计
- `pnpm check`：执行完整检查链路（lint、format、typecheck、spellcheck、test）

修改后优先运行最小相关检查，再视情况执行 `pnpm check`。

## 代码风格与命名约定

仓库使用 2 空格缩进、LF 换行、保留分号、双引号和尾随逗号。格式化由 Prettier 负责，静态检查使用 ESLint（Next.js 配置）。优先使用 TypeScript，保持显式错误处理和小而清晰的变更。

命名约定：

- 组件目录使用 kebab-case，例如 `top-navigation-bar`
- React 组件文件使用 PascalCase，例如 `TopNavigationBar.tsx`
- 样式模块使用 `ComponentName.module.scss`
- 测试文件使用 `*.test.ts` 或 `*.test.tsx`

## 测试指南

测试框架为 Vitest，运行环境为 `jsdom`，全局测试初始化位于 `src/test/setup.ts`。页面和组件测试通常与功能同目录放置在 `test/` 文件夹中，例如 `src/app/test`、`src/components/**/test`。只要行为发生变化，就应补充或更新测试。单测调试建议优先运行针对性命令，例如：`pnpm test -- src/components/top-navigation-bar/test/TopNavigationBar.test.tsx`。

## 提交与 Pull Request 规范

提交信息遵循 Conventional Commits，并由 Commitlint 校验，例如 `feat(i18n): refine zh nav labels`、`fix(app): add shared global 404 handling`。常用类型包括 `feat`、`fix`、`docs`、`style`、`refactor`、`test`、`chore`、`types`；可选 scope 常见有 `app`、`components`、`docs`、`config`。建议使用 `pnpm commit` 进入 Commitizen 引导提交流程。

PR 应包含：变更摘要、验证方式、相关 Issue 链接（如有），以及 UI 变更对应的截图或录屏。

## 安全与协作说明

不要提交密钥、令牌、`.env` 内容或未明确要求的遥测/网络调用。不要臆造 API、配置项或路径；不确定时先搜索仓库。所有改动应尽量贴合现有按功能分目录的组织方式。

## 读取文件注意使用正确格式，例如：UTF-8，避免出现乱码问题。
