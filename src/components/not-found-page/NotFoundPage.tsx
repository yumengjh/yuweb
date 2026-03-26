import Link from "next/link";

import { createTranslator, localizeHref, type SiteLocale } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";

import styles from "@/app/not-found.module.scss";

function ArrowLeftIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.iconArrow}
    >
      <path d="M11 6H1M1 6L5 2M1 6L5 10" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function NotFoundPage({ locale }: { locale: SiteLocale }) {
  const t = createTranslator(locale);
  const content = siteConfig.notFoundPage;

  return (
    <main className={styles.page}>
      <div className={styles.frame}>
        <section className={styles.hero}>
          <header className={styles.heroTop}>
            <span>{t(content.heroTopLeft)}</span>
            <span>{t(content.heroTopRight)}</span>
          </header>

          <h1 className={styles.heroTitle}>
            {t(content.title)}
            <br />
            <span className={styles.heroTitleIndent}>{t(content.titleAccent)}</span>
          </h1>

          <div className={styles.heroBottom}>
            <div className={styles.heroMeta}>
              <p>
                {t(content.targetLabel)} <span>{t(content.targetValue)}</span>
              </p>
              <p>
                {t(content.stateLabel)} <span>{t(content.stateValue)}</span>
              </p>
            </div>

            <div className={styles.heroSummaryWrap}>
              <p className={styles.heroSummary}>{t(content.summary)}</p>
              <Link href={localizeHref("/", locale)} className={styles.actionLink}>
                <ArrowLeftIcon /> {t(content.actionLabel)}
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.visualSection}>
          <div className={styles.errorVisual}>
            <div className={styles.artCrosshair}></div>
            <div className={styles.artGrid}></div>
            <div className={styles.artCirclePulse}></div>
          </div>
        </section>
      </div>
    </main>
  );
}
