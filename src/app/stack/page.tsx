import type { Metadata } from "next";

import { createTranslator } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";

import styles from "./page.module.scss";

const t = createTranslator("zh-CN");

const stackItems = [
  {
    index: "01",
    title: "Next.js",
    description: "以 App Router 组织页面、布局与静态输出，适合长期维护的个人站点。",
  },
  {
    index: "02",
    title: "TypeScript",
    description: "让页面组件、内容模型和交互状态保持清晰边界，减少后期迭代隐性成本。",
  },
  {
    index: "03",
    title: "SCSS Modules",
    description: "用局部样式和全局 token 一起管理视觉语言，既有秩序也保留表达空间。",
  },
  {
    index: "04",
    title: "Motion",
    description: "偏好低噪声、目的明确的动效，只为解释层级、状态变化和交互反馈服务。",
  },
  {
    index: "05",
    title: "Content Systems",
    description: "把页面文案、信息层级和组件结构一起设计，而不是界面完成后再补内容。",
  },
  {
    index: "06",
    title: "Testing",
    description: "保留 lint、typecheck 和基础测试链路，让视觉改造也停留在可维护边界内。",
  },
] as const;

export const metadata: Metadata = {
  title: `${t(siteConfig.routeMeta.stack.title)} | ${t(siteConfig.identity.name)}`,
  description: t(siteConfig.routeMeta.stack.description),
};

export default function StackPage() {
  const [frontend, design, interaction, ...rest] = stackItems;

  return (
    <main className={styles.page}>
      <div className={styles.canvas}>
        <section className={styles.innerHero}>
          <p className={styles.heroEyebrow}>STACK PAGE / SYSTEM</p>
          <div className={styles.innerHeroBody}>
            <h1 className={styles.innerHeroTitle}>技术栈</h1>
            <p className={styles.innerHeroSummary}>
              把前端框架、样式策略、动效原则和内容模型收进一套长期可维护的工程结构。
            </p>
          </div>
        </section>

        <section className={styles.section} id="frontend">
          <aside className={styles.sectionRail}>
            <p className={styles.sectionEyebrow}>SECTION / 02</p>
            <h2 className={styles.sectionTitle}>技术栈</h2>
          </aside>
          <div className={styles.sectionContent}>
            <div className={styles.stackLayout}>
              <article className={styles.featureCard}>
                <p className={styles.cardIndex}>{frontend.index}</p>
                <h2 className={styles.cardTitle}>{frontend.title}</h2>
                <p className={styles.cardDescription}>{frontend.description}</p>
              </article>
              <article className={styles.featureCard}>
                <p className={styles.cardIndex}>{design.index}</p>
                <h2 className={styles.cardTitle}>{design.title}</h2>
                <p className={styles.cardDescription}>{design.description}</p>
              </article>
            </div>
          </div>
        </section>

        <section className={styles.detailSection} id="design">
          <div className={styles.stackGrid}>
            {rest.slice(0, 2).map((item) => (
              <article key={item.index} className={styles.stackCard}>
                <p className={styles.cardIndex}>{item.index}</p>
                <h2 className={styles.cardTitle}>{item.title}</h2>
                <p className={styles.cardDescription}>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.detailSection} id="interaction">
          <div className={styles.stackGrid}>
            {[interaction, ...rest.slice(2)].map((item) => (
              <article key={item.index} className={styles.stackCard}>
                <p className={styles.cardIndex}>{item.index}</p>
                <h2 className={styles.cardTitle}>{item.title}</h2>
                <p className={styles.cardDescription}>{item.description}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
