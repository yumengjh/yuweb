import styles from "@/app/(zh)/blog/page.module.scss";

export default function Page() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>How I Learn</h1>
        <p className={styles.description}>How I learn, record, organize, and gradually form my own methods.</p>
        <p className={styles.note}>Coming soon.</p>
      </div>
    </main>
  );
}
