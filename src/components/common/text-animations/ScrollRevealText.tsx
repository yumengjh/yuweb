"use client";

import { useEffect, useMemo, useRef, type ReactNode, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { cn } from "@/utils/cn";

import styles from "./ScrollRevealText.module.scss";

gsap.registerPlugin(ScrollTrigger);

type SplitMode = "auto" | "official" | "words" | "graphemes";

type ScrollRevealTextProps = {
  text?: string;
  children?: ReactNode;
  as?: "p" | "div" | "h2" | "h3" | "span";
  scrollContainerRef?: RefObject<HTMLElement | null>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  className?: string;
  splitMode?: SplitMode;
  perWordTrigger?: boolean;
  stagger?: number;
  rotationStart?: string;
  rotationEnd?: string;
  wordAnimationStart?: string;
  wordAnimationEnd?: string;
};

const asciiWordPattern = /[A-Za-z0-9]/u;
const asciiWordJoinPattern = /[A-Za-z0-9./:+#'’-]/u;

function segmentGraphemes(text: string) {
  if (typeof Intl !== "undefined" && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    return Array.from(segmenter.segment(text), (segment) => segment.segment);
  }

  return Array.from(text);
}

function splitTextIntoUnits(text: string, splitMode: SplitMode) {
  if (!text) return [];

  if (splitMode === "official" || splitMode === "words") {
    return text.split(/(\s+)/);
  }

  const graphemes = segmentGraphemes(text);

  if (splitMode === "graphemes") {
    return graphemes;
  }

  const units: string[] = [];
  let asciiBuffer = "";

  const flushAsciiBuffer = () => {
    if (!asciiBuffer) return;
    units.push(asciiBuffer);
    asciiBuffer = "";
  };

  for (const grapheme of graphemes) {
    if (/^\s$/u.test(grapheme)) {
      flushAsciiBuffer();
      units.push(grapheme);
      continue;
    }

    if (asciiWordPattern.test(grapheme)) {
      asciiBuffer += grapheme;
      continue;
    }

    if (asciiBuffer && asciiWordJoinPattern.test(grapheme)) {
      asciiBuffer += grapheme;
      continue;
    }

    flushAsciiBuffer();
    units.push(grapheme);
  }

  flushAsciiBuffer();

  return units;
}

export function ScrollRevealText({
  text,
  children,
  as: Tag = "p",
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = "",
  textClassName = "",
  className = "",
  splitMode = "auto",
  perWordTrigger = true,
  stagger = 0.05,
  rotationStart = "top bottom",
  rotationEnd = "bottom bottom",
  wordAnimationStart = "top bottom",
  wordAnimationEnd = "top bottom-=16%",
}: ScrollRevealTextProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const content = typeof children === "string" ? children : (text ?? "");

  const splitText = useMemo(
    () =>
      splitTextIntoUnits(content, splitMode).map((unit, index) => {
        if (/^\s+$/u.test(unit)) return unit;

        return (
          <span className={styles.word} key={`${unit}-${index}`}>
            {unit}
          </span>
        );
      }),
    [content, splitMode],
  );

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const scroller =
      scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;

    const context = gsap.context(() => {
      gsap.fromTo(
        element,
        { transformOrigin: "0% 50%", rotate: baseRotation },
        {
          ease: "none",
          rotate: 0,
          scrollTrigger: {
            trigger: element,
            scroller,
            start: rotationStart,
            end: rotationEnd,
            scrub: true,
          },
        },
      );

      const wordElements = element.querySelectorAll(`.${styles.word}`);
      if (wordElements.length === 0) return;

      if (perWordTrigger) {
        gsap.utils.toArray<HTMLElement>(wordElements).forEach((wordElement) => {
          gsap.fromTo(
            wordElement,
            {
              opacity: baseOpacity,
              filter: enableBlur ? `blur(${blurStrength}px)` : "blur(0px)",
              willChange: enableBlur ? "opacity, filter" : "opacity",
            },
            {
              ease: "none",
              opacity: 1,
              filter: "blur(0px)",
              scrollTrigger: {
                trigger: wordElement,
                scroller,
                start: wordAnimationStart,
                end: wordAnimationEnd,
                scrub: true,
              },
            },
          );
        });

        return;
      }

      gsap.fromTo(
        wordElements,
        { opacity: baseOpacity, willChange: "opacity" },
        {
          ease: "none",
          opacity: 1,
          stagger,
          scrollTrigger: {
            trigger: element,
            scroller,
            start: wordAnimationStart,
            end: wordAnimationEnd,
            scrub: true,
          },
        },
      );

      if (!enableBlur) return;

      gsap.fromTo(
        wordElements,
        { filter: `blur(${blurStrength}px)` },
        {
          ease: "none",
          filter: "blur(0px)",
          stagger,
          scrollTrigger: {
            trigger: element,
            scroller,
            start: wordAnimationStart,
            end: wordAnimationEnd,
            scrub: true,
          },
        },
      );
    }, element);

    return () => {
      context.revert();
    };
  }, [
    baseOpacity,
    baseRotation,
    blurStrength,
    enableBlur,
    perWordTrigger,
    rotationEnd,
    rotationStart,
    scrollContainerRef,
    stagger,
    wordAnimationEnd,
    wordAnimationStart,
  ]);

  return (
    <div className={cn(styles.root, containerClassName)}>
      <Tag ref={containerRef as never} className={cn(styles.text, className, textClassName)}>
        <span className={styles.srOnly}>{content}</span>
        <span aria-hidden="true">{splitText}</span>
      </Tag>
    </div>
  );
}
