import { defineConfig, globalIgnores } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/**
 * ESLint 继续以 Next 官方规则为基础，额外补齐工程化忽略项，
 * 并在最后接入 Prettier 兼容层，避免格式规则互相打架。
 */
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "output/**",
    "build/**",
    "coverage/**",
    ".pnpm-store/**",
    ".husky/_/**",
    "**/next-env.d.ts",
    "rotating-scene-navigator (2)/**",
    "server-demo/**",
  ]),
  eslintConfigPrettier,
]);

export default eslintConfig;
