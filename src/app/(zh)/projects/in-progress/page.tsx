import styles from "../../blog/page.module.scss";

export default function Page() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>正在做的事</h1>
        <p className={styles.description}>查看目前仍在推进、迭代或打磨中的项目与页面。</p>
        <p className={styles.note}>敬请期待。</p>
      </div>
    </main>
  );
}
