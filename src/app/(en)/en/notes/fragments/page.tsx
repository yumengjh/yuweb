import styles from "@/app/(zh)/blog/page.module.scss";

export default function Page() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>Fragments</h1>
        <p className={styles.description}>
          Judgments, ideas, and short notes that have not yet grown into articles.
        </p>
        <p className={styles.note}>Coming soon.</p>
      </div>
    </main>
  );
}
