import styles from "../../blog/page.module.scss";

export default function Page() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>当前状态</h1>
        <p className={styles.description}>我正在关注什么、推进什么，以及最近停留的问题。</p>
        <p className={styles.note}>敬请期待。</p>
      </div>
    </main>
  );
}
