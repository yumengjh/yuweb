import styles from "../../blog/page.module.scss";

export default function Page() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>代表作品</h1>
        <p className={styles.description}>当前阶段最能代表判断、表达和实现方式的项目。</p>
        <p className={styles.note}>敬请期待。</p>
      </div>
    </main>
  );
}
