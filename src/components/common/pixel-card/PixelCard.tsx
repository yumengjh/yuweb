"use client";

/**
 * PixelCard 粒子波纹卡片组件
 *
 * 这是一个基于 Canvas 的粒子扩散特效组件。它支持两种主要模式：
 * 1. 【交互模式】(pulse={false})：通过鼠标悬浮/失焦或手动控制 `active` 属性，触发粒子的出现与消失。
 * 2. 【循环波纹模式】(pulse={true})：自动循环播放从中心向外扩散、再从中心向外消失的涟漪/波纹效果。
 *
 * ==========================================
 * Pulse 模式的时间轴机制：
 * ==========================================
 * 1. 触发 [Appear波纹] 开始从中心向外扩散。
 * 2. 等待 `pulseHoldMs` 毫秒。（此时外圈可能还在扩散，内圈已经完全展现）
 * 3. 触发 [Disappear波纹] 开始从中心向外产生镂空消失。
 * 4. 【等待】直到 [Disappear波纹] 触达屏幕最边缘，画面上所有粒子完全消失（size<=0）。
 * 5. 彻底清空后，等待 `pulseGapMs` + `pulseRestartMs` 毫秒的纯白/空白期。
 * 6. 重新回到第 1 步。
 *
 * @example
 * // 基础循环用法
 * <PixelCard
 *   pulse={true}
 *   pulseHoldMs={1600}
 *   pulseGapMs={900}
 *   variant="blue"
 * />
 *
 * @param {boolean} active - [仅交互模式] 手动控制粒子是否处于展现状态。开启 pulse 时该属性失效。
 * @param {boolean} borderless - 是否移除卡片的默认边框和背景，通常用于纯背景层。
 * @param {string} colors - 自定义粒子颜色池，使用逗号分隔的 HEX 颜色字符串，例如："#dbeafe,#c4b5fd"。
 * @param {number} delayScale - [出现] 波纹的延迟缩放系数。值越小，整体向外扩散的速度越快。默认 1。
 * @param {number} disappearDelayScale - [消失] 波纹的延迟缩放系数。值越小，消失波纹向外追赶的速度越快。默认 1。
 * @param {number} disappearStep - 粒子消失时每一帧缩小的步长。值越大，单颗粒子消失得越突兀；值越小，单颗粒子消失越柔和。默认 0.1。
 * @param {number} gap - 粒子的网格间距（密度）。值越小，粒子越密集，对性能要求越高。推荐范围：5 ~ 15。
 * @param {boolean} interactive - 是否开启鼠标 Hover 和 Focus 交互效果。
 * @param {boolean} noFocus - 是否彻底禁用键盘 Focus 事件监听。
 * @param {boolean} pulse - 【核心属性】是否开启自动循环波纹模式。
 * @param {number} pulseHoldMs - [循环模式] 从触发"出现"到触发"消失"之间的等待时间（毫秒）。决定了画面能多大程度被粒子填满。
 * @param {number} pulseGapMs - [循环模式] 彻底消失干净后，到下一次重新出现的等待时间（毫秒）。
 * @param {number} pulseRestartMs - [循环模式] 额外的重启延迟缓冲时间，作用与 pulseGapMs 叠加。
 * @param {boolean} shimmer - 粒子展示到最大尺寸后，是否保持闪烁（呼吸）的动态效果。
 * @param {number} speed - 粒子闪烁（shimmer）时的缩放速度基数。
 * @param {"default"|"blue"|"yellow"|"pink"} variant - 预设的主题颜色变量。如果在 colors 传了自定义颜色，将覆盖这里的颜色配置。
 */

import {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type FocusEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { cn } from "@/utils/cn";
import styles from "./PixelCard.module.scss";

type PixelCardVariantConfig = {
  activeColor: string | null;
  colors: string;
  gap: number;
  noFocus: boolean;
  speed: number;
};

const pixelCardVariants: Record<string, PixelCardVariantConfig> = {
  default: {
    activeColor: "rgba(0, 0, 0, 0.5)",
    gap: 5,
    speed: 35,
    colors: "#f8fafc,#f1f5f9,#cbd5e1",
    noFocus: false,
  },
  blue: {
    activeColor: "#e0f2fe",
    gap: 10,
    speed: 25,
    colors: "#e0f2fe,#7dd3fc,#0ea5e9",
    noFocus: false,
  },
  yellow: {
    activeColor: "#fef08a",
    gap: 3,
    speed: 20,
    colors: "#fef08a,#fde047,#eab308",
    noFocus: false,
  },
  pink: {
    activeColor: "#fecdd3",
    gap: 6,
    speed: 80,
    colors: "#fecdd3,#fda4af,#e11d48",
    noFocus: true,
  },
};

class Pixel {
  private readonly width: number;
  private readonly height: number;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly x: number;
  private readonly y: number;
  private readonly color: string;
  private readonly speed: number;
  private size = 0;
  private readonly sizeStep = Math.random() * 0.4;
  private readonly minSize = 0.5;
  private readonly maxSizeInteger = 2;
  private readonly maxSize: number;
  private readonly appearDelay: number;
  private readonly disappearDelay: number;
  private counter = 0;
  private readonly counterStep: number;
  isIdle = false;
  private isReverse = false;
  private isShimmer = false;
  private readonly shimmerEnabled: boolean;
  private readonly disappearStep: number;
  private phase: "appear" | "disappear" | null = null;

  constructor(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
    speed: number,
    appearDelay: number,
    disappearDelay: number,
    shimmerEnabled: boolean,
    disappearStep: number,
  ) {
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = context;
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = this.getRandomValue(0.1, 0.9) * speed;
    this.maxSize = this.getRandomValue(this.minSize, this.maxSizeInteger);
    this.appearDelay = appearDelay;
    this.disappearDelay = disappearDelay;
    this.counterStep = Math.random() * 0.2 + 0.9; // 匀速波纹
    this.shimmerEnabled = shimmerEnabled;
    this.disappearStep = disappearStep;
  }

  private getRandomValue(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  private draw() {
    const centerOffset = this.maxSizeInteger * 0.5 - this.size * 0.5;
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x + centerOffset, this.y + centerOffset, this.size, this.size);
  }

  appear() {
    if (this.phase !== "appear") {
      this.phase = "appear";
      this.counter = 0;
      this.isIdle = false;
    }

    this.isIdle = false;

    if (this.counter <= this.appearDelay) {
      this.counter += this.counterStep;
      // 修复突然空白：如果粒子目前还有大小，就继续画出来，别直接变空气
      if (this.size > 0) this.draw();
      return;
    }

    if (this.size >= this.maxSize) {
      if (!this.shimmerEnabled) {
        this.size = this.maxSize;
        this.draw();
        this.isIdle = true;
        return;
      }
      this.isShimmer = true;
    }

    if (this.isShimmer) {
      this.shimmer();
    } else {
      this.size += this.sizeStep;
    }

    this.draw();
  }

  disappear() {
    if (this.phase !== "disappear") {
      this.phase = "disappear";
      this.counter = 0;
      this.isShimmer = false;
      this.isReverse = false;
      this.isIdle = false;
    }

    if (this.counter <= this.disappearDelay) {
      this.counter += this.counterStep;
      // 保持当前大小，等待消失延迟时间跑完
      if (this.size > 0) this.draw();
      return;
    }

    if (this.size <= 0) {
      this.isIdle = true;
      return;
    }

    this.size -= this.disappearStep;
    this.draw();
  }

  private shimmer() {
    if (this.size >= this.maxSize) {
      this.isReverse = true;
    } else if (this.size <= this.minSize) {
      this.isReverse = false;
    }

    if (this.isReverse) {
      this.size -= this.speed;
    } else {
      this.size += this.speed;
    }
  }
}

function getEffectiveSpeed(value: number, reducedMotion: boolean) {
  const min = 0;
  const max = 100;
  const throttle = 0.001;
  if (value <= min || reducedMotion) return min;
  if (value >= max) return max * throttle;
  return value * throttle;
}

function getPrefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function getCanvasContext(canvas: HTMLCanvasElement | null) {
  if (!canvas) return null;
  try {
    return canvas.getContext("2d");
  } catch {
    return null;
  }
}

export type PixelCardProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  glowColor?: string;
  active?: boolean;
  initialDelayMs?: number;
  borderless?: boolean;
  children?: ReactNode;
  colors?: string;
  delayScale?: number;
  disappearDelayScale?: number;
  disappearStep?: number;
  gap?: number;
  interactive?: boolean;
  noFocus?: boolean;
  pulse?: boolean;
  pulseGapMs?: number;
  pulseHoldMs?: number;
  pulseRestartMs?: number;
  shimmer?: boolean;
  speed?: number;
  variant?: string;
};

export function PixelCard({
  active = false,
  glowColor,
  borderless = false,
  initialDelayMs = 0,
  children,
  className,
  colors,
  delayScale = 1,
  disappearDelayScale = 1,
  disappearStep = 0.1,
  gap,
  interactive = true,
  noFocus,
  pulse = false,
  pulseGapMs = 1400,
  pulseHoldMs = 4400,
  pulseRestartMs = 900,
  shimmer = true,
  speed,
  style,
  variant = "default",
  ...restProps
}: PixelCardProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pixelsRef = useRef<Pixel[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const animationModeRef = useRef<"appear" | "disappear" | null>(null);
  const animationCompleteCallbackRef = useRef<(() => void) | null>(null);
  const previousTimeRef = useRef(0);
  const pulseTimersRef = useRef<number[]>([]);
  const [pulseVisualActive, setPulseVisualActive] = useState(active);

  const variantConfig = useMemo(() => {
    return pixelCardVariants[variant] ?? pixelCardVariants.default;
  }, [variant]);

  const finalGap = gap ?? variantConfig.gap;
  const finalSpeed = speed ?? variantConfig.speed;
  const finalColors = colors ?? variantConfig.colors;
  const finalNoFocus = noFocus ?? (!interactive || variantConfig.noFocus);
  const isVisuallyActive = pulse ? pulseVisualActive : active;

  const cancelAnimation = useCallback(() => {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const clearPulseTimers = useCallback(() => {
    for (const timerId of pulseTimersRef.current) {
      window.clearTimeout(timerId);
    }
    pulseTimersRef.current = [];
  }, []);

  const doAnimate = useCallback(
    (methodName: "appear" | "disappear") => {
      const loop = () => {
        animationFrameRef.current = window.requestAnimationFrame(loop);

        const timeNow = window.performance.now();
        const timePassed = timeNow - previousTimeRef.current;
        const timeInterval = 1000 / 60;

        if (timePassed < timeInterval) return;

        previousTimeRef.current = timeNow - (timePassed % timeInterval);

        const canvas = canvasRef.current;
        const context = getCanvasContext(canvas);

        if (!canvas || !context) {
          cancelAnimation();
          return;
        }

        context.clearRect(0, 0, canvas.width, canvas.height);

        let allIdle = true;
        for (const pixel of pixelsRef.current) {
          pixel[methodName]();
          if (!pixel.isIdle) {
            allIdle = false;
          }
        }

        // 动画全部完成时触发 callback（这里保证了消失的波浪一定能走到边界）
        if (allIdle) {
          const completedMode = animationModeRef.current;
          cancelAnimation();

          if (completedMode === methodName) {
            animationModeRef.current = null;
            const callback = animationCompleteCallbackRef.current;
            animationCompleteCallbackRef.current = null;
            callback?.();
          }
        }
      };

      animationFrameRef.current = window.requestAnimationFrame(loop);
    },
    [cancelAnimation],
  );

  const handleAnimation = useCallback(
    (methodName: "appear" | "disappear") => {
      cancelAnimation();
      animationModeRef.current = methodName;
      previousTimeRef.current = window.performance.now();
      doAnimate(methodName);
    },
    [cancelAnimation, doAnimate],
  );

  const initPixels = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const context = getCanvasContext(canvas);

    if (!container || !canvas || !context) {
      pixelsRef.current = [];
      return;
    }

    const rect = container.getBoundingClientRect();
    const width = Math.floor(rect.width);
    const height = Math.floor(rect.height);

    if (width <= 0 || height <= 0) return;

    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const reducedMotion = getPrefersReducedMotion();
    const colorsArray = finalColors
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    const pixels: Pixel[] = [];

    // 计算到对角线的最远距离
    const maxDistance = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));

    for (let x = 0; x < width; x += finalGap) {
      for (let y = 0; y < height; y += finalGap) {
        const color = colorsArray[Math.floor(Math.random() * colorsArray.length)] ?? colorsArray[0];
        const dx = x - width / 2;
        const dy = y - height / 2;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 使用相对距离计算延迟时间（约100帧）
        const normalizedDistance = distance / maxDistance;
        const baseDelay = reducedMotion ? 0 : normalizedDistance * 100;

        pixels.push(
          new Pixel(
            canvas,
            context,
            x,
            y,
            color,
            getEffectiveSpeed(finalSpeed, reducedMotion),
            baseDelay * delayScale,
            baseDelay * disappearDelayScale,
            shimmer,
            disappearStep,
          ),
        );
      }
    }

    pixelsRef.current = pixels;
    context.clearRect(0, 0, canvas.width, canvas.height);
  }, [delayScale, disappearDelayScale, disappearStep, finalColors, finalGap, finalSpeed, shimmer]);

  const lastSizeRef = useRef({ width: 0, height: 0 });
  const isVisuallyActiveRef = useRef(isVisuallyActive);

  useEffect(() => {
    isVisuallyActiveRef.current = isVisuallyActive;
  }, [isVisuallyActive]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      const width = Math.floor(rect.width);
      const height = Math.floor(rect.height);

      if (width === lastSizeRef.current.width && height === lastSizeRef.current.height) {
        return;
      }
      lastSizeRef.current = { width, height };

      initPixels();

      const mode =
        animationModeRef.current || (isVisuallyActiveRef.current ? "appear" : "disappear");
      handleAnimation(mode);
    };

    let observer: ResizeObserver;
    if (typeof ResizeObserver === "function") {
      observer = new ResizeObserver(() => handleResize());
      observer.observe(container);
    } else {
      window.addEventListener("resize", handleResize);
    }

    handleResize();

    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener("resize", handleResize);
      clearPulseTimers();
    };
  }, [clearPulseTimers, handleAnimation, initPixels]);

  useEffect(() => {
    if (pulse) return;
    handleAnimation(active ? "appear" : "disappear");
  }, [active, handleAnimation, pulse]);

  // 【核心机制恢复】：恢复了等待消失波浪完整触达边界的逻辑
  useEffect(() => {
    if (!pulse) {
      animationCompleteCallbackRef.current = null;
      return;
    }

    clearPulseTimers();

    const startCycle = () => {
      setPulseVisualActive(true);
      handleAnimation("appear");

      pulseTimersRef.current.push(
        window.setTimeout(() => {
          setPulseVisualActive(false);

          // 这里的关键：设置一个回调，等到 disappear 的波纹彻底执行完毕后，再触发等待时间
          animationCompleteCallbackRef.current = () => {
            pulseTimersRef.current.push(window.setTimeout(startCycle, pulseGapMs + pulseRestartMs));
          };

          handleAnimation("disappear");
        }, pulseHoldMs),
      );
    };

    if (initialDelayMs > 0) {
      pulseTimersRef.current.push(window.setTimeout(startCycle, initialDelayMs));
    } else {
      startCycle(); // 否则像以前一样立刻启动
    }

    return () => {
      animationCompleteCallbackRef.current = null;
      clearPulseTimers();
    };
  }, [
    clearPulseTimers,
    handleAnimation,
    initialDelayMs,
    pulse,
    pulseGapMs,
    pulseHoldMs,
    pulseRestartMs,
  ]);

  const handleEnter = useCallback(() => {
    if (!pulse) handleAnimation("appear");
  }, [handleAnimation, pulse]);

  const handleLeave = useCallback(() => {
    if (!pulse) handleAnimation(isVisuallyActive ? "appear" : "disappear");
  }, [handleAnimation, isVisuallyActive, pulse]);

  const handleFocus = useCallback(
    (event: FocusEvent<HTMLDivElement>) => {
      if (!pulse && !event.currentTarget.contains(event.relatedTarget)) {
        handleAnimation("appear");
      }
    },
    [handleAnimation, pulse],
  );

  const handleBlur = useCallback(
    (event: FocusEvent<HTMLDivElement>) => {
      if (!pulse && !event.currentTarget.contains(event.relatedTarget)) {
        handleAnimation(isVisuallyActive ? "appear" : "disappear");
      }
    },
    [handleAnimation, isVisuallyActive, pulse],
  );

  const mergedStyle = {
    ...style,
    "--pixel-card-active-color": variantConfig.activeColor ?? "var(--c-border)",
    // 优先使用传入的 glowColor，如果没有传，再降级使用原有的颜色
    "--pixel-card-glow": glowColor ?? variantConfig.activeColor ?? "rgba(196, 181, 253, 0.22)",
  } as CSSProperties;

  return (
    <div
      {...restProps}
      ref={containerRef}
      className={cn(styles.root, className)}
      data-active={isVisuallyActive ? "true" : "false"}
      data-borderless={borderless ? "true" : "false"}
      data-interactive={interactive ? "true" : "false"}
      onBlur={interactive && !finalNoFocus ? handleBlur : undefined}
      onFocus={interactive && !finalNoFocus ? handleFocus : undefined}
      onMouseEnter={interactive ? handleEnter : undefined}
      onMouseLeave={interactive ? handleLeave : undefined}
      style={mergedStyle}
      tabIndex={interactive && !finalNoFocus ? 0 : -1}
    >
      <canvas ref={canvasRef} className={styles.canvas} />
      {children ? <div className={styles.content}>{children}</div> : null}
    </div>
  );
}
