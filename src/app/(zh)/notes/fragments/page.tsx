import styles from "../../blog/page.module.scss";

export default function Page() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>灵感碎片</h1>
        <p className={styles.description}>一些还没长成文章的判断、想法和短促记录。</p>
        <p className={styles.note}>敬请期待。</p>
      </div>
    </main>
  );
}
