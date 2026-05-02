import styles from "../../blog/page.module.scss";

export default function Page() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>页面实验</h1>
        <p className={styles.description}>一些围绕布局、交互和结构进行的持续实验。</p>
        <p className={styles.note}>敬请期待。</p>
      </div>
    </main>
  );
}
