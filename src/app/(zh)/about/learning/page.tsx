import styles from "../../blog/page.module.scss";

export default function Page() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>学习方式</h1>
        <p className={styles.description}>我如何学习、记录、整理，并逐步形成自己的方法。</p>
        <p className={styles.note}>敬请期待。</p>
      </div>
    </main>
  );
}
