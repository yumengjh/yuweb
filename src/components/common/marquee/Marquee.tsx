import type { CSSProperties } from "react";

import styles from "./Marquee.module.scss";

export type MarqueeDirection = "left" | "right";

export interface MarqueeProps {
  items: readonly string[];
  separator?: string;
  speed?: number;
  gap?: string;
  direction?: MarqueeDirection;
  pauseOnHover?: boolean;
  ariaHidden?: boolean;
}

export function Marquee({
  items,
  separator = "·",
  speed = 36,
  gap = "14px",
  direction = "left",
  pauseOnHover = true,
  ariaHidden = true,
}: MarqueeProps) {
  const normalizedItems = items.length > 0 ? items : [""];
  const repeatCount = Math.max(10, Math.ceil(20 / normalizedItems.length));
  const marqueeCycle = Array.from(
    { length: normalizedItems.length * repeatCount },
    (_, index) => normalizedItems[index % normalizedItems.length],
  );

  const marqueeStyle = {
    "--marquee-duration": `${speed}s`,
    "--marquee-gap": gap,
  } as CSSProperties;

  const trackStyle = {
    animationDirection: direction === "right" ? "reverse" : "normal",
  } as CSSProperties;

  return (
    <div
      className={styles.marquee}
      aria-hidden={ariaHidden}
      style={marqueeStyle}
      data-pause-on-hover={pauseOnHover ? "true" : "false"}
    >
      <div className={styles.marqueeTrack} style={trackStyle}>
        {Array.from({ length: 2 }).map((_, sequenceIndex) => (
          <div key={sequenceIndex} className={styles.marqueeSequence}>
            {marqueeCycle.map((item, itemIndex) => (
              <span key={`${sequenceIndex}-${itemIndex}`} className={styles.marqueeItem}>
                <span>{item}</span>
                <span className={styles.marqueeSeparator}>{separator}</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
