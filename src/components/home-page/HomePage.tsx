import Link from "next/link";

import { createTranslator, localizeHref, type SiteLocale } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";

import styles from "@/app/page.module.scss";

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.iconArrow}
    >
      <path d="M1 11L11 1M11 1H3M11 1V9" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function CapabilityIcon({ kind }: { kind: string }) {
  const sw = "1";

  switch (kind) {
    case "arch":
      return (
        <svg viewBox="0 0 12 12">
          <path
            d="M1 11V6l5-5 5 5v5M3 11V8h6v3"
            fill="none"
            stroke="currentColor"
            strokeWidth={sw}
          />
        </svg>
      );
    case "logic":
      return (
        <svg viewBox="0 0 12 12">
          <rect
            x="1"
            y="1"
            width="10"
            height="10"
            fill="none"
            stroke="currentColor"
            strokeWidth={sw}
          />
          <circle cx="6" cy="6" r="2" fill="currentColor" />
        </svg>
      );
    case "server":
      return (
        <svg viewBox="0 0 12 12">
          <rect
            x="1"
            y="2"
            width="10"
            height="3"
            fill="none"
            stroke="currentColor"
            strokeWidth={sw}
          />
          <rect
            x="1"
            y="7"
            width="10"
            height="3"
            fill="none"
            stroke="currentColor"
            strokeWidth={sw}
          />
        </svg>
      );
    case "optimize":
      return (
        <svg viewBox="0 0 12 12">
          <circle cx="6" cy="6" r="5" fill="none" stroke="currentColor" strokeWidth={sw} />
          <path d="M6 1v3M6 8v3M1 6h3M8 6h3" stroke="currentColor" strokeWidth={sw} />
        </svg>
      );
    default:
      return null;
  }
}

export function HomePage({ locale }: { locale: SiteLocale }) {
  const t = createTranslator(locale);
  const homePage = siteConfig.homePage;

  return (
    <main className={styles.page}>
      <div className={styles.frame}>
        <section className={styles.hero}>
          <header className={styles.heroTop}>
            <span>{t(homePage.hero.topLeft)}</span>
            <span>{t(homePage.hero.topRight)}</span>
          </header>

          <h1 className={styles.heroTitle}>
            {t(homePage.hero.title)}
            <br />
            <span className={styles.heroTitleIndent}>{t(homePage.hero.titleAccent)}</span>
          </h1>

          <div className={styles.heroBottom}>
            <div className={styles.heroMeta}>
              <p>
                {t(homePage.hero.focusLabel)} <span>{t(homePage.hero.focusValue)}</span>
              </p>
              <p>
                {t(homePage.hero.modeLabel)} <span>{t(homePage.hero.modeValue)}</span>
              </p>
              <p>
                {t(homePage.hero.statusLabel)} <span>{t(homePage.hero.statusValue)}</span>
              </p>
            </div>
            <p className={styles.heroSummary}>{t(homePage.hero.summary)}</p>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>{t(homePage.sectionTitles.philosophy)}</span>
            <div className={styles.sectionLine}></div>
          </div>
          <div className={styles.philosophyContent}>
            <h2 className={styles.statementTitle}>{t(homePage.philosophy.title)}</h2>
            <div className={styles.statementText}>
              {homePage.philosophy.paragraphs.map((paragraph) => (
                <p key={paragraph}>{t(paragraph)}</p>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>{t(homePage.sectionTitles.capabilities)}</span>
            <div className={styles.sectionLine}></div>
          </div>
          <div className={styles.capGridFull}>
            {homePage.capabilities.map((item, index) => (
              <article key={`${item.title}-${item.icon}`} className={styles.capCard}>
                <div className={styles.capTop}>
                  <div className={styles.capIndex}>{(index + 1).toString().padStart(2, "0")}</div>
                  <div className={styles.capIcon}>
                    <CapabilityIcon kind={item.icon} />
                  </div>
                </div>
                <div className={styles.capBottom}>
                  <div className={styles.capEyebrow}>{t(item.eyebrow)}</div>
                  <h3 className={styles.capTitle}>{t(item.title)}</h3>
                  <div className={styles.capDesc}>{t(item.desc)}</div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>{t(homePage.sectionTitles.works)}</span>
            <div className={styles.sectionLine}></div>
          </div>
          <div className={styles.projectZigZag}>
            {homePage.works.map((work) => (
              <Link
                key={work.title}
                href={localizeHref("/curations", locale)}
                className={`${styles.projectBlock} ${work.align === "right" ? styles.projectReverse : ""}`}
              >
                <div
                  className={`${styles.projectVisual} ${work.visual === "light" ? styles.visualLight : styles.visualDark}`}
                >
                  {work.visual === "light" ? (
                    <>
                      <div className={styles.artCircle}></div>
                      <div className={styles.artGrid}></div>
                    </>
                  ) : (
                    <div className={styles.artLines}></div>
                  )}
                </div>
                <div className={styles.projectInfo}>
                  <div className={styles.projectMetaWrap}>
                    <p className={styles.projectYear}>{work.year}</p>
                    <p className={styles.projectSys}>SYS.{work.visual.toUpperCase()}</p>
                  </div>
                  <h2>
                    {t(work.title)} / {t(work.type)}
                  </h2>
                  <span className={styles.actionLink}>
                    {t(homePage.links.exploreCase)} <ArrowIcon />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>{t(homePage.sectionTitles.gears)}</span>
            <div className={styles.sectionLine}></div>
          </div>
          <div className={styles.gearGridFull}>
            {homePage.gears.map((gear) => (
              <div key={`${gear.category}-${gear.name}`} className={styles.gearCard}>
                <div className={styles.gearCategory}>SYS.{gear.category}</div>
                <h3 className={styles.gearName}>{gear.name}</h3>
                <div className={styles.gearSpec}>{gear.spec}</div>
                <p className={styles.gearDesc}>{t(gear.desc)}</p>
              </div>
            ))}
          </div>
          <div className={styles.centerLinkWrap}>
            <Link href={localizeHref("/workspace", locale)} className={styles.sectionFooterLink}>
              {t(homePage.links.hardwareInventory)} <ArrowIcon />
            </Link>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>{t(homePage.sectionTitles.archive)}</span>
            <div className={styles.sectionLine}></div>
          </div>
          <div className={styles.bookListFull}>
            <div className={styles.bookHeader}>
              <span>{t(homePage.table.refId)}</span>
              <span>{t(homePage.table.title)}</span>
              <span>{t(homePage.table.author)}</span>
              <span>{t(homePage.table.year)}</span>
            </div>
            {homePage.books.map((book) => (
              <div key={book.id} className={styles.bookRow}>
                <span className={styles.bookId}>{book.id}</span>
                <span className={styles.bookTitle}>{book.title}</span>
                <span className={styles.bookAuthor}>{book.author}</span>
                <span className={styles.bookYear}>{book.year}</span>
              </div>
            ))}
          </div>
          <div className={styles.centerLinkWrap}>
            <Link href={localizeHref("/library", locale)} className={styles.sectionFooterLink}>
              {t(homePage.links.completeLibrary)} <ArrowIcon />
            </Link>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionLabelFull}>{t(homePage.sectionTitles.experience)}</div>
          <div className={styles.fullWidthList}>
            {homePage.experiences.map((item) => (
              <Link
                key={`${item.period}-${item.title}`}
                href={localizeHref("/journey", locale)}
                className={styles.expItemFull}
              >
                <time className={styles.listEyebrow}>{t(item.period)}</time>
                <h3 className={styles.listTitle}>{t(item.title)}</h3>
                <div className={styles.listDesc}>{t(item.company)}</div>
                <div className={styles.listAction}>
                  <ArrowIcon />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
