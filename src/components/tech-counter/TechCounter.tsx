"use client";

import { useState } from "react";

import styles from "./TechCounter.module.scss";

/**
 * 模板默认技术组件。
 *
 * 作用：
 * - 作为根路径的极简默认内容
 * - 作为模板内置的基础交互测试样例
 */
export function TechCounter() {
  const [count, setCount] = useState(0);

  return (
    <button
      type="button"
      className={styles.button}
      onClick={() => setCount((current) => current + 1)}
    >
      {count}
    </button>
  );
}
