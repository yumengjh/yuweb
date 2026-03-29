"use client";

import { motion, type Transition } from "motion/react";

import { RotatingText } from "@/components/common/rotating-text/RotatingText";

type HeroSummaryRotatingProps = {
  className: string;
  prefix: string;
  suffix: string;
  texts: readonly string[];
  segmenterLocale: string;
  rotatingClassName: string;
  rotatingSplitClassName: string;
  rotatingElementClassName: string;
  rotationInterval: number;
  staggerDuration: number;
  staggerFrom: "first" | "last" | "center" | "random" | number;
  initial: Record<string, string | number>;
  animate: Record<string, string | number>;
  exit: Record<string, string | number>;
  transition: Transition;
};

const summaryLayoutTransition: Transition = {
  type: "spring",
  damping: 28,
  stiffness: 240,
};

export function HeroSummaryRotating({
  className,
  prefix,
  suffix,
  texts,
  segmenterLocale,
  rotatingClassName,
  rotatingSplitClassName,
  rotatingElementClassName,
  rotationInterval,
  staggerDuration,
  staggerFrom,
  initial,
  animate,
  exit,
  transition,
}: HeroSummaryRotatingProps) {
  return (
    <motion.p className={className} layout transition={summaryLayoutTransition}>
      <motion.span layout="position">{prefix}</motion.span>
      <RotatingText
        texts={texts}
        segmenterLocale={segmenterLocale}
        splitBy="characters"
        mainClassName={rotatingClassName}
        splitLevelClassName={rotatingSplitClassName}
        elementLevelClassName={rotatingElementClassName}
        rotationInterval={rotationInterval}
        staggerDuration={staggerDuration}
        staggerFrom={staggerFrom}
        initial={initial}
        animate={animate}
        exit={exit}
        transition={transition}
        layoutTransition={summaryLayoutTransition}
      />
      <motion.span layout="position">{suffix}</motion.span>
    </motion.p>
  );
}
