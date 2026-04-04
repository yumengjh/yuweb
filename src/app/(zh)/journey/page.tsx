import type { Metadata } from "next";

import { buildRouteMetadata } from "@/lib/seo/metadata";

import styles from "./page.module.scss";

const timelineItems = [
  {
    period: "2023 — PRESENT",
    title: "高级数字架构师 @ 某科技实验室",
    description:
      "负责把复杂产品能力重组为更清晰的界面层级，持续关注设计系统、交互架构与工程落地的一致性。",
  },
  {
    period: "2021 — 2023",
    title: "交互工程师 @ 创意视觉工作室",
    description: "在品牌、内容与页面体验之间搭桥，让视觉叙事与前端实现保持同一条逻辑线。",
  },
  {
    period: "2019 — 2021",
    title: "前端开发工程师 @ 互联网先行者",
    description: "从工程实现起步，逐步把关注点从功能完成，转向结构、秩序与长期维护。",
  },
] as const;

const currentItems = [
  "持续整理个人站点的页面系统与导航体验。",
  "把精选项目和长期积累的参考资料分层组织起来。",
  "迭代可复用的内容模型，让页面更新不依赖一次性重写。",
] as const;

export const metadata: Metadata = buildRouteMetadata("zh-CN", "journey");

export default function JourneyPage() {
  return (
    <main className={styles.page}>
      <div className={styles.canvas}>
        <section className={styles.innerHero}>
          <p className={styles.heroEyebrow}>JOURNEY PAGE / TIMELINE</p>
          <div className={styles.innerHeroBody}>
            <h1 className={styles.innerHeroTitle}>旅程</h1>
            <p className={styles.innerHeroSummary}>
              按时间展开经验与阶段，让页面保留过程，而不只陈列最终结果。
            </p>
          </div>
        </section>

        <section className={styles.section} id="milestones">
          <aside className={styles.sectionRail}>
            <p className={styles.sectionEyebrow}>SECTION / 04</p>
            <h2 className={styles.sectionTitle}>旅程</h2>
          </aside>
          <div className={styles.sectionContent}>
            <div className={styles.timeline}>
              {timelineItems.map((item) => (
                <article key={item.period} className={styles.timelineItem}>
                  <div className={styles.timelineDot} />
                  <div className={styles.timelineCopy}>
                    <p className={styles.timelinePeriod}>{item.period}</p>
                    <h2 className={styles.timelineTitle}>{item.title}</h2>
                    <p className={styles.timelineDescription}>{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.detailSection} id="in-progress">
          <div className={styles.nowPanel}>
            <div>
              <p className={styles.sectionEyebrow}>IN PROGRESS</p>
              <h2 className={styles.detailTitle}>
                正在进行中的工作，比已经完成的结果更值得持续记录。
              </h2>
            </div>
            <ul className={styles.nowList}>
              {currentItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className={styles.detailSection} id="timeline">
          <article className={styles.referencePanel}>
            <div>
              <p className={styles.sectionEyebrow}>TIMELINE VIEW</p>
              <h2 className={styles.detailTitle}>
                时间线不是履历表，而是一条不断调整方向的工作脉络。
              </h2>
            </div>
            <p className={styles.referenceCopy}>
              我更关心每一阶段如何塑造下一阶段的判断方式，因此页面也保留了过程、过渡与正在形成中的结构。
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}
