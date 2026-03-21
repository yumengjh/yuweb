/**
 * 站点级模板配置。
 *
 * 作用：
 * - 统一管理站点标题、描述等基础元信息
 * - 让 layout、首页、SEO 配置共享同一份来源
 *
 * 建议：
 * 项目初始化后，优先先修改这里，再去扩展更完整的品牌配置。
 */
export const siteConfig = {
  name: "个人 Next.js 基础模板",
  description:
    "面向个人长期复用的 Next.js 基础模板，内置 App Router、SCSS 主题变量、Vitest 与基础目录分层。",
} as const;
