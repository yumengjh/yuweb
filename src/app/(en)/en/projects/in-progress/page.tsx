import styles from "@/app/(zh)/blog/page.module.scss";

export default function Page() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>Doing Now</h1>
        <p className={styles.description}>
          See the projects and pages currently being pushed forward, iterated on, or refined.
        </p>
        <p className={styles.note}>Coming soon.</p>
      </div>
    </main>
  );
}
