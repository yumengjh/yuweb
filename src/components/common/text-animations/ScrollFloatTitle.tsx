"use client";

import { useEffect, useMemo, useRef, type ReactNode, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { cn } from "@/utils/cn";

import styles from "./ScrollFloatTitle.module.scss";

gsap.registerPlugin(ScrollTrigger);

type ScrollFloatTitleProps = {
  text?: string;
  children?: ReactNode;
  as?: "h1" | "h2" | "h3" | "div" | "span";
  scrollContainerRef?: RefObject<HTMLElement | null>;
  containerClassName?: string;
  textClassName?: string;
  className?: string;
  animationDuration?: number;
  ease?: string;
  scrollStart?: string;
  scrollEnd?: string;
  stagger?: number;
  fromOpacity?: number;
  fromYPercent?: number;
  fromScaleY?: number;
  fromScaleX?: number;
  transformOrigin?: string;
};

export function ScrollFloatTitle({
  text,
  children,
  as: Tag = "h2",
  scrollContainerRef,
  containerClassName = "",
  textClassName = "",
  className = "",
  animationDuration = 1,
  ease = "back.inOut(2)",
  scrollStart = "center bottom+=50%",
  scrollEnd = "bottom bottom-=40%",
  stagger = 0.03,
  fromOpacity = 0,
  fromYPercent = 120,
  fromScaleY = 2.3,
  fromScaleX = 0.7,
  transformOrigin = "50% 0%",
}: ScrollFloatTitleProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const content = typeof children === "string" ? children : (text ?? "");

  const splitText = useMemo(
    () =>
      content.split(" ").map((word, wordIndex, words) => (
        <span className={styles.word} key={`${word}-${wordIndex}`}>
          {Array.from(word).map((char, charIndex) => (
            <span className={styles.char} key={`${char}-${wordIndex}-${charIndex}`}>
              {char}
            </span>
          ))}
          {wordIndex < words.length - 1 ? <span className={styles.space}>{"\u00A0"}</span> : null}
        </span>
      )),
    [content],
  );

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const scroller =
      scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;

    const context = gsap.context(() => {
      const charElements = element.querySelectorAll(`.${styles.char}`);
      if (charElements.length === 0) return;

      gsap.fromTo(
        charElements,
        {
          willChange: "opacity, transform",
          opacity: fromOpacity,
          yPercent: fromYPercent,
          scaleY: fromScaleY,
          scaleX: fromScaleX,
          transformOrigin,
        },
        {
          duration: animationDuration,
          ease,
          opacity: 1,
          yPercent: 0,
          scaleY: 1,
          scaleX: 1,
          stagger,
          scrollTrigger: {
            trigger: element,
            scroller,
            start: scrollStart,
            end: scrollEnd,
            scrub: true,
          },
        },
      );
    }, element);

    return () => {
      context.revert();
    };
  }, [
    animationDuration,
    ease,
    fromOpacity,
    fromScaleX,
    fromScaleY,
    fromYPercent,
    scrollContainerRef,
    scrollEnd,
    scrollStart,
    stagger,
    transformOrigin,
  ]);

  return (
    <Tag ref={containerRef as never} className={cn(styles.root, containerClassName)}>
      <span className={styles.srOnly}>{content}</span>
      <span aria-hidden="true" className={cn(styles.text, className, textClassName)}>
        {splitText}
      </span>
    </Tag>
  );
}
