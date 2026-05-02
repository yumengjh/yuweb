import styles from "../../blog/page.module.scss";

export default function Page() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>技术笔记</h1>
        <p className={styles.description}>围绕框架、工程、交互与实现细节展开的个人记录。</p>
        <p className={styles.note}>敬请期待。</p>
      </div>
    </main>
  );
}
