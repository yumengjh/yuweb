import styles from "@/app/(zh)/blog/page.module.scss";

export default function Page() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>Page Experiments</h1>
        <p className={styles.description}>
          Ongoing experiments around layout, interaction, and structure.
        </p>
        <p className={styles.note}>Coming soon.</p>
      </div>
    </main>
  );
}
