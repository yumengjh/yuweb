import styles from "@/app/(zh)/blog/page.module.scss";

export default function Page() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>Fields of Interest</h1>
        <p className={styles.description}>The long-term directions in technology, design, structure, and expression that I care about.</p>
        <p className={styles.note}>Coming soon.</p>
      </div>
    </main>
  );
}
