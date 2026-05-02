import styles from "../../blog/page.module.scss";

export default function Page() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>最近更新</h1>
        <p className={styles.description}>最近记下的内容、正在延展的问题和新的观察。</p>
        <p className={styles.note}>敬请期待。</p>
      </div>
    </main>
  );
}
