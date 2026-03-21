# 使用手册

## 1. 模板定位

这是一个偏**长期复用**的 Next.js 个人基础模板，目标是让你新建项目后可以直接开始写业务，而不是重复搭工程基础。

当前模板默认包含：

- Next.js App Router
- TypeScript 严格模式
- SCSS 主题变量
- Tailwind CSS v4
- Vitest + Testing Library
- `src` 按职责分层
- Prettier + ESLint + CSpell
- Husky + lint-staged + commitlint + cz-git
- GitHub Actions（CI / SFTP / FTP）

适合的项目类型：

- 个人博客
- 企业官网
- 通用 SaaS 前端
- 中小型后台项目

---

## 2. 常用命令

```bash
pnpm dev
pnpm lint
pnpm lint:fix
pnpm format
pnpm format:check
pnpm typecheck
pnpm spellcheck
pnpm test
pnpm test:watch
pnpm test:coverage
pnpm check
pnpm commit
pnpm lint-staged
```

说明：

- `pnpm dev`：本地开发
- `pnpm lint`：检查 JS / TS / React / Next 代码问题
- `pnpm lint:fix`：自动修复可安全修复的 ESLint 问题
- `pnpm format`：使用 Prettier 重写格式
- `pnpm format:check`：检查格式是否符合统一规范
- `pnpm typecheck`：执行 TypeScript 类型检查
- `pnpm spellcheck`：执行拼写检查（以代码与配置为主）
- 项目自定义词请统一维护在 `.cspell/project-words.txt`
- `pnpm test`：运行所有测试
- `pnpm check`：执行模板常用的完整自检
- `pnpm commit`：先询问是否写入 `CHANGELOG.md`，再启动 `cz-git` 交互式提交向导
- `pnpm lint-staged`：手动对暂存文件执行格式化、ESLint 自动修复与拼写检查

---

## 3. 目录结构说明

```text
src/
  app/          # 路由入口、layout、全局样式
  components/   # 通用组件与默认首页组件
  lib/          # 模板级配置、框架相关 helper
  styles/       # SCSS 变量与样式基础设施
  test/         # 测试公共 setup 与 render 工具
  utils/        # 纯函数工具
public/         # 静态资源
.github/
  workflows/    # GitHub Actions 工作流
```

推荐约定：

- 页面与路由放到 `src/app`
- 通用 UI 组件放到 `src/components`
- 与框架或项目配置强相关的东西放到 `src/lib`
- 纯函数、格式化、className 工具放到 `src/utils`
- 测试环境公共封装放到 `src/test`
- CI / CD 配置统一放到 `.github/workflows`

---

## 4. 样式体系

### 4.1 全局 token 文件

全局颜色变量统一维护在：

`src/styles/scss/_tokens.scss`

核心变量分组：

- 基础色相：`--hue-base`
- 文本：`--c-text` ~ `--c-text-3`
- 背景：`--c-bg` ~ `--c-bg-3`、`--c-bg-soft`
- 边框/透明层：`--c-border`、`--c-bg-a50`、`--c-bg-a80`
- 品牌：`--c-primary`、`--c-primary-soft`、`--c-accent`
- 业务别名：`--ld-bg-blur`、`--ld-bg-card`、`--ld-shadow`

### 4.2 主题策略

模板默认支持：

- `:root`：默认主题
- `.light`：显式浅色主题
- `.dark`：显式暗色主题

当前模板只预留了类名切换能力，没有内置 JS 主题切换逻辑。后续如果你需要，可以自己加：

- `next-themes`
- 自己写 `html.classList.toggle('dark')`

### 4.3 建议

- 颜色一律优先使用 token，不要在业务组件里散落硬编码色值
- 如果后续模板继续稳定，可再加 spacing / radius / shadow tokens
- `globals.scss` 只放全局入口和 reset，不建议堆业务样式

---

## 5. 测试与质量检查

### 5.1 为什么有 `src/test`

`src/test` 不是业务代码目录，而是**测试基础设施目录**。

当前用于放：

- `setup.ts`：Vitest 全局初始化
- `render.tsx`：统一测试渲染入口

后续可以继续放：

- `fixtures/`
- `mocks/`
- `factories/`

### 5.2 默认组件测试

根路径默认放的是一个极简单按钮计数器，它同时也是模板内置的组件测试样例。

这样做的目的：

- 新项目启动后页面是干净的
- 模板仍然保留了一个最小但真实可运行的交互组件
- 测试体系有一个明确的默认样例可参考

### 5.3 工程化检查链路

当前模板的提交流程是：

1. `pnpm commit` 先询问是否写入 `CHANGELOG.md`，默认值为“否”
2. `pre-commit` 通过 `lint-staged` 对暂存文件执行格式化、ESLint 自动修复与拼写检查
3. `commit-msg` 通过 `commitlint` 校验提交信息
4. `pnpm commit` 再通过 `cz-git` 引导生成统一格式的提交消息
5. 只有当提交成功且你在开始时选择“是”时，才会把本次提交摘要写入 `CHANGELOG.md`

如果你要单独排查暂存区流程，可以手动执行：

```bash
pnpm lint-staged
```

### 5.4 CHANGELOG 记录机制

模板根目录内置一个 `CHANGELOG.md`，用于记录开发过程中的重要变更。

当前策略是：

- 记录是**可选的**
- 触发点在 `pnpm commit`
- 默认答案是“否”
- 只有在提交成功后才会真正写入

当前写入内容尽量保持精简：

- 日期
- 提交类型
- 影响范围（如果有）
- 提交标题
- `body` / `footer` 只有在有内容时才会追加

这份文件的定位是：

- 便于你长期维护模板时回看关键调整
- 不替代正式发布日志
- 不强行追求 Conventional Changelog 那种发版级自动生成格式

### 5.5 当前项目检查范围内的文件格式规范

当前模板默认有 3 条主要检查链路：

- Prettier：负责统一格式
- ESLint：负责 JS / TS / React / Next 代码质量
- CSpell：负责英文拼写检查（以代码与配置为主）

#### Prettier 当前覆盖的文件类型

默认会处理这些文件：

- `js` / `jsx`
- `ts` / `tsx`
- `mjs` / `cjs` / `cts` / `mts`
- `css` / `scss` / `less`
- `html`
- `json`
- `md`
- `yml` / `yaml`

当前格式规则重点是：

- 默认 `printWidth` 为 `100`
- `Markdown`（`*.md`）单独使用 `printWidth: 80`
- `YAML`（`*.yml` / `*.yaml`）单独使用 `printWidth: 120`
- 默认使用双引号、分号、2 空格缩进、尾随逗号

#### ESLint 当前覆盖的文件类型

默认重点检查这些文件：

- `js` / `jsx`
- `ts` / `tsx`
- `mjs` / `cjs` / `cts` / `mts`

说明：

- ESLint 主要面向可执行代码与配置脚本
- `scss`、`md`、`yaml` 当前不走 ESLint
- 规则基础是 `eslint-config-next`，并叠加了 `eslint-config-prettier`

#### CSpell 当前覆盖的文件类型

默认重点检查这些文件：

- `js` / `jsx`
- `ts` / `tsx`
- `mjs` / `cjs` / `cts` / `mts`
- `md`

说明：

- CSpell 主要检查英文单词，不把中文内容当成拼写错误
- 项目自定义词统一维护在 `.cspell/project-words.txt`
- 如果以后有新的技术名词、品牌名或缩写，优先补到词典文件，而不是直接忽略整个文件

#### lint-staged 当前会处理什么

提交前，`lint-staged` 会只对**已暂存文件**执行这些操作：

1. 先跑 Prettier
2. 再跑 ESLint 自动修复
3. 最后跑 CSpell

所以对当前模板来说：

- `md` 会参与格式化和拼写检查
- `js / ts / tsx` 既参与格式化，也参与 ESLint 和拼写检查
- `scss` 目前只参与格式化，不参与 ESLint 和拼写检查
- `json / yml / yaml` 目前只参与格式化

### 5.6 Vitest 和 Jest 生态

这个模板使用的是 **Vitest**，但很多 Jest 生态工具仍然可以使用。

比如当前已经在用：

- `@testing-library/react`
- `@testing-library/jest-dom`
- `@testing-library/user-event`

经验原则：

- DOM 断言、Testing Library 这类通常兼容很好
- 如果某个库强依赖 `jest` 的内部运行机制，则要单独确认兼容性

---

## 6. GitHub Actions 与部署

### 6.1 当前内置工作流

模板当前内置 3 个工作流：

- `CI 检查`
- `CD 部署（SFTP）`
- `CD 部署（FTP）`

触发方式：

- `CI 检查`：`push`、`pull_request`、`workflow_dispatch`
- `CD 部署（SFTP）`：仅支持 `workflow_dispatch` 手动触发
- `CD 部署（FTP）`：仅支持 `workflow_dispatch` 手动触发

### 6.2 CI 会做什么

`CI 检查` 工作流默认执行：

1. 显式安装 `pnpm`
2. 安装依赖
3. `pnpm lint`
4. `pnpm format:check`
5. `pnpm typecheck`
6. `pnpm spellcheck`
7. `pnpm test`
8. `pnpm build`
9. 上传构建产物

补充说明：

- GitHub Actions 中会先通过 `pnpm/action-setup` 显式安装 `pnpm`
- 然后再使用 `actions/setup-node` 的 `cache: pnpm`
- 这样可以避免 `setup-node` 在未找到 `pnpm` 可执行文件时直接报错

### 6.3 产物目录环境变量

工作流不会把构建产物目录写死为 `out`，而是优先读取 GitHub Variables 中的：

- `BUILD_OUTPUT_DIR`

如果没有配置，则默认回退到：

- `out`

这意味着：

- 当前静态导出项目可以直接使用默认值
- 如果以后你调整了导出目录，只需要改 `BUILD_OUTPUT_DIR`

注意：

- 当前模板的 FTP / SFTP 工作流本质上适合**可直接上传的静态产物目录**
- 两个部署工作流默认不会在推送代码后自动执行，需要你在 GitHub Actions 页面手动触发
- 如果未来改成 SSR / Node 服务端部署，通常不应该继续沿用 FTP / SFTP 工作流，而要改成服务器发布或容器部署流程

### 6.4 SFTP 部署所需 Secrets

SFTP 工作流默认使用这些 Secrets：

- `SFTP_HOST`
- `SFTP_PORT`
- `SFTP_USERNAME`
- `SFTP_KEY`
- `SFTP_TARGET_DIR`
- 可选：`SFTP_FINGERPRINT`

说明：

- 默认优先使用 SSH Key
- `SFTP_TARGET_DIR` 建议写成专用站点目录

### 6.5 FTP 部署所需 Secrets

FTP 工作流默认使用这些 Secrets：

- `FTP_SERVER`
- `FTP_PORT`
- `FTP_USERNAME`
- `FTP_PASSWORD`
- `FTP_SERVER_DIR`
- 可选：`FTP_PROTOCOL`（支持 `ftp`、`ftps`、`ftps-legacy`）

说明：

- `FTP_SERVER_DIR` 建议以 `/` 结尾
- 如果服务端要求加密连接，优先使用 `ftps`

### 6.6 不需要某种部署方式时怎么办

如果你的项目只会用其中一种部署方式，可以直接删除另一个工作流文件：

- `.github/workflows/deploy-sftp.yml`
- `.github/workflows/deploy-ftp.yml`

---

## 7. 新增代码的推荐位置

### 页面

- 放在 `src/app/...`

### 组件

- 放在 `src/components/...`

### 工具函数

- 放在 `src/utils/...`

### 配置与模板元信息

- 放在 `src/lib/...`

### 测试文件

- 单元测试：与源码同目录 `*.test.ts`
- 组件测试：与组件同目录 `*.test.tsx`

---

## 8. 模板维护建议

### 什么时候改 `siteConfig`

如果项目名称、描述、SEO 基础信息变了，就优先修改：

- `src/lib/site.ts`

### 什么时候扩展 tokens

如果同一类颜色、阴影、间距在多个页面反复出现，就应该抽到 token 层，而不是在单个模块里重复写。

### 什么时候引入额外依赖

当模板在多个项目里反复出现同一需求时，再考虑加入：

- `clsx` / `tailwind-merge`
- `zustand`
- 请求层封装库
- 表单库
- E2E（如 Playwright）

不要为了“可能会用”而过早塞满模板。

---

## 9. 当前已知事项

### Sass 警告

目前 `src/app/globals.scss` 中使用了：

```scss
@import "tailwindcss";
```

这会触发 Dart Sass 的弃用警告，但**当前不影响构建通过**。

如果后续 Tailwind / Next / Sass 的推荐接入方式变化，再统一升级即可。
