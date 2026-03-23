import Link from "next/link";

import { ThemeToggleButton } from "@/components/theme-toggle/ThemeToggleButton";
import { siteConfig } from "@/lib/site-config";

import styles from "./SiteFooter.module.scss";

export function SiteFooter() {
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
    </footer>
  );
}
