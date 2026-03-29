"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion, type HTMLMotionProps, type Transition } from "motion/react";

import { cn } from "@/utils/cn";

import styles from "./RotatingText.module.scss";

type StaggerFrom = "first" | "last" | "center" | "random" | number;
type SplitBy = "characters" | "words" | "lines" | string;
type MotionState = Record<string, string | number>;
type MotionSpanProps = Omit<HTMLMotionProps<"span">, "children" | "transition">;

export type RotatingTextHandle = {
  jumpTo: (index: number) => void;
  next: () => void;
  previous: () => void;
  reset: () => void;
};

export type RotatingTextProps = MotionSpanProps & {
  texts: readonly string[];
  transition?: Transition;
  layoutTransition?: Transition;
  initial?: MotionState;
  animate?: MotionState;
  exit?: MotionState;
  animatePresenceMode?: "sync" | "wait" | "popLayout";
  animatePresenceInitial?: boolean;
  rotationInterval?: number;
  staggerDuration?: number;
  staggerFrom?: StaggerFrom;
  loop?: boolean;
  auto?: boolean;
  splitBy?: SplitBy;
  onNext?: (index: number) => void;
  mainClassName?: string;
  splitLevelClassName?: string;
  elementLevelClassName?: string;
  segmenterLocale?: string;
};

export const RotatingText = forwardRef<RotatingTextHandle, RotatingTextProps>(function RotatingText(
  {
    texts,
    transition = { type: "spring", damping: 25, stiffness: 300 },
    layoutTransition,
    initial = { y: "100%", opacity: 0 },
    animate = { y: 0, opacity: 1 },
    exit = { y: "-120%", opacity: 0 },
    animatePresenceMode = "wait",
    animatePresenceInitial = false,
    rotationInterval = 2000,
    staggerDuration = 0,
    staggerFrom = "first",
    loop = true,
    auto = true,
    splitBy = "characters",
    onNext,
    mainClassName,
    splitLevelClassName,
    elementLevelClassName,
    segmenterLocale = "en",
    className,
    ...restProps
  },
  ref,
) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [contentWidth, setContentWidth] = useState<number>();
  const contentRef = useRef<HTMLSpanElement>(null);
  const currentText = texts[currentTextIndex] ?? "";

  const measureWidth = useCallback(() => {
    if (!contentRef.current) return;
    const nextWidth = Math.ceil(contentRef.current.scrollWidth);
    setContentWidth((prevWidth) => (prevWidth === nextWidth ? prevWidth : nextWidth));
  }, []);

  const splitIntoCharacters = useCallback(
    (text: string) => {
      if (typeof Intl !== "undefined" && Intl.Segmenter) {
        const segmenter = new Intl.Segmenter(segmenterLocale, { granularity: "grapheme" });
        return Array.from(segmenter.segment(text), (segment) => segment.segment);
      }
      return Array.from(text);
    },
    [segmenterLocale],
  );

  const elements = useMemo(() => {
    if (splitBy === "characters") {
      const words = currentText.split(" ");
      return words.map((word, index) => ({
        characters: splitIntoCharacters(word),
        needsSpace: index !== words.length - 1,
      }));
    }

    if (splitBy === "words") {
      return currentText.split(" ").map((word, index, array) => ({
        characters: [word],
        needsSpace: index !== array.length - 1,
      }));
    }

    if (splitBy === "lines") {
      return currentText.split("\n").map((line, index, array) => ({
        characters: [line],
        needsSpace: index !== array.length - 1,
      }));
    }

    return currentText.split(splitBy).map((part, index, array) => ({
      characters: [part],
      needsSpace: index !== array.length - 1,
    }));
  }, [currentText, splitBy, splitIntoCharacters]);

  const getStaggerDelay = useCallback(
    (index: number, totalChars: number) => {
      if (staggerFrom === "first") return index * staggerDuration;
      if (staggerFrom === "last") return (totalChars - 1 - index) * staggerDuration;
      if (staggerFrom === "center") {
        const center = Math.floor(totalChars / 2);
        return Math.abs(center - index) * staggerDuration;
      }
      if (staggerFrom === "random") {
        const randomIndex = Math.floor(Math.random() * totalChars);
        return Math.abs(randomIndex - index) * staggerDuration;
      }
      return Math.abs(staggerFrom - index) * staggerDuration;
    },
    [staggerDuration, staggerFrom],
  );

  const handleIndexChange = useCallback(
    (newIndex: number) => {
      setCurrentTextIndex(newIndex);
      onNext?.(newIndex);
    },
    [onNext],
  );

  const next = useCallback(() => {
    const nextIndex =
      currentTextIndex === texts.length - 1 ? (loop ? 0 : currentTextIndex) : currentTextIndex + 1;
    if (nextIndex !== currentTextIndex) {
      handleIndexChange(nextIndex);
    }
  }, [currentTextIndex, handleIndexChange, loop, texts.length]);

  const previous = useCallback(() => {
    const previousIndex =
      currentTextIndex === 0 ? (loop ? texts.length - 1 : currentTextIndex) : currentTextIndex - 1;
    if (previousIndex !== currentTextIndex) {
      handleIndexChange(previousIndex);
    }
  }, [currentTextIndex, handleIndexChange, loop, texts.length]);

  const jumpTo = useCallback(
    (index: number) => {
      const validIndex = Math.max(0, Math.min(index, texts.length - 1));
      if (validIndex !== currentTextIndex) {
        handleIndexChange(validIndex);
      }
    },
    [currentTextIndex, handleIndexChange, texts.length],
  );

  const reset = useCallback(() => {
    if (currentTextIndex !== 0) {
      handleIndexChange(0);
    }
  }, [currentTextIndex, handleIndexChange]);

  useImperativeHandle(ref, () => ({ next, previous, jumpTo, reset }), [
    jumpTo,
    next,
    previous,
    reset,
  ]);

  useEffect(() => {
    if (!auto || texts.length <= 1) return;
    const intervalId = window.setInterval(next, rotationInterval);
    return () => window.clearInterval(intervalId);
  }, [auto, next, rotationInterval, texts.length]);

  useLayoutEffect(() => {
    measureWidth();

    // 在挂载后的前500ms内，使用 rAF 高频轮询宽度
    // 以防止自定义字体加载或样式突变导致测量滞后
    let rafId: number;
    const startTime = performance.now();

    const checkWidthLoop = (currentTime: number) => {
      measureWidth();
      if (currentTime - startTime < 500) {
        rafId = window.requestAnimationFrame(checkWidthLoop);
      }
    };
    rafId = window.requestAnimationFrame(checkWidthLoop);

    let resizeObserver: ResizeObserver | undefined;

    if (contentRef.current && typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        measureWidth();
      });
      resizeObserver.observe(contentRef.current);
    }

    let isMounted = true;
    const fontsReady = document.fonts?.ready;

    if (fontsReady) {
      void fontsReady.then(() => {
        if (isMounted) {
          measureWidth();
        }
      });
    }

    return () => {
      isMounted = false;
      window.cancelAnimationFrame(rafId);
      resizeObserver?.disconnect();
    };
  }, [currentText, measureWidth]);

  const totalCharacters = elements.reduce((sum, word) => sum + word.characters.length, 0);

  return (
    <motion.span
      {...restProps}
      className={cn(styles.root, className, mainClassName)}
      // 核心修改 1：不再使用 layout，完全交由 animate 驱动宽度变化
      initial={{ width: "auto" }}
      animate={contentWidth ? { width: contentWidth } : { width: "auto" }}
      transition={layoutTransition ?? transition}
    >
      <span className={styles.srOnly}>{currentText}</span>
      <AnimatePresence mode={animatePresenceMode} initial={animatePresenceInitial}>
        <motion.span
          key={currentTextIndex}
          ref={contentRef}
          className={cn(splitBy === "lines" ? styles.lines : styles.content)}
          layout="position"
          aria-hidden="true"
        >
          {elements.map((word, wordIndex, array) => {
            const previousCharsCount = array
              .slice(0, wordIndex)
              .reduce((sum, item) => sum + item.characters.length, 0);

            return (
              <span key={wordIndex} className={cn(styles.word, splitLevelClassName)}>
                {word.characters.map((char, charIndex) => (
                  <motion.span
                    key={`${char}-${charIndex}`}
                    initial={initial}
                    animate={animate}
                    exit={exit}
                    transition={{
                      ...transition,
                      delay: getStaggerDelay(previousCharsCount + charIndex, totalCharacters),
                    }}
                    className={cn(styles.element, elementLevelClassName)}
                  >
                    {char}
                  </motion.span>
                ))}
                {word.needsSpace ? <span className={styles.space}> </span> : null}
              </span>
            );
          })}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
});
