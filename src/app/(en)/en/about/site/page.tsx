import styles from "@/app/(zh)/blog/page.module.scss";

export default function Page() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>This Site</h1>
        <p className={styles.description}>
          Why this site exists, what it wants to hold, and how it will keep growing.
        </p>
        <p className={styles.note}>Coming soon.</p>
      </div>
    </main>
  );
}
