import type { SiteLocale } from "@/lib/i18n";
import { getDocsCopy } from "@/features/docs/lib/docs-copy";
import { DEFAULT_WORKSPACE_PREFERENCE_SETTINGS } from "@/features/docs/lib/docs-api";
import { buildDocsRootStyle } from "@/features/docs/lib/docs-view";

import { DocsAlert } from "./DocsAlert";
import styles from "./DocsListPage.module.scss";

export function DocsFailurePage({
  body,
  locale,
  title,
}: {
  title: string;
  body: string;
  locale: SiteLocale;
}) {
  const copy = getDocsCopy(locale);

  return (
    <main className={styles.page} style={buildDocsRootStyle(DEFAULT_WORKSPACE_PREFERENCE_SETTINGS)}>
      <div className={styles.stack}>
        <DocsAlert body={body || copy.loading} title={title} tone="error" />
      </div>
    </main>
  );
}
