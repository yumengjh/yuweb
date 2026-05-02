import styles from "@/app/(zh)/blog/page.module.scss";

export default function Page() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>Current State</h1>
        <p className={styles.description}>What I am focusing on, moving forward, and the questions I have been staying with lately.</p>
        <p className={styles.note}>Coming soon.</p>
      </div>
    </main>
  );
}
