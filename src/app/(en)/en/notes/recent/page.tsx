import styles from "@/app/(zh)/blog/page.module.scss";

export default function Page() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>Recent Updates</h1>
        <p className={styles.description}>
          The content I recently wrote down, problems I am extending, and new observations.
        </p>
        <p className={styles.note}>Coming soon.</p>
      </div>
    </main>
  );
}
