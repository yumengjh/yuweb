import styles from "@/app/(zh)/blog/page.module.scss";

export default function Page() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>Learning Log</h1>
        <p className={styles.description}>
          What I am learning, stage-based understanding, and path organization.
        </p>
        <p className={styles.note}>Coming soon.</p>
      </div>
    </main>
  );
}
