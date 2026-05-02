import styles from "../../blog/page.module.scss";

export default function Page() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>这个网站</h1>
        <p className={styles.description}>为什么会有这个网站，它想承载什么，又会如何继续生长。</p>
        <p className={styles.note}>敬请期待。</p>
      </div>
    </main>
  );
}
