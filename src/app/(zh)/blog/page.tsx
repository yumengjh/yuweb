import type { Metadata } from "next";

import { buildRouteMetadata } from "@/lib/seo/metadata";

import styles from "./page.module.scss";

export const metadata: Metadata = buildRouteMetadata("zh-CN", "blog");

export default function BlogPage() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>Blog</h1>
        <p className={styles.description}>关于数字设计、前端工程与个人思考的记录。</p>
        <p className={styles.note}>敬请期待。</p>
      </div>
    </main>
  );
}
