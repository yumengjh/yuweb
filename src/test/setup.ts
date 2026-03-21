/**
 * Vitest 全局测试初始化入口。
 *
 * 作用：
 * - 注入 jest-dom 断言扩展
 * - 未来如果要补全局 mock、polyfill，也优先放在这里
 */
import "@testing-library/jest-dom/vitest";
