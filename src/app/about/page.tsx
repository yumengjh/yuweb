import type { Metadata } from "next";

import { getRouteConfigById, siteConfig } from "@/lib/site-config";

import styles from "./page.module.scss";

const route = getRouteConfigById("about");

const principles = [
  {
    title: "Origin",
    description: "从建筑、平面系统与信息设计中提取秩序感，再把它们翻译成可用的交互界面。",
  },
  {
    title: "Voice",
    description: "偏好克制、清晰、有结构的表达。视觉不是修饰，而是对内容权重的组织。",
  },
  {
    title: "Current",
    description: "目前持续打磨个人长期复用的 Next.js 模板，并把页面语言收束成更完整的一套系统。",
  },
] as const;

const currentFocus = [
  "持续整理个人站点的页面系统与导航体验。",
  "把精选项目与长期积累的参考资料分层归档。",
  "迭代可复用的内容模型，让页面更新不依赖一次性重写。",
] as const;

export const metadata: Metadata = {
  title: `${route.title} | ${siteConfig.name}`,
  description: route.description,
};

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <div className={styles.canvas}>
        <section className={styles.innerHero}>
          <p className={styles.heroEyebrow}>ABOUT PAGE / PROFILE</p>
          <div className={styles.innerHeroBody}>
            <h1 className={styles.innerHeroTitle}>关于</h1>
            <p className={styles.innerHeroSummary}>
              从空间感、语气与当前关注切入，整理这套个人数字页面语言的来源与边界。
            </p>
          </div>
        </section>

        <section className={styles.section} id="origin">
          <aside className={styles.sectionRail}>
            <p className={styles.sectionEyebrow}>SECTION / 01</p>
            <h2 className={styles.sectionTitle}>关于</h2>
          </aside>
          <div className={styles.sectionContent}>
            <div className={styles.headlineBlock}>
              <h2 className={styles.sectionHeadline}>构建数字世界的空间感</h2>
              <div className={styles.bodyCopy}>
                <p>
                  在像素与逻辑的交汇点，我追求的是一种如同建筑般的硬朗线条与绝对秩序。
                  我认为界面不应只是信息的堆砌，而是应当被视为一种可供感知的数字化空间。
                </p>
                <p>
                  通过摒弃冗余装饰，利用极端对比与精确网格，我更关注页面如何建立稳定、
                  克制且有节奏的结构，让每一个组件都承担明确功能。
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.detailSection} id="voice">
          <div className={styles.detailIntro}>
            <p className={styles.sectionEyebrow}>VOICE / TONE / SYSTEM</p>
            <h2 className={styles.detailTitle}>把个人表达压缩为可复用的页面语言</h2>
          </div>
          <div className={styles.principleGrid}>
            {principles.map((principle) => (
              <article key={principle.title} className={styles.principleCard}>
                <p className={styles.principleIndex}>{principle.title}</p>
                <p className={styles.principleDescription}>{principle.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.detailSection} id="current">
          <div className={styles.nowPanel}>
            <div>
              <p className={styles.sectionEyebrow}>WHAT&apos;S CURRENT</p>
              <h2 className={styles.detailTitle}>当前持续打磨的，是一套更稳定的个人数字空间。</h2>
            </div>
            <ul className={styles.nowList}>
              {currentFocus.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
