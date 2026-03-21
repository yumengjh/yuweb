import path from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

/**
 * Vitest 配置。
 *
 * 作用：
 * - 复用 `@/` 路径别名
 * - 指定 jsdom 作为组件测试环境
 * - 注入全局 setup 与 coverage 配置
 *
 * 建议：
 * 如果后续要拆分 unit / component 测试策略，可以从这里继续扩展 include、exclude 和 coverage 规则。
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
  },
});
