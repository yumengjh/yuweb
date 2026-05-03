import styles from "@/app/(zh)/blog/page.module.scss";

export default function Page() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>Questions & Answers</h1>
        <p className={styles.description}>
          Preserve the problems I encountered, how I broke them down, and the temporary answers.
        </p>
        <p className={styles.note}>Coming soon.</p>
      </div>
    </main>
  );
}
