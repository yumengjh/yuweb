import styles from "../../blog/page.module.scss";

export default function Page() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>开源项目</h1>
        <p className={styles.description}>已公开的仓库、工具与可以继续查看的实现记录。</p>
        <p className={styles.note}>敬请期待。</p>
      </div>
    </main>
  );
}
