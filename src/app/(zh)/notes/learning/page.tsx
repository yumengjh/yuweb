import styles from "../../blog/page.module.scss";

export default function Page() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>学习记录</h1>
        <p className={styles.description}>正在学习的内容、阶段性理解与路径整理。</p>
        <p className={styles.note}>敬请期待。</p>
      </div>
    </main>
  );
}
