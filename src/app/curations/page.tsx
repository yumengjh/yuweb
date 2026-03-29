import type { Metadata } from "next";

import { buildRouteMetadata } from "@/lib/seo/metadata";

import styles from "./page.module.scss";

const projects = [
  {
    slug: "concrete-poem",
    category: "INTERFACE SYSTEM",
    title: "混凝土之诗",
    subtitle: "Concrete Poem",
    year: "2026",
    role: "Art Direction / Frontend",
  },
  {
    slug: "the-void-grid",
    category: "EDITORIAL WEB",
    title: "虚空网格",
    subtitle: "The Void Grid",
    year: "2025",
    role: "Experience Design",
  },
  {
    slug: "minimal-rhythm",
    category: "PERSONAL ARCHIVE",
    title: "极简律动",
    subtitle: "Minimal Rhythm",
    year: "2024",
    role: "Design System / Storytelling",
  },
] as const;

export const metadata: Metadata = buildRouteMetadata("zh-CN", "curations");

export default function CurationsPage() {
  const [first, second, third] = projects;

  return (
    <main className={styles.page}>
      <div className={styles.canvas}>
        <section className={styles.innerHero}>
          <p className={styles.heroEyebrow}>CURATIONS PAGE / WORK</p>
          <div className={styles.innerHeroBody}>
            <h1 className={styles.innerHeroTitle}>精选项目</h1>
            <p className={styles.innerHeroSummary}>
              精选项目不只是作品展示，更是组织方法、参考体系和持续归档策略的集合。
            </p>
          </div>
        </section>

        <section className={styles.section} id="selected-work">
          <aside className={styles.sectionRail}>
            <p className={styles.sectionEyebrow}>SECTION / 03</p>
            <h2 className={styles.sectionTitle}>精选项目</h2>
          </aside>
          <div className={styles.sectionContent}>
            <div className={styles.projectList}>
              {[first, second].map((project) => (
                <article key={project.slug} className={styles.projectRow}>
                  <div className={styles.projectCopy}>
                    <p className={styles.cardIndex}>{project.category}</p>
                    <h2 className={styles.projectTitle}>
                      {project.title}
                      <span>{project.subtitle}</span>
                    </h2>
                  </div>
                  <div className={styles.projectMeta}>
                    <strong>{project.year}</strong>
                    <span>{project.role}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.detailSection} id="material-library">
          <article className={styles.referencePanel}>
            <div>
              <p className={styles.sectionEyebrow}>MATERIAL LIBRARY</p>
              <h2 className={styles.detailTitle}>把项目沉淀为可继续调用的视觉与结构样本。</h2>
            </div>
            <p className={styles.referenceCopy}>
              每一次项目归档都不仅保存结果，也保留过程中形成的规则、文案节奏和布局方法，
              让下一次输出不从空白开始。
            </p>
          </article>
        </section>

        <section className={styles.detailSection} id="reference-system">
          <article className={styles.projectRow}>
            <div className={styles.projectCopy}>
              <p className={styles.cardIndex}>{third.category}</p>
              <h2 className={styles.projectTitle}>
                {third.title}
                <span>{third.subtitle}</span>
              </h2>
            </div>
            <div className={styles.projectMeta}>
              <strong>{third.year}</strong>
              <span>{third.role}</span>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
