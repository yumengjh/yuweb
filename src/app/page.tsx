import type { Metadata } from "next";
import Link from "next/link";

import { getRouteConfigById, siteConfig } from "@/lib/site-config";
import styles from "./page.module.scss";

// ==========================================
// DATA INVENTORY
// ==========================================

const capabilities = [
  {
    title: "前端架构",
    eyebrow: "Architecture",
    icon: "arch",
    desc: "框架工程 / 样式系统 / 类型约束",
  },
  {
    title: "视觉逻辑",
    eyebrow: "Visual Logic",
    icon: "logic",
    desc: "设计原则 / 字体编排 / 几何构图",
  },
  {
    title: "服务集成",
    eyebrow: "Integration",
    icon: "server",
    desc: "运行环境 / 接口结构 / 云端部署",
  },
  {
    title: "性能优化",
    eyebrow: "Optimization",
    icon: "optimize",
    desc: "性能体检 / 资源压缩 / 核心指标",
  },
] as const;

const works = [
  { year: "2024", title: "矩构系统", type: "桌面环境概念", visual: "light", align: "left" },
  { year: "2023", title: "网格索引", type: "复杂元数据架构", visual: "dark", align: "right" },
] as const;

const experiences = [
  { period: "2023 — PRES", title: "首席架构师", company: "鱼梦江湖数字工作室" },
  { period: "2021 — 2023", title: "高级界面工程师", company: "结构实验室" },
  { period: "2019 — 2021", title: "视觉开发工程师", company: "核心系统公司" },
] as const;

// 物理工作流（设备）
const gears = [
  {
    category: "COMPUTE",
    name: "MacBook Pro 16",
    spec: "M3 Max / 64GB / 2TB",
    desc: "核心演算节点与移动编译中心",
  },
  {
    category: "DISPLAY",
    name: "Apple Studio Display",
    spec: "5K Retina / Nano-texture",
    desc: "精准像素映射与色彩还原",
  },
  {
    category: "INPUT",
    name: "HHKB Pro HYBRID",
    spec: "Topre Switches / Type-S",
    desc: "极简键位布局与线性敲击反馈",
  },
  {
    category: "SUPPORT",
    name: "Herman Miller Aeron",
    spec: "Size B / PostureFit SL",
    desc: "人体工学基座与重力卸载",
  },
] as const;

// 思维存档（书籍）
const books = [
  {
    id: "B-01",
    title: "Grid Systems in Graphic Design",
    author: "Josef Müller-Brockmann",
    year: "1981",
  },
  { id: "B-02", title: "The Design of Everyday Things", author: "Don Norman", year: "1988" },
  { id: "B-03", title: "Clean Architecture", author: "Robert C. Martin", year: "2017" },
  { id: "B-04", title: "Refactoring UI", author: "Adam Wathan & Steve Schoger", year: "2018" },
] as const;

const homeRoute = getRouteConfigById("home");

export const metadata: Metadata = {
  title: siteConfig.name,
  description: homeRoute.description,
};

// ==========================================
// ICONS
// ==========================================

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

// ==========================================
// PAGE COMPONENT
// ==========================================

export default function HomePage() {
  return (
    <main className={styles.page}>
      <div className={styles.frame}>
        {/* ==========================================
            HERO: 绝对保留，不作任何改动
            ========================================== */}
        <section className={styles.hero}>
          <header className={styles.heroTop}>
            <span>INDEX / FULL INVENTORY</span>
            <span>SHANGHAI, CN</span>
          </header>

          <h1 className={styles.heroTitle}>
            鱼梦江湖
            <br />
            <span className={styles.heroTitleIndent}>YUMENGJH.</span>
          </h1>

          <div className={styles.heroBottom}>
            <div className={styles.heroMeta}>
              <p>
                FOCUS <span>界面系统 / UI Engineering</span>
              </p>
              <p>
                MODE <span>设计与代码 / Design & Code</span>
              </p>
              <p>
                STATUS <span>开放合作 / Available</span>
              </p>
            </div>
            <p className={styles.heroSummary}>
              我是一名数字建筑师。我把界面当作一种被精确构筑的结构空间来设计：逻辑先行，留白承重。拒绝无意义的装饰，让每一行代码和每一个像素都服务于秩序与稳定感。
            </p>
          </div>
        </section>

        {/* ==========================================
            [01] 理念: 居中宣言式排版 (打破左对齐)
            ========================================== */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>[01] PHILOSOPHY</span>
            <div className={styles.sectionLine}></div>
          </div>
          <div className={styles.philosophyContent}>
            <h2 className={styles.statementTitle}>空间、逻辑与数字秩序。</h2>
            <div className={styles.statementText}>
              <p>
                在“数字建筑师”的语境里，屏幕并不只是一个平面画布，而是一种可被组织、可被推演的物理环境。留白不是空缺，而是决定节奏与层级的承重材料。
              </p>
              <p>
                我信奉系统思维取代堆叠，追求用最少的 DOM
                结构表达最清晰的信息层次。所有的美感都应建立在清晰、克制与绝对的几何对齐之上。
              </p>
            </div>
          </div>
        </section>

        {/* ==========================================
            [02] 能力: 贯穿全宽的三分屏矩阵
            ========================================== */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>[02] CAPABILITIES</span>
            <div className={styles.sectionLine}></div>
          </div>
          <div className={styles.capGridFull}>
            {capabilities.map((item, index) => (
              <article key={item.title} className={styles.capCard}>
                <div className={styles.capTop}>
                  <div className={styles.capIndex}>{(index + 1).toString().padStart(2, "0")}</div>
                  <div className={styles.capIcon}>
                    <CapabilityIcon kind={item.icon} />
                  </div>
                </div>
                <div className={styles.capBottom}>
                  <div className={styles.capEyebrow}>{item.eyebrow}</div>
                  <h3 className={styles.capTitle}>{item.title}</h3>
                  <div className={styles.capDesc}>{item.desc}</div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ==========================================
            [03] 作品: 左右交错排版 (Zig-Zag)
            ========================================== */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>[03] SELECTED WORKS</span>
            <div className={styles.sectionLine}></div>
          </div>
          <div className={styles.projectZigZag}>
            {works.map((work) => (
              <Link
                key={work.title}
                href="/curations"
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
                    <>
                      <div className={styles.artLines}></div>
                    </>
                  )}
                </div>
                <div className={styles.projectInfo}>
                  <div className={styles.projectMetaWrap}>
                    <p className={styles.projectYear}>{work.year}</p>
                    <p className={styles.projectSys}>SYS.{work.visual.toUpperCase()}</p>
                  </div>
                  <h2>
                    {work.title} / {work.type}
                  </h2>
                  <span className={styles.actionLink}>
                    EXPLORE CASE <ArrowIcon />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ==========================================
            [04] 物理设备: 全宽 4 列陈列柜
            ========================================== */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>[04] PHYSICAL GEARS</span>
            <div className={styles.sectionLine}></div>
          </div>
          <div className={styles.gearGridFull}>
            {gears.map((gear) => (
              <div key={gear.name} className={styles.gearCard}>
                <div className={styles.gearCategory}>SYS.{gear.category}</div>
                <h3 className={styles.gearName}>{gear.name}</h3>
                <div className={styles.gearSpec}>{gear.spec}</div>
                <p className={styles.gearDesc}>{gear.desc}</p>
              </div>
            ))}
          </div>
          <div className={styles.centerLinkWrap}>
            <Link href="/workspace" className={styles.sectionFooterLink}>
              VIEW FULL HARDWARE INVENTORY <ArrowIcon />
            </Link>
          </div>
        </section>

        {/* ==========================================
            [05] 书籍与存档: 全宽终端表格
            ========================================== */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>[05] READING ARCHIVE</span>
            <div className={styles.sectionLine}></div>
          </div>
          <div className={styles.bookListFull}>
            <div className={styles.bookHeader}>
              <span>REF.ID</span>
              <span>TITLE</span>
              <span>AUTHOR</span>
              <span>YEAR</span>
            </div>
            {books.map((book) => (
              <div key={book.id} className={styles.bookRow}>
                <span className={styles.bookId}>{book.id}</span>
                <span className={styles.bookTitle}>{book.title}</span>
                <span className={styles.bookAuthor}>{book.author}</span>
                <span className={styles.bookYear}>{book.year}</span>
              </div>
            ))}
          </div>
          <div className={styles.centerLinkWrap}>
            <Link href="/library" className={styles.sectionFooterLink}>
              EXPLORE COMPLETE LIBRARY <ArrowIcon />
            </Link>
          </div>
        </section>

        {/* ==========================================
            [06] 履历: 绝对保留，未作改动 (全宽两边顶满)
            ========================================== */}
        <section className={styles.section}>
          <div className={styles.sectionLabelFull}>[06] EXPERIENCE</div>
          <div className={styles.fullWidthList}>
            {experiences.map((item) => (
              <Link key={item.period} href="/journey" className={styles.expItemFull}>
                <time className={styles.listEyebrow}>{item.period}</time>
                <h3 className={styles.listTitle}>{item.title}</h3>
                <div className={styles.listDesc}>{item.company}</div>
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
