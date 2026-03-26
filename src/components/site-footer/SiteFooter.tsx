"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";

import { createTranslator, localizeHref, type SiteLocale } from "@/lib/i18n";
import { matchesDomainRule, siteConfig, type SiteFooterMetaItemConfig } from "@/lib/site-config";

import { LanguageToggleButton } from "../language-toggle/LanguageToggleButton";
import { ThemeToggleButton } from "../theme-toggle/ThemeToggleButton";
import styles from "./SiteFooter.module.scss";

const subscribeToHostname = () => () => {};
const getServerHostname = () => "";
const getClientHostname = () => window.location.hostname;

export function SiteFooter({ locale }: { locale: SiteLocale }) {
  const hostname = useSyncExternalStore(subscribeToHostname, getClientHostname, getServerHostname);
  const t = createTranslator(locale);
  const metaItems = useMemo(
    () =>
      (siteConfig.footer.metaItems as readonly SiteFooterMetaItemConfig[]).filter((item) =>
        matchesDomainRule(hostname, item.domains),
      ),
    [hostname],
  );

  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.brand}>
          <p className={styles.brandTitle}>{`${t(siteConfig.identity.name)} ${siteConfig.identity.brandLatin}`}</p>
          <p className={styles.brandSummary}>{t(siteConfig.footer.summary)}</p>
        </div>

        <div className={styles.actions}>
          {siteConfig.footer.links.length > 0 && (
            <nav aria-label={t(siteConfig.footer.navAriaLabel)} className={styles.nav}>
              {siteConfig.footer.links.map((link) => (
                <Link key={link.href} href={localizeHref(link.href, locale)}>
                  {t(link.label)}
                </Link>
              ))}
            </nav>
          )}

          <div className={styles.controlGroup}>
            <ThemeToggleButton className={styles.themeToggle} locale={locale} />
            <LanguageToggleButton className={styles.languageToggle} locale={locale} />
          </div>
        </div>
      </div>

      {metaItems.length > 0 && (
        <section aria-label={t(siteConfig.footer.metaAriaLabel)} className={styles.metaSection}>
          <ul className={styles.metaList}>
            {metaItems.map((item) => {
              const contentNode = (
                <>
                  {item.label && (
                    <span className={styles.metaLabel}>{`${t(item.label)}：`}</span>
                  )}
                  <span className={styles.metaText}>{t(item.text)}</span>
                </>
              );

              return (
                <li key={item.id} className={styles.metaItem}>
                  {item.href ? (
                    <Link className={styles.metaLink} href={item.href}>
                      {contentNode}
                    </Link>
                  ) : (
                    <span className={styles.metaContent}>{contentNode}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </footer>
  );
}
