/**
 * Prettier 只负责格式统一，保持模板默认风格稳定。
 *
 * 说明：
 * - 主配置面向当前 Next.js + TypeScript + SCSS 模板
 * - Markdown 和 YAML 单独做了更适合阅读的宽度覆盖
 * - 不引入 Vue、monorepo 等当前模板暂时用不到的专属配置
 */
const prettierConfig = {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  quoteProps: "as-needed",
  trailingComma: "all",
  bracketSpacing: true,
  arrowParens: "always",
  proseWrap: "preserve",
  embeddedLanguageFormatting: "auto",
  endOfLine: "lf",
  overrides: [
    {
      files: "*.md",
      options: {
        printWidth: 80,
      },
    },
    {
      files: ["*.yml", "*.yaml"],
      options: {
        singleQuote: false,
        printWidth: 120,
      },
    },
  ],
};

export default prettierConfig;
