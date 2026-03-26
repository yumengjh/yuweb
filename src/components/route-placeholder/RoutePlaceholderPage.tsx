import { createTranslator, type SiteLocale } from "@/lib/i18n";
import { siteConfig, type AppRouteId } from "@/lib/site-config";

import styles from "@/app/blog/page.module.scss";

export function RoutePlaceholderPage({
  locale,
  routeId,
}: {
  locale: SiteLocale;
  routeId: AppRouteId;
}) {
  const t = createTranslator(locale);

  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>{t(siteConfig.routeMeta[routeId].title)}</h1>
        <p className={styles.description}>{t(siteConfig.comingSoonPage.description)}</p>
        <p className={styles.note}>{t(siteConfig.comingSoonPage.note)}</p>
      </div>
    </main>
  );
}
