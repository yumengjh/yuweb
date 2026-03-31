import { cn } from "@/utils/cn";

import styles from "./DocsState.module.scss";

export function DocsAlert({
  body,
  title,
  tone = "error",
}: {
  title: string;
  body: string;
  tone?: "warning" | "error";
}) {
  return (
    <div
      className={cn(styles.alert, tone === "warning" ? styles.alertWarning : styles.alertError)}
      role="alert"
    >
      <p className={styles.alertTitle}>{title}</p>
      <p className={styles.alertBody}>{body}</p>
    </div>
  );
}
