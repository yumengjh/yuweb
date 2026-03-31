import type { SiteLocale } from "@/lib/i18n";
import { getDocsCopy } from "@/features/docs/lib/docs-copy";
import type { DocsListPageData } from "@/features/docs/lib/docs-page-data";
import { buildDocsRootStyle } from "@/features/docs/lib/docs-view";

import { DocCard } from "./DocCard";
import { DocsAlert } from "./DocsAlert";
import { DocsEmpty } from "./DocsEmpty";
import { DocsRefreshButton } from "./DocsRefreshButton";
import styles from "./DocsListPage.module.scss";

export function DocsListPage({ data, locale }: { data: DocsListPageData; locale: SiteLocale }) {
  const copy = getDocsCopy(locale);
  const workspaceTitle = data.workspace?.name?.trim() || data.workspaceId || copy.unknownWorkspace;
  const workspaceIcon = data.workspace?.icon?.trim() || "??";
  const workspaceDescription =
    data.workspace?.description?.trim() || copy.unknownWorkspaceDescription;
  const ownerDisplayName =
    data.ownerProfile?.displayName?.trim() ||
    data.ownerProfile?.username?.trim() ||
    copy.unknownUser;

  return (
    <main className={styles.page} style={buildDocsRootStyle(data.settings)}>
      <header className={styles.hero}>
        <div className={styles.heroMain}>
          <div className={styles.titleRow}>
            <div className={styles.avatar}>{workspaceIcon}</div>
            <h1 className={styles.title}>{workspaceTitle}</h1>
          </div>
          <p className={styles.description}>{workspaceDescription}</p>
        </div>

        <div className={styles.heroSide}>
          <div className={styles.ownerCard}>
            <div className={styles.ownerRow}>
              <span className={styles.ownerLabel}>{copy.workspaceOwnerLabel}</span>
              <span className={styles.ownerName}>{ownerDisplayName}</span>
            </div>
          </div>
          <DocsRefreshButton label={copy.refreshList} />
        </div>
      </header>

      <div className={styles.stack}>
        {data.workspaceError ? (
          <DocsAlert
            body={data.workspaceError.message}
            title={copy.workspaceLoadFailedTitle}
            tone="warning"
          />
        ) : null}

        {data.docsError ? (
          <DocsAlert body={data.docsError.message} title={copy.listLoadFailedTitle} tone="error" />
        ) : data.docs.length === 0 ? (
          <DocsEmpty description={copy.emptyDocs} title={copy.emptyTitle} />
        ) : (
          <div className={styles.grid}>
            {data.docs.map((doc) => (
              <DocCard key={doc.docId} doc={doc} locale={locale} tagMap={data.tagMap} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
