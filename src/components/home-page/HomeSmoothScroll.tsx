"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export function HomeSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.06,
      duration: 1.3,
      wheelMultiplier: 0.82,
      touchMultiplier: 1,
      autoRaf: false,
      smoothWheel: true,
      syncTouch: false,
    });

    const tickerHandler = (time: number) => {
      lenis.raf(time * 1000);
    };

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tickerHandler);
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(tickerHandler);
      lenis.destroy();
    };
  }, []);

  return null;
}
