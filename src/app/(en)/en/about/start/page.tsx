import styles from "@/app/(zh)/blog/page.module.scss";

export default function Page() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>Start Here</h1>
        <p className={styles.description}>
          If this is your first visit, begin with a few entry points to quickly understand the site.
        </p>
        <p className={styles.note}>Coming soon.</p>
      </div>
    </main>
  );
}
