import styles from "./DocsState.module.scss";

export function DocsEmpty({ description, title }: { title: string; description: string }) {
  return (
    <div className={styles.empty}>
      <p className={styles.emptyTitle}>{title}</p>
      <p className={styles.emptyDescription}>{description}</p>
    </div>
  );
}
