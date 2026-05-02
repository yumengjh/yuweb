import styles from "@/app/(zh)/blog/page.module.scss";

export default function Page() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>Featured Work</h1>
        <p className={styles.description}>The projects that best represent my judgment, expression, and execution at this stage.</p>
        <p className={styles.note}>Coming soon.</p>
      </div>
    </main>
  );
}
