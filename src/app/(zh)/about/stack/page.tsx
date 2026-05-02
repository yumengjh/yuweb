import styles from "../../blog/page.module.scss";

export default function Page() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>技术栈</h1>
        <p className={styles.description}>查看目前使用的工具、框架与页面系统组织方式。</p>
        <p className={styles.note}>敬请期待。</p>
      </div>
    </main>
  );
}
