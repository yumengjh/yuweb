"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, useGLTF, useAnimations, Center } from "@react-three/drei";
import * as THREE from "three";
import styles from "./page.module.scss";

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────
// 完美参数保留
// ─────────────────────────────────────────────────────────
const TRUCK_SCALE = 0.03;
const POS_X = 20;
const POS_Y = -5;
const POS_Z = -40;
const ROT_Y = -Math.PI * 0.25;

const principles = [
  {
    index: "01",
    title: "Robust Engine",
    desc: "如同全地形车辆的底盘，数字界面需要极强的结构稳定性。将复杂的业务逻辑封装为底层引擎，保障绝对流畅。",
  },
  {
    index: "02",
    title: "Visual Restraint",
    desc: "车身的线条是为了降低风阻，界面的像素是为了降低认知负担。极度的克制本身即是最高级的声明。",
  },
];

const capabilities = [
  { tag: "CORE", label: "React / Next.js / TypeScript" },
  { tag: "WEBGL", label: "Three.js / React Three Fiber / R3F" },
  { tag: "MOTION", label: "GSAP / Framer Motion / Lenis" },
];

// ── 3D 小车组件 (导演级长镜头动画) ──────────────────────
function TruckModel() {
  const groupRef = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/model/low-poly_truck_car_drifter.glb");
  const { actions } = useAnimations(animations, groupRef);

  useEffect(() => {
    const actionName = Object.keys(actions)[0];
    if (actionName && actions[actionName]) {
      actions[actionName]?.play();
    }
  }, [actions]);

  useGSAP(() => {
    if (!groupRef.current) return;

    gsap.set(groupRef.current.position, { x: POS_X, y: POS_Y, z: POS_Z });
    gsap.set(groupRef.current.rotation, { y: ROT_Y, x: 0, z: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5, // 物理惯性
      },
    });

    // 【阶段 1：驶入与漂移入场】(权重 duration: 3)
    tl.to(
      groupRef.current.position,
      {
        x: 0,
        y: -2,
        z: -15, // 拉近距离，但仍在安全区
        duration: 3,
        ease: "power2.inOut",
      },
      0,
    )
      .to(
        groupRef.current.rotation,
        {
          y: ROT_Y + Math.PI,
          z: 0.25, // 漂移压弯
          duration: 3,
          ease: "power1.inOut",
        },
        0,
      )

      // 【阶段 2：长滞空跃起】(权重 duration: 4，占据最长的滚动区间)
      .to(
        groupRef.current.position,
        {
          y: 3.5, // 高高跃起
          duration: 4,
          ease: "sine.inOut",
        },
        ">",
      )
      .to(
        groupRef.current.rotation,
        {
          x: 0.35, // 车头抬起
          duration: 2,
          ease: "sine.out",
        },
        "<",
      )
      .to(
        groupRef.current.rotation,
        {
          x: -0.1, // 滞空后半段车头下压，准备落地
          duration: 2,
          ease: "sine.in",
        },
        ">",
      )

      // 【阶段 3：完美停靠右下角，绝不怼脸】(权重 duration: 3)
      .to(
        groupRef.current.position,
        {
          x: 12, // 停在画面远端右侧
          y: -2.5, // 落地
          z: -25, // ⚠️ 核心：再次推远到 -25，变成精致的背景模型
          duration: 3,
          ease: "power2.out",
        },
        ">",
      )
      .to(
        groupRef.current.rotation,
        {
          y: ROT_Y + Math.PI * 2.2, // 侧面45度绝佳展示角
          z: 0, // 侧倾回正
          x: 0.05,
          duration: 3,
          ease: "power2.out",
        },
        "<",
      );
  });

  return (
    <group ref={groupRef}>
      <Center>
        <primitive object={scene} scale={TRUCK_SCALE} />
      </Center>
      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.65}
        scale={8}
        blur={2}
        far={4}
        color="#000000"
      />
    </group>
  );
}

useGLTF.preload("/model/low-poly_truck_car_drifter.glb");

// ── 主页面组件 ──────────────────────────────────────
export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);

  useGSAP(
    () => {
      // 卡片堆叠动画
      const cards = gsap.utils.toArray<HTMLElement>(`.${styles.card}`);
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return;
        const nextCard = cards[i + 1];

        gsap.to(card, {
          scale: 0.94,
          y: -30,
          scrollTrigger: {
            trigger: nextCard,
            start: "top 85%",
            end: "top 25%",
            scrub: true,
          },
        });
      });

      gsap.from(`.${styles.heroLine}`, {
        y: "110%",
        opacity: 0,
        stagger: 0.1,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.3,
      });
    },
    { scope: containerRef },
  );

  return (
    <main ref={containerRef} className={styles.page}>
      {/* 3D 幽灵层：完全穿透 */}
      <div className={styles.canvas3D} style={{ pointerEvents: "none" }}>
        <Canvas
          camera={{ position: [0, 1.5, 10], fov: 35 }}
          dpr={[1, 2]}
          style={{ pointerEvents: "none" }}
        >
          <ambientLight intensity={0.9} />
          <directionalLight position={[10, 15, 10]} intensity={1.8} />
          <TruckModel />
        </Canvas>
      </div>

      <div className={styles.contentLayer} style={{ pointerEvents: "auto" }}>
        <header className={styles.header}>
          <span>PROFILE / SYS</span>
          <span>DIGITAL ARCHITECT</span>
        </header>

        {/* ── HERO ── */}
        <section className={styles.hero}>
          <div className={`${styles.heroText} ${styles.glassPanel}`}>
            <h1 className={styles.heroHeadline}>
              <div className={styles.heroLineWrap}>
                <span className={styles.heroLine}>Digital</span>
              </div>
              <div className={styles.heroLineWrap}>
                <span className={styles.heroLine}>Expedition.</span>
              </div>
            </h1>
            <p className={styles.heroDesc}>
              构建数字世界的空间感。
              <br />
              把界面当作一种被精确构筑的结构，拒绝无意义的装饰，让每一行代码都服务于秩序与稳定。
            </p>
          </div>
        </section>

        {/* ── 01: 层叠卡片 ── */}
        <section className={styles.principlesSection}>
          <div className={`${styles.sectionTitleWrap} ${styles.glassPanel}`}>
            <h2 className={styles.sectionEyebrow}>01 / PRINCIPLES</h2>
            <p className={styles.sectionDesc}>向下滚动，浏览数字结构的底层逻辑。</p>
          </div>

          <div className={styles.cardsWrapper}>
            {principles.map((p, i) => (
              <article
                key={i}
                className={`${styles.card} ${styles.glassPanel}`}
                style={{ top: `calc(15vh + ${i * 45}px)` }}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.cardIndex}>{p.index}</div>
                  <h3 className={styles.cardTitle}>{p.title}</h3>
                </div>
                <div className={styles.cardBody}>
                  <p>{p.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── 02: 技术栈 (拉长滚动距离) ── */}
        <section className={styles.techSection}>
          <div className={`${styles.sectionTitleWrap} ${styles.glassPanel}`}>
            <h2 className={styles.sectionEyebrow}>02 / CAPABILITIES</h2>
            <p className={styles.sectionDesc}>全地形驱动的技术栈矩阵。</p>
          </div>
          <div className={`${styles.techList} ${styles.glassPanel}`}>
            {capabilities.map((item, i) => (
              <div key={i} className={styles.techRow}>
                <span className={styles.techTag}>{item.tag}</span>
                <span className={styles.techLabel}>{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        <footer className={styles.footer}>
          {/* 给底部文字也加上微玻璃，防止任何重叠时的尴尬 */}
          <h2 className={styles.glassPanel}>End of Journey.</h2>
        </footer>
      </div>
    </main>
  );
}
