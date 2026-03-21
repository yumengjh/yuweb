import { TopNavigationBar } from "@/components/top-navigation-bar/TopNavigationBar";

import styles from "./PagePlaceholder.module.scss";

type NavigationKey = "about" | "stack" | "curations" | "journey";

type PagePlaceholderProps = {
  activeKey?: NavigationKey;
  title: string;
};

export function PagePlaceholder({ activeKey, title }: PagePlaceholderProps) {
  return (
    <main className={styles.page}>
      <TopNavigationBar activeKey={activeKey} />
      <section className={styles.hero}>
        <h1 className={styles.title}>{title} 页面</h1>
      </section>
    </main>
  );
}
