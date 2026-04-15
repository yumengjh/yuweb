"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

import { createTranslator, type SiteLocale } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";
import styles from "@/app/page.module.scss";
import { HomeSmoothScroll } from "@/components/home-page/HomeSmoothScroll";

// ==========================================
// 1. 数据常量与文案
// ==========================================
const heroData = {
  "zh-CN": {
    roles: ["DIGITAL ARCHITECT", "FRONTEND ENGINEER", "INTERFACE DESIGNER", "SYSTEM BUILDER"],
    desc: "逻辑先行，留白承重。让每一行代码与像素都对齐于结构、节奏与稳定性。",
  },
  "en-US": {
    roles: ["DIGITAL ARCHITECT", "FRONTEND ENGINEER", "INTERFACE DESIGNER", "SYSTEM BUILDER"],
    desc: "Logic first, whitespace load-bearing. Every line of code or pixel aligned to structure, rhythm, and stability.",
  },
} as const;

// ==========================================
// 2. 内置特效组件 (React Bits 风格还原)
// ==========================================

/**
 * 特效 A：ShuffleText (老虎机/乱码字符垂直滚动揭秘)
 * 原理：将每一个字符转化为一列包含乱码的垂直长条，并使用 Framer Motion 向上滑动至真实字符
 */
const SHUFFLE_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";

function getShuffleChar(char: string, charIndex: number, columnIndex: number) {
  const seed = char.charCodeAt(0) * 31 + charIndex * 17 + columnIndex * 13;
  return SHUFFLE_CHARSET[seed % SHUFFLE_CHARSET.length];
}

function ShuffleText({
  text,
  delay = 0,
  className = "",
}: {
  text: string;
  delay?: number;
  className?: string;
}) {
  const chars = text.split("");

  return (
    <span
      className={className}
      style={{ display: "inline-flex", flexWrap: "wrap", justifyContent: "center" }}
    >
      {chars.map((char, i) => {
        if (char === " ")
          return (
            <span key={i} style={{ display: "inline-block", width: "0.25em" }}>
              &nbsp;
            </span>
          );

        // 生成 5 个稳定的扰动字符 + 1 个最终真实字符
        const column = Array.from({ length: 5 }, (_, columnIndex) =>
          getShuffleChar(char, i, columnIndex),
        );
        column.push(char);

        return (
          // 外层定高 1em 并截断溢出
          <span
            key={i}
            style={{
              display: "inline-block",
              overflow: "hidden",
              height: "1em",
              verticalAlign: "bottom",
            }}
          >
            <motion.span
              initial={{ y: "0em" }}
              animate={{ y: `-${column.length - 1}em` }} // 向上平移，直至最后一排(真实字符)漏出
              transition={{ duration: 0.6, delay: delay + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: "inline-flex", flexDirection: "column" }}
            >
              {column.map((c, j) => (
                <span
                  key={j}
                  style={{
                    height: "1em",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {c}
                </span>
              ))}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}

/**
 * 特效 B：Grid Motion Background (高级网格运动背景)
 * 原理：底层纯色 + 移动的巨大模糊色块 + 顶部混合滤镜(mix-blend-mode)的 SVG 噪点
 */
const GRID_MOTION_ITEMS = [
  "YUMENGJH",
  "STRUCTURE",
  "RHYTHM",
  "STABILITY",
  "GRID",
  "MOTION",
  "SIGNAL",
  "SURFACE",
  "LAYER",
  "FRAME",
  "FLOW",
  "PIXEL",
  "CODE",
  "SYSTEM",
  "VECTOR",
  "PATTERN",
  "BALANCE",
  "SEQUENCE",
  "DENSITY",
  "OFFSET",
  "FIELD",
  "MODULE",
  "NETWORK",
  "DEPTH",
  "TIMELINE",
  "CANVAS",
  "SPECTRUM",
  "MATRIX",
] as const;

function GridMotionBackground() {
  const rowRefs = useRef<Array<HTMLDivElement | null>>([]);
  const mouseXRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    mouseXRef.current = window.innerWidth / 2;
    gsap.ticker.lagSmoothing(0);

    const handleMouseMove = (event: MouseEvent) => {
      mouseXRef.current = event.clientX;
    };

    const updateMotion = () => {
      const maxMoveAmount = 300;
      const baseDuration = 0.8;
      const inertiaFactors = [0.6, 0.4, 0.3, 0.2];

      rowRefs.current.forEach((row, index) => {
        if (!row) {
          return;
        }

        const direction = index % 2 === 0 ? 1 : -1;
        const moveAmount =
          ((mouseXRef.current / window.innerWidth) * maxMoveAmount - maxMoveAmount / 2) * direction;

        gsap.to(row, {
          x: moveAmount,
          duration: baseDuration + inertiaFactors[index % inertiaFactors.length],
          ease: "power3.out",
          overwrite: "auto",
        });
      });
    };

    gsap.ticker.add(updateMotion);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      gsap.ticker.remove(updateMotion);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div aria-hidden="true" className={styles.gridMotionShell} data-testid="home-grid-motion">
      <section className={styles.gridMotionIntro}>
        <div className={styles.gridMotionContainer}>
          {Array.from({ length: 4 }, (_, rowIndex) => (
            <div
              key={rowIndex}
              ref={(node) => {
                rowRefs.current[rowIndex] = node;
              }}
              className={styles.gridMotionRow}
            >
              {Array.from({ length: 7 }, (_, itemIndex) => {
                const content = GRID_MOTION_ITEMS[rowIndex * 7 + itemIndex];

                return (
                  <div key={`${rowIndex}-${itemIndex}`} className={styles.gridMotionItem}>
                    <div className={styles.gridMotionItemInner}>
                      <span className={styles.gridMotionItemContent}>{content}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ==========================================
// 3. 主页面排版构建
// ==========================================
export function HomePage({ locale }: { locale: SiteLocale }) {
  const t = createTranslator(locale);
  const homePage = siteConfig.homePage;
  const content = heroData[locale] ?? heroData["en-US"];

  const [roleIndex, setRoleIndex] = useState(0);

  // 轮播控制
  useEffect(() => {
    const roleInterval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % content.roles.length);
    }, 4500); // 留足时间让用户欣赏乱码滑动
    return () => clearInterval(roleInterval);
  }, [content.roles.length]);

  return (
    <main className={styles.page}>
      <HomeSmoothScroll />

      <GridMotionBackground />

      <div className={styles.frame}>
        <section className={styles.heroStage}>
          <header className={styles.heroTop}>
            <span>{t(homePage.hero.topLeft)}</span>
            <span>{t(homePage.hero.topRight)}</span>
          </header>

          <div className={styles.centerStage}>
            <motion.div
              className={styles.heroPreTitle}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              CURRENT ROLE IDENTIFICATION //
            </motion.div>

            <div className={styles.roleContainer}>
              {/* 当文字切换时，触发旧的出场和新的 Shuffle 滑入 */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={roleIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, filter: "blur(5px)", y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* 🚀 注入大标题 Shuffle 老虎机特效 */}
                  <ShuffleText text={content.roles[roleIndex]} className={styles.massiveRoleText} />
                </motion.div>
              </AnimatePresence>
            </div>

            <motion.div
              className={styles.heroPostTitle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              STATUS: {t(homePage.hero.statusValue)} — {new Date().getFullYear()}
            </motion.div>
          </div>

          {/* 底部信息：高级毛玻璃形态，透出背后的梦幻渐变 */}
          <motion.div
            className={styles.glassPanel}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
          >
            <div className={styles.metaInfo}>
              <div className={styles.metaBlock}>
                <span className={styles.metaLabel}>{t(homePage.hero.focusLabel)}</span>
                <span className={styles.metaValue}>{t(homePage.hero.focusValue)}</span>
              </div>
              <div className={styles.metaBlock}>
                <span className={styles.metaLabel}>{t(homePage.hero.modeLabel)}</span>
                <span className={styles.metaValue}>{t(homePage.hero.modeValue)}</span>
              </div>
            </div>
            <div className={styles.descBlock}>
              <p>{content.desc}</p>
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
