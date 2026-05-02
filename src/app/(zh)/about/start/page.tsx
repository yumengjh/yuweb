import styles from "../../blog/page.module.scss";

export default function Page() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>从这里开始</h1>
        <p className={styles.description}>第一次来到这里，可以先从几个入口快速了解这个网站。</p>
        <p className={styles.note}>敬请期待。</p>
      </div>
    </main>
  );
}
