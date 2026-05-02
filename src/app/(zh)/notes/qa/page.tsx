import styles from "../../blog/page.module.scss";

export default function Page() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>问题与答案</h1>
        <p className={styles.description}>把遇到的问题、拆解过程与暂时答案保留下来。</p>
        <p className={styles.note}>敬请期待。</p>
      </div>
    </main>
  );
}
