// cspell:words avator
import Link from "next/link";
// cspell:words Compressa

import { HeroSummaryRotating } from "@/components/home-page/HeroSummaryRotating";
import { Marquee, type MarqueeDirection } from "@/components/common/marquee/Marquee";
// import SplashCursor from "@/components/SplashCursor/SplashCursor";
import { StickerPeel } from "@/components/sticker-peel";
import { TechLogoLoop } from "@/components/home-page/TechLogoLoop";
import { TextPressure } from "@/components/common/text-pressure/TextPressure";
import { createTranslator, getLocaleValue, localizeHref, type SiteLocale } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";
import styles from "@/app/page.module.scss";

const heroTitleAccentTuning = {
  minFontSize: 48,
  strokeWidth: 2.4,
  widthRange: [78, 188] as const,
  weightRange: [820, 900] as const,
  italicRange: [0.02, 0.8] as const,
  smoothing: 11,
} as const;

const heroSummaryRotatingCopy = {
  "zh-CN": {
    prefix: "我是一名",
    roles: ["数字建筑师", "程序员", "前端工程师", "全栈工程师", "界面系统设计师", "视觉开发工程师"],
    suffix:
      "。我把界面当作一种被精确构筑的结构空间来设计：逻辑先行，留白承重。拒绝无意义的装饰，让每一行代码和每一个像素都服务于秩序与稳定感。",
  },
  "en-US": {
    prefix: "I work as a ",
    roles: [
      "digital architect",
      "frontend engineer",
      "interface systems designer",
      "visual developer",
    ],
    suffix:
      ". I design interfaces as deliberate digital architecture: logic first, whitespace load-bearing, and every line of code or pixel aligned to structure, rhythm, and stability.",
  },
} as const;

const heroSummaryRotatingTuning = {
  rotationInterval: 2600,
  staggerDuration: 0.03,
  staggerFrom: "center" as const,
  initial: { y: "100%", opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: "-120%", opacity: 0 },
  transition: { type: "spring", damping: 30, stiffness: 400 } as const,
};

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
  const heroSummaryCopy = heroSummaryRotatingCopy[locale] ?? heroSummaryRotatingCopy["en-US"];
  const renderMarquee = (config: (typeof homePage.marquees)[keyof typeof homePage.marquees]) => {
    const items = getLocaleValue<string[]>(locale, config.itemsPath) ?? [];

    return (
      <Marquee
        items={items}
        separator={t(config.separator)}
        speed={config.speed}
        gap={config.gap}
        direction={config.direction as MarqueeDirection}
        pauseOnHover={config.pauseOnHover}
      />
    );
  };
  void renderMarquee;

  return (
    <main className={styles.page}>
      {/* <SplashCursor /> */}
      <StickerPeel imageSrc="/image/avator01.png" alt="Homepage avatar sticker" />
      <StickerPeel
        imageSrc="/image/66af996a9e55f1ee29f117ab.png"
        alt="Homepage avatar sticker"
        config={{
          responsiveConfigs: [
            {
              name: "desktop",
              minWidth: 1025,
              overrides: {
                width: 168, // 大小
                rotate: 1, // 整体角度
                peelBackHoverPct: 28, // 悬停时折起程度
                peelBackActivePct: 42, // 按下时折起程度
                initialPosition: {
                  x: 200, // 初始位置 x
                  y: 400, // 初始位置 y
                },
              },
            },
            {
              name: "mobile",
              maxWidth: 767,
              overrides: {
                width: 96,
                rotate: 10,
                peelBackHoverPct: 24,
                peelBackActivePct: 36,
                initialPosition: {
                  x: 300,
                  y: 300,
                },
              },
            },
          ],
        }}
      />
      <StickerPeel
        imageSrc="/image/react-bits-sticker-DuQtTs-F.png"
        alt="Homepage avatar sticker"
        config={{
          responsiveConfigs: [
            {
              name: "desktop",
              minWidth: 1025,
              overrides: {
                width: 168, // 大小
                rotate: 10, // 整体角度
                peelBackHoverPct: 28, // 悬停时折起程度
                peelBackActivePct: 42, // 按下时折起程度
                initialPosition: {
                  x: 1450, // 初始位置 x
                  y: 380, // 初始位置 y
                },
              },
            },
            {
              name: "mobile",
              maxWidth: 767,
              overrides: {
                width: 96,
                // TODO: 旋转角度会影响贴纸的边缘被裁切，目前先调整为一个较小的角度，后续可以考虑增加一个参数来微调贴纸的位置以适配旋转
                rotate: 20,
                peelBackHoverPct: 24,
                peelBackActivePct: 36,
                initialPosition: {
                  x: 30,
                  y: 310,
                },
              },
            },
            {
              name: "tablet",
              minWidth: 768,
              maxWidth: 1024,
              overrides: {
                width: 140,
                rotate: 1,
                peelBackHoverPct: 28,
                peelBackActivePct: 36,
                initialPosition: {
                  x: 30,
                  y: 310,
                },
              },
            },
          ],
        }}
      />
      <div className={styles.frame}>
        <section className={styles.hero}>
          <header className={styles.heroTop}>
            <span>{t(homePage.hero.topLeft)}</span>
            <span>{t(homePage.hero.topRight)}</span>
          </header>

          <div className={styles.heroTitle}>
            <div className={styles.heroTitleCopy}>
              <h1 className={styles.heroTitlePrimary}>{t(homePage.hero.title)}</h1>
              <div className={styles.heroTitleAccentWrap}>
                <TextPressure
                  text={t(homePage.hero.titleAccent)}
                  className={styles.heroTitleAccent}
                  fontUrl="/fonts/CompressaPRO-GX.woff2"
                  stroke
                  textColor="transparent"
                  strokeColor="var(--c-ink-strong)"
                  renderTitleAs="div"
                  {...heroTitleAccentTuning}
                />
              </div>
            </div>
          </div>

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
            <HeroSummaryRotating
              className={styles.heroSummary}
              prefix={heroSummaryCopy.prefix}
              suffix={heroSummaryCopy.suffix}
              texts={heroSummaryCopy.roles}
              segmenterLocale={locale}
              rotatingClassName={styles.heroSummaryRotating}
              rotatingSplitClassName={styles.heroSummaryRotatingSplit}
              rotatingElementClassName={styles.heroSummaryRotatingElement}
              {...heroSummaryRotatingTuning}
            />
          </div>
        </section>

        {/* {renderMarquee(homePage.marquees.afterHero)} */}
        <TechLogoLoop />

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

        {renderMarquee(homePage.marquees.afterPhilosophy)}

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

        {/* {renderMarquee(homePage.marquees.afterCapabilities)} */}

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

        {/* {renderMarquee(homePage.marquees.afterWorks)} */}

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

        {/* {renderMarquee(homePage.marquees.afterGears)} */}

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

        {/* {renderMarquee(homePage.marquees.afterArchive)} */}

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
