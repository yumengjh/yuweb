"use client";

import { useEffect, useRef, useState, type MouseEvent, type MutableRefObject } from "react";
import { gsap } from "gsap";

import styles from "./FlowingMenu.module.scss";

export type FlowingMenuItemMeta = {
  id?: string;
  author?: string;
  year?: string;
};

export type FlowingMenuItem = {
  link: string;
  text: string;
  image?: string;
  meta?: FlowingMenuItemMeta;
};

export type FlowingMenuContentMode = "auto" | "image" | "text";

export type FlowingMenuProps = {
  items: FlowingMenuItem[];
  speed?: number;
  textColor?: string;
  bgColor?: string;
  marqueeBgColor?: string;
  marqueeTextColor?: string;
  borderColor?: string;
  contentMode?: FlowingMenuContentMode;
  separator?: string;
};

function shouldUseImageMode(mode: FlowingMenuContentMode, image?: string) {
  if (mode === "image") {
    return true;
  }

  if (mode === "text") {
    return false;
  }

  return Boolean(image);
}

type MenuItemProps = {
  item: FlowingMenuItem;
  allItems: FlowingMenuItem[];
  speed: number;
  textColor: string;
  marqueeBgColor: string;
  marqueeTextColor: string;
  borderColor: string;
  contentMode: FlowingMenuContentMode;
  separator: string;
  isActive: boolean;
  onActiveChange: (active: boolean) => void;
  pointerYRef: MutableRefObject<number | null>;
};

function MenuItem({
  item,
  allItems,
  speed,
  textColor,
  marqueeBgColor,
  marqueeTextColor,
  borderColor,
  contentMode,
  separator,
  isActive,
  onActiveChange,
  pointerYRef,
}: MenuItemProps) {
  const itemRef = useRef<HTMLDivElement | null>(null);
  const marqueeRef = useRef<HTMLDivElement | null>(null);
  const marqueeInnerRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [repetitions, setRepetitions] = useState(4);
  const hasImageEntry = allItems.some((entry) => shouldUseImageMode(contentMode, entry.image));

  useEffect(() => {
    const calculateRepetitions = () => {
      if (!marqueeInnerRef.current) return;

      const marqueeContent = marqueeInnerRef.current.querySelector<HTMLElement>(
        `.${styles.marqueePart}`,
      );
      if (!marqueeContent) return;

      const contentWidth = marqueeContent.offsetWidth;
      if (contentWidth === 0) return;

      const viewportWidth = window.innerWidth;
      const needed = Math.ceil(viewportWidth / contentWidth) + 2;
      setRepetitions(Math.max(4, needed));
    };

    calculateRepetitions();
    window.addEventListener("resize", calculateRepetitions);
    return () => window.removeEventListener("resize", calculateRepetitions);
  }, [allItems, contentMode, separator]);

  useEffect(() => {
    const setupMarquee = () => {
      if (!marqueeInnerRef.current) return;

      const marqueeContent = marqueeInnerRef.current.querySelector<HTMLElement>(
        `.${styles.marqueePart}`,
      );
      if (!marqueeContent) return;

      const contentWidth = marqueeContent.offsetWidth;
      if (contentWidth === 0) return;

      if (animationRef.current) {
        animationRef.current.kill();
      }

      gsap.set(marqueeInnerRef.current, { x: 0 });
      animationRef.current = gsap.to(marqueeInnerRef.current, {
        x: -contentWidth,
        duration: speed,
        ease: "none",
        repeat: -1,
      });
    };

    const timer = window.setTimeout(setupMarquee, 50);

    return () => {
      window.clearTimeout(timer);
      if (animationRef.current) {
        animationRef.current.kill();
        animationRef.current = null;
      }
    };
  }, [allItems, repetitions, speed, contentMode, separator]);

  useEffect(() => {
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
    };
  }, []);

  const resolveEdge = (
    event: MouseEvent<HTMLAnchorElement>,
    rect: DOMRect,
    phase: "enter" | "leave",
  ) => {
    const localY = event.clientY - rect.top;
    const prevY = pointerYRef.current;
    pointerYRef.current = event.clientY;

    if (prevY !== null) {
      const deltaY = event.clientY - prevY;
      if (phase === "enter") {
        if (deltaY > 0.8) return "top";
        if (deltaY < -0.8) return "bottom";
      } else {
        if (deltaY > 0.8) return "bottom";
        if (deltaY < -0.8) return "top";
      }
    }

    return localY < rect.height / 2 ? "top" : "bottom";
  };

  const handleMouseEnter = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;

    onActiveChange(true);
    const rect = itemRef.current.getBoundingClientRect();
    const edge = resolveEdge(event, rect, "enter");

    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    timelineRef.current = gsap
      .timeline({ defaults: { duration: 0.6, ease: "expo.out" } })
      .set(marqueeRef.current, { y: edge === "top" ? "-101%" : "101%" }, 0)
      .set(marqueeInnerRef.current, { y: edge === "top" ? "101%" : "-101%" }, 0)
      .to([marqueeRef.current, marqueeInnerRef.current], { y: "0%" }, 0);
  };

  const handleMouseLeave = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;

    onActiveChange(false);
    const rect = itemRef.current.getBoundingClientRect();
    const edge = resolveEdge(event, rect, "leave");

    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    timelineRef.current = gsap
      .timeline({ defaults: { duration: 0.6, ease: "expo.out" } })
      .to(marqueeRef.current, { y: edge === "top" ? "-101%" : "101%" }, 0)
      .to(marqueeInnerRef.current, { y: edge === "top" ? "101%" : "-101%" }, 0);
  };

  const marqueeParts = Array.from({ length: repetitions }, (_, index) => (
    <div
      className={styles.marqueePart}
      key={`${item.text}-all-${index}`}
      style={{ color: marqueeTextColor }}
      data-flowing-content-mode={hasImageEntry ? "image" : "text"}
    >
      {allItems.map((entry, entryIndex) => {
        const entryImageMode = shouldUseImageMode(contentMode, entry.image);
        const metaSummary = [entry.meta?.author, entry.meta?.year, entry.meta?.id]
          .filter(Boolean)
          .join(" · ");
        return (
          <span className={styles.marqueeEntry} key={`${entry.text}-${entryIndex}`}>
            <span className={styles.marqueeTitle}>{entry.text}</span>
            {entryImageMode ? (
              <span
                className={styles.marqueeImage}
                style={{ backgroundImage: entry.image ? `url(${entry.image})` : undefined }}
                aria-hidden="true"
              />
            ) : (
              <span className={styles.metaChipWrap} aria-hidden="true">
                {metaSummary ? <span className={styles.metaChip}>{metaSummary}</span> : null}
              </span>
            )}
            <span className={styles.marqueeSeparator}>{separator}</span>
          </span>
        );
      })}
    </div>
  ));

  return (
    <div
      className={styles.menuItem}
      ref={itemRef}
      style={{ borderColor }}
      data-active={isActive ? "true" : "false"}
    >
      <a
        className={styles.menuItemLink}
        href={item.link}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ color: textColor }}
      >
        <span className={styles.menuItemLabel}>{item.text}</span>
      </a>
      <div className={styles.marquee} ref={marqueeRef} style={{ backgroundColor: marqueeBgColor }}>
        <div className={styles.marqueeInnerWrap}>
          <div className={styles.marqueeInner} ref={marqueeInnerRef} aria-hidden="true">
            {marqueeParts}
          </div>
        </div>
      </div>
    </div>
  );
}

export function FlowingMenu({
  items,
  speed = 15,
  textColor = "var(--c-ink-strong)",
  bgColor = "var(--c-bg)",
  marqueeBgColor = "var(--c-ink-strong)",
  marqueeTextColor = "var(--c-bg)",
  borderColor = "var(--c-border-soft)",
  contentMode = "auto",
  separator = "•",
}: FlowingMenuProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const pointerYRef = useRef<number | null>(null);

  return (
    <div className={styles.menuWrap} style={{ backgroundColor: bgColor }}>
      <nav className={styles.menu}>
        {items.map((item, index) => (
          <MenuItem
            key={`${item.text}-${index}`}
            item={item}
            allItems={items}
            speed={speed}
            textColor={textColor}
            marqueeBgColor={marqueeBgColor}
            marqueeTextColor={marqueeTextColor}
            borderColor={borderColor}
            contentMode={contentMode}
            separator={separator}
            isActive={activeIndex === index}
            onActiveChange={(active) => setActiveIndex(active ? index : null)}
            pointerYRef={pointerYRef}
          />
        ))}
      </nav>
    </div>
  );
}
