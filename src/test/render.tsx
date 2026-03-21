/**
 * 测试渲染入口。
 *
 * 当前先直接导出 Testing Library 的 render。
 * 建议：
 * 如果后续项目接入 ThemeProvider、QueryClientProvider、Router mock 等，
 * 可以统一在这里封装 `renderWithProviders`，避免每个测试重复写 Provider。
 */
export * from "@testing-library/react";
export { render } from "@testing-library/react";
