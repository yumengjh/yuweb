"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function HomeStageTimeline() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // ============================================
      // 1. Hero 首屏：clip-path 标题填充 + 视差下沉
      // ============================================

      // Hero 粘性容器：后半段视差下沉并淡出
      ScrollTrigger.create({
        trigger: "[data-testid='home-stage-1']",
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
          // y: 0 → 15%，opacity: 1 → 0（后半段开始淡出）
          const y = p > 0.4 ? ((p - 0.4) / 0.6) * 15 : 0;
          const opacity = p > 0.4 ? 1 - (p - 0.4) / 0.6 : 1;
          gsap.set("[data-anim='hero-sticky']", { y: `${y}%`, opacity });
        },
      });

      // 标题填充：clip-path 从全遮到完全露出
      ScrollTrigger.create({
        trigger: "[data-testid='home-stage-1']",
        start: "top top",
        end: "center top",
        scrub: 1,
        onUpdate: (self) => {
          // progress: 0 → inset(100%), progress: 1 → inset(0%)
          const clip = 100 - self.progress * 100;
          gsap.set("[data-anim='title-solid']", {
            clipPath: `inset(${clip}% 0% 0% 0%)`,
          });
        },
      });

      // ============================================
      // 2. 哲学宣言区：横向位移视差
      // ============================================
      gsap.fromTo(
        "[data-anim='phil-title']",
        { x: "-15%", opacity: 0 },
        {
          x: "15%",
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-testid='home-stage-2']",
            start: "start 80%",
            end: "end 20%",
            scrub: 1.2,
          },
        },
      );

      // ============================================
      // 3. Pop-Art 卡片：浮动视差 + 旋转
      // ============================================
      gsap.fromTo(
        "[data-anim='cap-card']",
        { y: 120, rotateZ: -6, opacity: 0.7 },
        {
          y: -120,
          rotateZ: 6,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-testid='home-stage-3']",
            start: "top 70%",
            end: "bottom 30%",
            scrub: 1,
          },
        },
      );

      // ============================================
      // 4. Works 区域：入场动画（已由 framer-motion whileInView 处理，保留 GSAP 备用）
      // ============================================

      // ============================================
      // 5. FAQ / Experience 区：item 依次滑入
      // ============================================
      gsap.fromTo(
        "[data-testid='home-stage-5'] .faqItem",
        { x: -60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "[data-testid='home-stage-5']",
            start: "top 70%",
            end: "top 30%",
            scrub: false,
            markers: false,
          },
        },
      );

      // ============================================
      // 6. Footer Slide Cover：从底部升起覆盖
      // ============================================
      gsap.to("[data-anim='slide-cover']", {
        y: "0%",
        ease: "none",
        scrollTrigger: {
          trigger: ".footerTrigger",
          start: "top 80%",
          end: "top top",
          scrub: 0.8,
          // 防止与其他 pin 冲突
          invalidateOnRefresh: true,
        },
      });
    });

    // 窗口尺寸变化时重新计算
    window.addEventListener("resize", () => {
      ScrollTrigger.refresh();
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return null;
}
