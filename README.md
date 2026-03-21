# 个人 Next.js 基础模板

一个适合长期复用的 Next.js 个人基础模板，默认集成：

- Next.js App Router
- TypeScript
- SCSS + 全局主题变量
- Tailwind CSS v4
- Vitest + Testing Library
- Prettier + ESLint + CSpell
- Husky + lint-staged + commitlint + cz-git
- GitHub Actions（CI / SFTP / FTP）

## 常用命令

```bash
pnpm dev
pnpm lint
pnpm lint:fix
pnpm format
pnpm format:check
pnpm typecheck
pnpm spellcheck
pnpm test
pnpm check
pnpm commit
pnpm lint-staged
```

## 目录结构

```text
src/
  app/          # 路由、layout、全局样式入口
  components/   # 通用组件与默认首页组件
  lib/          # 模板级配置与框架相关工具
  styles/       # SCSS 变量与样式基础设施
  test/         # Vitest setup、测试渲染工具
  utils/        # 纯函数工具
public/         # 静态资源
.github/
  workflows/    # GitHub Actions 工作流
```

## 样式变量

全局颜色变量位于 `src/styles/scss/_tokens.scss`：

- `--hue-base`
- `--c-*`
- `--ld-*`

默认支持 `:root` / `.light` / `.dark` 主题变量策略。

## 工程化能力

- `pnpm commit`：先询问是否写入 `CHANGELOG.md`，再进入 `cz-git` 交互式提交
- `pnpm lint-staged`：手动验证暂存区检查链路
- `pre-commit`：自动执行 Prettier、ESLint、CSpell
- `commit-msg`：自动执行 commitlint 校验
- GitHub Actions：内置 CI、SFTP 部署、FTP 部署工作流

## GitHub Actions

默认提供 3 个工作流：`CI 检查`、`CD 部署（SFTP）`、`CD 部署（FTP）`。`CI 检查` 会自动触发，两个部署工作流都改为仅支持 `workflow_dispatch` 手动触发。3 个工作流都会先显式安装 `pnpm`，再启用 `setup-node` 的 `pnpm` 缓存。部署工作流默认读取 `BUILD_OUTPUT_DIR` 作为产物目录；如果没有配置该变量，则回退到 `out`。

更详细的说明请查看根目录的 `MANUAL.md`。

## 变更记录

- 根目录内置 `CHANGELOG.md`
- `pnpm commit` 默认会先询问是否写入变更记录，默认值为“否”
- 只有在本次提交成功且你选择“是”时，才会把本次提交摘要追加到 `CHANGELOG.md`
- 当前记录格式偏简洁，适合作为个人模板的开发过程记录，不是自动发布日志
