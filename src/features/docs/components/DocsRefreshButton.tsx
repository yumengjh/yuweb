"use client";

import { useRouter } from "next/navigation";

import styles from "./DocsState.module.scss";

export function DocsRefreshButton({ label }: { label: string }) {
  const router = useRouter();

  return (
    <button className={styles.button} type="button" onClick={() => router.refresh()}>
      {label}
    </button>
  );
}
