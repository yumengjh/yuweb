/**
 * Vitest 全局测试初始化入口。
 *
 * 作用：
 * - 注入 jest-dom 断言扩展
 * - 未来如果要补全局 mock、polyfill，也优先放在这里
 */
import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "0px";
  readonly thresholds = [0];

  disconnect() {}

  observe() {}

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  unobserve() {}
}

vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
