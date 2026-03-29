import type { Metadata } from "next";

import { CollectionsPixelBackground } from "./CollectionsPixelBackground";
import styles from "./page.module.scss";

export const metadata: Metadata = {
  title: "Collections | YUMENGJH",
};

const collectionsBackgroundTuning = {
  variant: "default",
  gap: 6,
  speed: 10,
  delayScale: 0.8,
  disappearDelayScale: 1.45,
  disappearStep: 0.09,
  pulseHoldMs: 5000,
  pulseGapMs: 900,
  pulseRestartMs: 0,
} as const;

export default function CollectionsPage() {
  return (
    <div className={styles.pageShell}>
      <div className={styles.backgroundLayer}>
        <CollectionsPixelBackground
          initialDelayMs={500}
          aria-hidden="true"
          role="presentation"
          borderless
          className={styles.backgroundFrame}
          data-testid="collections-pixel-background"
          delayScale={collectionsBackgroundTuning.delayScale}
          disappearDelayScale={collectionsBackgroundTuning.disappearDelayScale}
          disappearStep={collectionsBackgroundTuning.disappearStep}
          gap={collectionsBackgroundTuning.gap}
          pulseGapMs={collectionsBackgroundTuning.pulseGapMs}
          pulseHoldMs={collectionsBackgroundTuning.pulseHoldMs}
          pulseRestartMs={collectionsBackgroundTuning.pulseRestartMs}
          speed={collectionsBackgroundTuning.speed}
          variant={collectionsBackgroundTuning.variant}
        />
      </div>
      <div className={styles.content} />
    </div>
  );
}
