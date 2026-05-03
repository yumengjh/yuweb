import styles from "@/app/(zh)/blog/page.module.scss";

export default function Page() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>Stack</h1>
        <p className={styles.description}>
          See the tools, frameworks, and page-system organization I currently use.
        </p>
        <p className={styles.note}>Coming soon.</p>
      </div>
    </main>
  );
}
