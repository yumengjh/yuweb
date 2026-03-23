import type { Metadata } from "next";

import { getRouteConfigById, siteConfig } from "@/lib/site-config";

import styles from "./page.module.scss";

const route = getRouteConfigById("blog");

export const metadata: Metadata = {
  title: `${route.title} | ${siteConfig.name}`,
  description: route.description,
};

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
