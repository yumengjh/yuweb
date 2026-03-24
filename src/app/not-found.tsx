import Link from "next/link";
import styles from "./not-found.module.scss";

// ==========================================
// ICONS
// ==========================================

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

// ==========================================
// NOT FOUND PAGE COMPONENT
// ==========================================

export default function NotFound() {
  return (
    <main className={styles.page}>
      <div className={styles.frame}>
        <section className={styles.hero}>
          <header className={styles.heroTop}>
            <span>SYS.ERROR / 404</span>
            <span>STATUS: ORPHANED NODE</span>
          </header>

          <h1 className={styles.heroTitle}>
            404
            <br />
            <span className={styles.heroTitleIndent}>VOID.</span>
          </h1>

          <div className={styles.heroBottom}>
            <div className={styles.heroMeta}>
              <p>
                TARGET <span>未知坐标 / UNKNOWN</span>
              </p>
              <p>
                STATE <span>结构缺失 / UNRESOLVED</span>
              </p>
            </div>

            <div className={styles.heroSummaryWrap}>
              <p className={styles.heroSummary}>
                你试图访问的数字结构已被移除，或从未存在于当前网格体系中。请验证寻址路径，或返回根目录重新建立连接。
              </p>
              <Link href="/" className={styles.actionLink}>
                <ArrowLeftIcon /> RETURN TO ROOT
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
