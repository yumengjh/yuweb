"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";

import { ThemeToggleButton } from "@/components/theme-toggle/ThemeToggleButton";
import { getVisibleFooterMetaItems, siteConfig } from "@/lib/site-config";

import styles from "./SiteFooter.module.scss";

const subscribeToHostname = () => () => {};
const getServerHostname = () => "";
const getClientHostname = () => window.location.hostname;

export function SiteFooter() {
  const hostname = useSyncExternalStore(subscribeToHostname, getClientHostname, getServerHostname);
  const metaItems = useMemo(() => getVisibleFooterMetaItems(hostname), [hostname]);

  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.brand}>
          <p className={styles.brandTitle}>{`${siteConfig.name} ${siteConfig.brandLatin}`}</p>
          <p className={styles.brandSummary}>{siteConfig.footer.summary}</p>
        </div>

        <div className={styles.actions}>
          <nav aria-label="页脚导航" className={styles.nav}>
            {siteConfig.footer.links.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>

          <ThemeToggleButton className={styles.themeToggle} />
        </div>
      </div>

      {metaItems.length > 0 && (
        <section aria-label="站点信息" className={styles.metaSection}>
          <ul className={styles.metaList}>
            {metaItems.map((item) => {
              const content = (
                <>
                  {item.label && <span className={styles.metaLabel}>{`${item.label}：`}</span>}
                  <span className={styles.metaText}>{item.text}</span>
                </>
              );

              return (
                <li key={item.id} className={styles.metaItem}>
                  {item.href ? (
                    <Link className={styles.metaLink} href={item.href}>
                      {content}
                    </Link>
                  ) : (
                    <span className={styles.metaContent}>{content}</span>
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
