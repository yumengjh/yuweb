import styles from "@/app/(zh)/blog/page.module.scss";

export default function Page() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>Technical Notes</h1>
        <p className={styles.description}>
          Personal records around frameworks, engineering, interaction, and implementation details.
        </p>
        <p className={styles.note}>Coming soon.</p>
      </div>
    </main>
  );
}
