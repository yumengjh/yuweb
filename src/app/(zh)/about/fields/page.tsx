import styles from "../../blog/page.module.scss";

export default function Page() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>关注领域</h1>
        <p className={styles.description}>长期关心的技术、设计、结构和表达方向。</p>
        <p className={styles.note}>敬请期待。</p>
      </div>
    </main>
  );
}
