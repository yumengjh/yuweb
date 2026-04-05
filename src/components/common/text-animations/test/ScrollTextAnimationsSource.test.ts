import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

describe("scroll text animations source parity", () => {
  it("keeps ScrollFloatTitle aligned with the React Bits GSAP implementation defaults", () => {
    const source = readFileSync(
      path.resolve(process.cwd(), "src/components/common/text-animations/ScrollFloatTitle.tsx"),
      "utf8",
    );

    expect(source).toContain('from "gsap"');
    expect(source).toContain('from "gsap/ScrollTrigger"');
    expect(source).toContain("animationDuration = 1");
    expect(source).toContain('ease = "back.inOut(2)"');
    expect(source).toContain('scrollStart = "center bottom+=50%"');
    expect(source).toContain('scrollEnd = "bottom bottom-=40%"');
    expect(source).toContain("stagger = 0.03");
    expect(source).toContain("fromOpacity = 0");
    expect(source).toContain("fromYPercent = 120");
    expect(source).toContain("fromScaleY = 2.3");
    expect(source).toContain("fromScaleX = 0.7");
    expect(source).toContain("className={styles.word}");
    expect(source).toContain("className={cn(styles.text, className, textClassName)}");
    expect(source).toContain('aria-hidden="true"');
    expect(source).toContain("yPercent: fromYPercent");
    expect(source).toContain("scaleY: fromScaleY");
    expect(source).toContain("scaleX: fromScaleX");
  });

  it("keeps SplitText aligned with the React Bits GSAP implementation defaults", () => {
    const source = readFileSync(
      path.resolve(process.cwd(), "src/components/common/text-animations/SplitText.tsx"),
      "utf8",
    );

    expect(source).toContain('from "gsap/SplitText"');
    expect(source).toContain('from "@gsap/react"');
    expect(source).toContain("delay = 50");
    expect(source).toContain("duration = 1.25");
    expect(source).toContain('ease = "power3.out"');
    expect(source).toContain('splitType = "chars"');
    expect(source).toContain("threshold = 0.1");
    expect(source).toContain('rootMargin = "-100px"');
    expect(source).toContain('textAlign = "center"');
    expect(source).toContain("new GSAPSplitText");
    expect(source).toContain("ScrollTrigger");
    expect(source).toContain("useGSAP");
    expect(source).toContain("once: true");
  });

  it("keeps ScrollRevealText aligned with the React Bits GSAP implementation defaults", () => {
    const source = readFileSync(
      path.resolve(process.cwd(), "src/components/common/text-animations/ScrollRevealText.tsx"),
      "utf8",
    );

    expect(source).toContain('from "gsap"');
    expect(source).toContain('from "gsap/ScrollTrigger"');
    expect(source).toContain("enableBlur = true");
    expect(source).toContain("baseOpacity = 0.1");
    expect(source).toContain("baseRotation = 3");
    expect(source).toContain("blurStrength = 4");
    expect(source).toContain('splitMode = "auto"');
    expect(source).toContain('rotationStart = "top bottom"');
    expect(source).toContain('rotationEnd = "bottom bottom"');
    expect(source).toContain('wordAnimationStart = "top bottom"');
    expect(source).toContain('wordAnimationEnd = "top bottom-=16%"');
    expect(source).toContain("stagger = 0.05");
    expect(source).toContain("perWordTrigger = true");
    expect(source).toContain("trigger: wordElement");
    expect(source).toContain("className={cn(styles.text, className, textClassName)}");
    expect(source).toContain("new Intl.Segmenter");
    expect(source).toContain("start: rotationStart");
    expect(source).toContain("start: wordAnimationStart");
    expect(source).toContain("stagger");
    expect(source).toContain("scrub: true");
  });

  it("keeps home page free of text-animation component hookups", () => {
    const source = readFileSync(
      path.resolve(process.cwd(), "src/components/home-page/HomePage.tsx"),
      "utf8",
    );

    expect(source).not.toContain("<SplitText");
    expect(source).not.toContain("<ScrollRevealText");
  });

  it("syncs Lenis with ScrollTrigger on the home page smooth scroll helper", () => {
    const source = readFileSync(
      path.resolve(process.cwd(), "src/components/home-page/HomeSmoothScroll.tsx"),
      "utf8",
    );

    expect(source).toContain('from "gsap"');
    expect(source).toContain('from "gsap/ScrollTrigger"');
    expect(source).toContain('lenis.on("scroll", ScrollTrigger.update)');
    expect(source).toContain("gsap.ticker.add");
    expect(source).toContain("ScrollTrigger.refresh()");
  });
});
