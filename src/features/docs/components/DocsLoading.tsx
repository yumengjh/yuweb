import styles from "./DocsState.module.scss";

export function DocsLoading({ label }: { label: string }) {
  return (
    <div className={styles.loadingWrap}>
      <div className={styles.loadingInner}>
        <span aria-hidden="true" className={styles.spinner} />
        <span>{label}</span>
      </div>
    </div>
  );
}
