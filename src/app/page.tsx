import type { Metadata } from "next";
import Link from "next/link";

import { getRouteConfigById, siteConfig } from "@/lib/site-config";

import styles from "./page.module.scss";

type CapabilityIconKind = "arch" | "logic" | "server" | "prototype" | "optimize" | "components";

const capabilityCards = [
  {
    title: "前端架构",
    eyebrow: "Frontend Architecture",
    icon: "arch",
    items: ["前端框架工程体系", "样式系统工程", "类型约束与组件边界"],
  },
  {
    title: "视觉逻辑",
    eyebrow: "Visual Logic",
    icon: "logic",
    items: ["系统化设计原则", "层级化字体编排", "几何化构图方式"],
  },
  {
    title: "服务集成",
    eyebrow: "Server Integration",
    icon: "server",
    items: ["服务运行环境", "接口结构设计", "云端部署流程"],
  },
  {
    title: "原型设计",
    eyebrow: "Prototyping",
    icon: "prototype",
    items: ["高保真交互表达", "功能说明文档", "用户流程映射"],
  },
  {
    title: "性能优化",
    eyebrow: "Optimization",
    icon: "optimize",
    items: ["性能体检", "资源压缩", "核心体验指标"],
  },
  {
    title: "组件实验",
    eyebrow: "Component Lab",
    icon: "components",
    items: ["组件文档体系", "共享组件库", "版本协作流程"],
  },
] as const satisfies ReadonlyArray<{
  title: string;
  eyebrow: string;
  icon: CapabilityIconKind;
  items: readonly string[];
}>;

const experiences = [
  {
    period: "2023 — 至今",
    title: "首席架构师",
    company: "鱼梦江湖数字工作室",
  },
  {
    period: "2021 — 2023",
    title: "高级界面工程师",
    company: "结构实验室",
  },
  {
    period: "2019 — 2021",
    title: "视觉开发工程师",
    company: "核心系统公司",
  },
] as const;

const homeRoute = getRouteConfigById("home");

export const metadata: Metadata = {
  title: siteConfig.name,
  description: homeRoute.description,
};

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 2.5h6v6M9 2.5 3.5 8"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="0.9"
      />
    </svg>
  );
}

function CapabilityIcon({ kind }: { kind: CapabilityIconKind }) {
  switch (kind) {
    case "arch":
      return (
        <svg aria-hidden="true" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M3 11V3.5h1.9L7 7l2.1-3.5H11V11"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1"
          />
        </svg>
      );
    case "logic":
      return (
        <svg aria-hidden="true" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
          <rect
            x="3.25"
            y="3.25"
            width="7.5"
            height="7.5"
            rx="0.8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
          <path d="M5 7h4" stroke="currentColor" strokeLinecap="round" strokeWidth="1" />
        </svg>
      );
    case "server":
      return (
        <svg aria-hidden="true" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
          <rect
            x="3"
            y="3.2"
            width="8"
            height="2.2"
            rx="1.1"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
          <rect
            x="3"
            y="8.6"
            width="8"
            height="2.2"
            rx="1.1"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
      );
    case "prototype":
      return (
        <svg aria-hidden="true" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M4.2 3.7h2.5v2.5H4.2zM7.3 7.8h2.5v2.5H7.3zM6.7 6.7l1 1"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1"
          />
        </svg>
      );
    case "optimize":
      return (
        <svg aria-hidden="true" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
          <circle cx="7" cy="7" r="3.1" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M7 7 9 5.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1" />
        </svg>
      );
    case "components":
      return (
        <svg aria-hidden="true" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
          <rect
            x="3"
            y="3"
            width="3.2"
            height="3.2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
          <rect
            x="7.8"
            y="3"
            width="3.2"
            height="3.2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
          <rect
            x="5.4"
            y="7.8"
            width="3.2"
            height="3.2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
      );
  }
}

export default function HomePage() {
  return (
    <main className={styles.page}>
      <div className={styles.frame}>
        <section className={styles.hero}>
          <div className={styles.heroMeta}>
            <div className={styles.heroMetaLead}>
              <p>Digital Minimalism / 数字架构</p>
              <span>Portfolio Edition 01 / 2024</span>
            </div>

            <dl className={styles.heroFacts}>
              <div>
                <dt>FOCUS</dt>
                <dd>界面系统</dd>
              </div>
              <div>
                <dt>BASE</dt>
                <dd>上海 / 远程</dd>
              </div>
              <div>
                <dt>MODE</dt>
                <dd>设计与代码</dd>
              </div>
            </dl>
          </div>

          <div className={styles.heroBody}>
            <div>
              <h1 className={styles.heroTitle}>{siteConfig.name}</h1>
              <p className={styles.heroSubtitle}>Personal Index / Digital Builder</p>
            </div>

            <p className={styles.heroSummary}>
              我把界面当作一种被精确构筑的数字空间来设计：结构先行，留白承重，交互保持克制而清醒，让每一个像素都服务于秩序、逻辑与稳定感。
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionLabel}>Section 01 / 一层</div>
          <div className={styles.statementGrid}>
            <h2 className={styles.statementTitle}>空间、逻辑与数字秩序。</h2>
            <div className={styles.statementCopy}>
              <p>
                在“数字建筑师”的语境里，屏幕并不只是一个平面画布，而是一种可被组织、可被感知、可被推演的
                structural environment。留白不是空缺，而是决定节奏与层级的承重材料。
              </p>
              <p>
                我更偏好以系统思维取代装饰性堆叠。每一个元素都应该有存在理由，每一段代码都应该强化整体秩序，让页面在清晰、克制与
                stable rhythm 之间建立美感。
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionLabel}>Section 02 / 二层</div>
          <div className={styles.capabilityGrid}>
            {capabilityCards.map((card) => (
              <article key={card.title} className={styles.capabilityCard}>
                <div className={styles.capabilityIconWrap}>
                  <CapabilityIcon kind={card.icon} />
                </div>
                <p className={styles.capabilityEyebrow}>{card.eyebrow}</p>
                <h2>{card.title}</h2>
                <ul>
                  {card.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <div aria-hidden="true" className={styles.centerMarker} />

        <section className={styles.section}>
          <div className={styles.sectionLabel}>Section 03 / 三层</div>
          <div className={styles.projectStack}>
            <article className={styles.projectRow}>
              <div className={`${styles.projectVisual} ${styles.projectVisualLight}`} />
              <div className={styles.projectCopy}>
                <p className={styles.projectMeta}>Project 01 / 2024</p>
                <h2>矩构系统</h2>
                <p>
                  一个以垂直节奏和硬朗秩序为核心的桌面环境概念，重点研究静态组件与流动数据之间的界面关系。
                </p>
                <Link className={styles.projectAction} href="/curations">
                  View Case / 查看解析
                </Link>
              </div>
            </article>

            <article className={`${styles.projectRow} ${styles.projectRowReverse}`}>
              <div className={styles.projectCopy}>
                <p className={styles.projectMeta}>Project 02 / 2023</p>
                <h2>网格索引</h2>
                <p>
                  以建筑网格为组织方式的信息探索工具，用来承载复杂元数据，并把蓝图式的阅读逻辑带回数字界面。
                </p>
                <Link className={styles.projectAction} href="/curations">
                  Explore Grid / 探索蓝图
                </Link>
              </div>
              <div className={`${styles.projectVisual} ${styles.projectVisualDark}`} />
            </article>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionLabel}>Section 04 / 四层</div>
          <div className={styles.timeline}>
            {experiences.map((item) => (
              <Link key={item.period} className={styles.timelineRow} href="/journey">
                <p className={styles.timelinePeriod}>{item.period}</p>
                <div className={styles.timelineContent}>
                  <h2>{item.title}</h2>
                  <p>{item.company}</p>
                </div>
                <span className={styles.timelineArrow}>
                  <ArrowIcon />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
