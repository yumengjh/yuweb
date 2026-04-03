"use client";
/* eslint-disable @next/next/no-img-element */
// cspell:words peelback

import { type CSSProperties, type RefObject, useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

import styles from "./StickerPeel.module.scss";

gsap.registerPlugin(Draggable);

export type StickerPeelInitialPosition =
  | "center"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | {
      x: number;
      y: number;
    };

export type StickerPeelResolvedConfig = {
  width: number;
  rotate: number;
  peelBackHoverPct: number;
  peelBackActivePct: number;
  lightingIntensity: number;
  shadowIntensity: number;
  peelDirection: number;
  maxDragRotation: number;
  dragRotationFactor: number;
  dragRotationDuration: number;
  resetDuration: number;
  initialPosition: StickerPeelInitialPosition;
};

export type StickerPeelResponsiveConfig = {
  name: string;
  minWidth?: number;
  maxWidth?: number;
  overrides: Partial<StickerPeelResolvedConfig>;
};

export type StickerPeelConfig = Partial<StickerPeelResolvedConfig> & {
  responsiveConfigs?: StickerPeelResponsiveConfig[];
};

type RectLike = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type StickerPeelVisualOverflow = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export type StickerPeelDragBounds = {
  left: number;
  top: number;
  width: number;
  height: number;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

export const STICKER_PEEL_DEFAULT_BASE_CONFIG: StickerPeelResolvedConfig = {
  width: 168, // 贴纸默认宽度（px）
  rotate: 0, // 图片本体的初始旋转角度（deg）
  peelBackHoverPct: 30, // 鼠标悬停时顶部折起的百分比
  peelBackActivePct: 40, // 按下或拖拽时顶部折起的百分比
  lightingIntensity: 0.1, // 正面高光强度
  shadowIntensity: 0.5, // 阴影强度
  peelDirection: 0, // 折页方向角度，0 表示默认朝上折
  maxDragRotation: 60, // 拖拽时允许的最大倾斜角度（deg）
  dragRotationFactor: 1, // 横向拖拽位移映射到旋转角度的系数
  dragRotationDuration: 0.15, // 拖拽过程中旋转过渡时长（秒）
  resetDuration: 0.8, // 松手后回正动画时长（秒）
  initialPosition: {
    x: 1050, // 默认初始横坐标
    y: 200, // 默认初始纵坐标
  },
};

export const STICKER_PEEL_DEFAULT_RESPONSIVE_CONFIGS: StickerPeelResponsiveConfig[] = [
  {
    name: "desktop",
    minWidth: 1025,
    overrides: {},
  },
  {
    name: "tablet",
    minWidth: 768,
    maxWidth: 1024,
    overrides: {
      width: 140,
      initialPosition: {
        x: 580,
        y: 150,
      },
      maxDragRotation: 20,
    },
  },
  {
    name: "mobile",
    maxWidth: 767,
    overrides: {
      width: 90,
      initialPosition: {
        x: 196,
        y: 150,
      },
      maxDragRotation: 16,
      dragRotationFactor: 0.32,
      rotate: 0,
    },
  },
];

type StickerPeelProps = {
  imageSrc: string;
  alt?: string;
  className?: string;
  config?: StickerPeelConfig;
  boundsRef?: RefObject<HTMLElement | null>;
};

type DraggableLike = {
  kill: () => void;
  update: () => void;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function matchesViewportRule(viewportWidth: number, rule: StickerPeelResponsiveConfig) {
  const aboveMin = rule.minWidth === undefined || viewportWidth >= rule.minWidth;
  const belowMax = rule.maxWidth === undefined || viewportWidth <= rule.maxWidth;
  return aboveMin && belowMax;
}

function mergeResponsiveConfigs(
  defaults: StickerPeelResponsiveConfig[],
  overrides?: StickerPeelResponsiveConfig[],
) {
  if (!overrides?.length) {
    return defaults;
  }

  const merged = defaults.map((item) => ({ ...item, overrides: { ...item.overrides } }));

  for (const override of overrides) {
    const targetIndex = merged.findIndex((item) => item.name === override.name);

    if (targetIndex >= 0) {
      const target = merged[targetIndex];
      merged[targetIndex] = {
        ...target,
        ...override,
        overrides: {
          ...target.overrides,
          ...override.overrides,
        },
      };
      continue;
    }

    merged.push({
      ...override,
      overrides: { ...override.overrides },
    });
  }

  return merged;
}

export function mergeStickerPeelConfig(config?: StickerPeelConfig) {
  return {
    ...STICKER_PEEL_DEFAULT_BASE_CONFIG,
    ...config,
    responsiveConfigs: mergeResponsiveConfigs(
      STICKER_PEEL_DEFAULT_RESPONSIVE_CONFIGS,
      config?.responsiveConfigs,
    ),
  };
}

export function resolveStickerPeelConfig(
  viewportWidth: number,
  baseConfig: StickerPeelResolvedConfig = STICKER_PEEL_DEFAULT_BASE_CONFIG,
  responsiveConfigs: StickerPeelResponsiveConfig[] = STICKER_PEEL_DEFAULT_RESPONSIVE_CONFIGS,
) {
  return responsiveConfigs
    .filter((rule) => matchesViewportRule(viewportWidth, rule))
    .reduce<StickerPeelResolvedConfig>((resolved, rule) => ({ ...resolved, ...rule.overrides }), {
      ...baseConfig,
    });
}

export function resolveStickerPeelProfileName(
  viewportWidth: number,
  responsiveConfigs: StickerPeelResponsiveConfig[] = STICKER_PEEL_DEFAULT_RESPONSIVE_CONFIGS,
) {
  return responsiveConfigs.find((rule) => matchesViewportRule(viewportWidth, rule))?.name ?? "base";
}

function getViewportWidth() {
  if (typeof window === "undefined") {
    return 1440;
  }

  const documentWidth = document.documentElement.clientWidth;

  if (typeof documentWidth === "number" && Number.isFinite(documentWidth) && documentWidth > 0) {
    return Math.round(documentWidth);
  }

  const visualViewportWidth = window.visualViewport?.width;

  if (typeof visualViewportWidth === "number" && Number.isFinite(visualViewportWidth)) {
    return Math.round(visualViewportWidth);
  }

  if (typeof window.innerWidth === "number" && Number.isFinite(window.innerWidth)) {
    return Math.round(window.innerWidth);
  }

  return 1440;
}

function getInitialCoordinates(
  position: StickerPeelInitialPosition,
  minX: number,
  minY: number,
  maxX: number,
  maxY: number,
) {
  if (typeof position === "object") {
    return {
      x: clamp(position.x, minX, maxX),
      y: clamp(position.y, minY, maxY),
    };
  }

  switch (position) {
    case "top-left":
      return { x: minX, y: minY };
    case "top-right":
      return { x: maxX, y: minY };
    case "bottom-left":
      return { x: minX, y: maxY };
    case "bottom-right":
      return { x: maxX, y: maxY };
    case "center":
    default:
      return {
        x: (minX + maxX) / 2,
        y: (minY + maxY) / 2,
      };
  }
}

export function getStickerPeelVisualOverflow(
  targetRect: RectLike,
  visualRect: RectLike,
): StickerPeelVisualOverflow {
  const targetRight = targetRect.left + targetRect.width;
  const targetBottom = targetRect.top + targetRect.height;
  const visualRight = visualRect.left + visualRect.width;
  const visualBottom = visualRect.top + visualRect.height;

  return {
    left: Math.max(targetRect.left - visualRect.left, 0),
    top: Math.max(targetRect.top - visualRect.top, 0),
    right: Math.max(visualRight - targetRight, 0),
    bottom: Math.max(visualBottom - targetBottom, 0),
  };
}

export function getStickerPeelDragBounds(
  stageRect: Pick<RectLike, "width" | "height">,
  targetRect: Pick<RectLike, "width" | "height">,
  visualOverflow: StickerPeelVisualOverflow,
): StickerPeelDragBounds {
  const minX = visualOverflow.left;
  const minY = visualOverflow.top;
  const maxX = Math.max(stageRect.width - targetRect.width - visualOverflow.right, minX);
  const maxY = Math.max(stageRect.height - targetRect.height - visualOverflow.bottom, minY);

  return {
    left: minX,
    top: minY,
    width: Math.max(stageRect.width - visualOverflow.left - visualOverflow.right, 0),
    height: Math.max(stageRect.height - visualOverflow.top - visualOverflow.bottom, 0),
    minX,
    minY,
    maxX,
    maxY,
  };
}

export function StickerPeel({
  imageSrc,
  alt = "Sticker peel image",
  className,
  config,
  boundsRef,
}: StickerPeelProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragTargetRef = useRef<HTMLDivElement | null>(null);
  const pointLightRef = useRef<SVGFEPointLightElement | null>(null);
  const pointLightFlippedRef = useRef<SVGFEPointLightElement | null>(null);
  const draggableInstanceRef = useRef<DraggableLike | null>(null);
  const [windowLoaded, setWindowLoaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(getViewportWidth);

  useEffect(() => {
    const syncViewportWidth = () => {
      setViewportWidth(getViewportWidth());
    };

    syncViewportWidth();

    window.addEventListener("resize", syncViewportWidth);
    window.addEventListener("orientationchange", syncViewportWidth);
    window.visualViewport?.addEventListener("resize", syncViewportWidth);

    return () => {
      window.removeEventListener("resize", syncViewportWidth);
      window.removeEventListener("orientationchange", syncViewportWidth);
      window.visualViewport?.removeEventListener("resize", syncViewportWidth);
    };
  }, []);

  const mergedConfig = useMemo(() => mergeStickerPeelConfig(config), [config]);

  const baseConfig = useMemo<StickerPeelResolvedConfig>(
    () => ({
      width: mergedConfig.width,
      rotate: mergedConfig.rotate,
      peelBackHoverPct: mergedConfig.peelBackHoverPct,
      peelBackActivePct: mergedConfig.peelBackActivePct,
      lightingIntensity: mergedConfig.lightingIntensity,
      shadowIntensity: mergedConfig.shadowIntensity,
      peelDirection: mergedConfig.peelDirection,
      maxDragRotation: mergedConfig.maxDragRotation,
      dragRotationFactor: mergedConfig.dragRotationFactor,
      dragRotationDuration: mergedConfig.dragRotationDuration,
      resetDuration: mergedConfig.resetDuration,
      initialPosition: mergedConfig.initialPosition,
    }),
    [mergedConfig],
  );

  const responsiveConfig = useMemo(
    () => resolveStickerPeelConfig(viewportWidth, baseConfig, mergedConfig.responsiveConfigs),
    [baseConfig, mergedConfig.responsiveConfigs, viewportWidth],
  );

  const activeProfileName = useMemo(
    () => resolveStickerPeelProfileName(viewportWidth, mergedConfig.responsiveConfigs),
    [mergedConfig.responsiveConfigs, viewportWidth],
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const markLoaded = () => {
      setWindowLoaded(true);
    };

    if (document.readyState === "loading") {
      window.addEventListener("load", markLoaded, { once: true });
      return () => {
        window.removeEventListener("load", markLoaded);
      };
    }

    markLoaded();
  }, []);

  const cssVars = useMemo(
    () =>
      ({
        "--sticker-rotate": `${responsiveConfig.rotate}deg`,
        "--sticker-p": "10px",
        "--sticker-peelback-hover": `${responsiveConfig.peelBackHoverPct}%`,
        "--sticker-peelback-active": `${responsiveConfig.peelBackActivePct}%`,
        "--sticker-width": `${responsiveConfig.width}px`,
        "--sticker-shadow-opacity": responsiveConfig.shadowIntensity,
        "--sticker-lighting-constant": responsiveConfig.lightingIntensity,
        "--peel-direction": `${responsiveConfig.peelDirection}deg`,
      }) as CSSProperties,
    [responsiveConfig],
  );

  useEffect(() => {
    if (!windowLoaded || !imageLoaded) {
      return;
    }

    const boundsElement = boundsRef?.current ?? stageRef.current;
    const target = dragTargetRef.current;

    if (!boundsElement || !target) {
      return;
    }

    const getCurrentDragBounds = () => {
      const stageRect = boundsElement.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const visualRect = (containerRef.current ?? target).getBoundingClientRect();
      const visualOverflow = getStickerPeelVisualOverflow(targetRect, visualRect);

      return getStickerPeelDragBounds(stageRect, targetRect, visualOverflow);
    };

    const applyInitialPosition = () => {
      const dragBounds = getCurrentDragBounds();
      const { x, y } = getInitialCoordinates(
        responsiveConfig.initialPosition,
        dragBounds.minX,
        dragBounds.minY,
        dragBounds.maxX,
        dragBounds.maxY,
      );

      gsap.set(target, { x, y });
    };

    applyInitialPosition();

    const instance = Draggable.create(target, {
      type: "x,y",
      bounds: getCurrentDragBounds(),
      onDrag() {
        const rotation = gsap.utils.clamp(
          -responsiveConfig.maxDragRotation,
          responsiveConfig.maxDragRotation,
          this.deltaX * responsiveConfig.dragRotationFactor,
        );

        gsap.to(target, {
          rotation,
          duration: responsiveConfig.dragRotationDuration,
          ease: "power1.out",
          overwrite: true,
        });
      },
      onDragEnd() {
        gsap.to(target, {
          rotation: 0,
          duration: responsiveConfig.resetDuration,
          ease: "power2.out",
          overwrite: true,
        });
      },
    })[0] as DraggableLike;

    draggableInstanceRef.current = instance;

    const handleResize = () => {
      if (!draggableInstanceRef.current) {
        return;
      }

      draggableInstanceRef.current.update();

      const currentX = Number(gsap.getProperty(target, "x")) || 0;
      const currentY = Number(gsap.getProperty(target, "y")) || 0;
      const dragBounds = getCurrentDragBounds();

      gsap.to(target, {
        x: clamp(currentX, dragBounds.minX, dragBounds.maxX),
        y: clamp(currentY, dragBounds.minY, dragBounds.maxY),
        duration: 0.3,
        ease: "power2.out",
        overwrite: true,
      });
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    window.visualViewport?.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      window.visualViewport?.removeEventListener("resize", handleResize);
      draggableInstanceRef.current?.kill();
      draggableInstanceRef.current = null;
    };
  }, [boundsRef, imageLoaded, responsiveConfig, windowLoaded]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const updateLight = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      gsap.set(pointLightRef.current, { attr: { x, y } });

      if (Math.abs(responsiveConfig.peelDirection % 360) !== 180) {
        gsap.set(pointLightFlippedRef.current, {
          attr: {
            x,
            y: rect.height - y,
          },
        });
      } else {
        gsap.set(pointLightFlippedRef.current, { attr: { x: -1000, y: -1000 } });
      }
    };

    const handleTouchStart = () => {
      container.classList.add(styles.touchActive);
    };

    const handleTouchEnd = () => {
      container.classList.remove(styles.touchActive);
    };

    container.addEventListener("mousemove", updateLight);
    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("touchend", handleTouchEnd);
    container.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      container.removeEventListener("mousemove", updateLight);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [responsiveConfig.peelDirection]);

  return (
    <div
      ref={stageRef}
      className={[styles.stage, className].filter(Boolean).join(" ")}
      data-testid="sticker-peel"
      data-profile={activeProfileName}
      data-viewport={viewportWidth}
      data-width={responsiveConfig.width}
      data-x={
        typeof responsiveConfig.initialPosition === "object"
          ? responsiveConfig.initialPosition.x
          : ""
      }
      data-y={
        typeof responsiveConfig.initialPosition === "object"
          ? responsiveConfig.initialPosition.y
          : ""
      }
    >
      <div ref={dragTargetRef} className={styles.draggable} style={cssVars}>
        <div className={styles.rotateWrapper}>
          <svg width="0" height="0" aria-hidden="true" focusable="false">
            <defs>
              <filter id="sticker-peel-point-light" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1" result="blur" />
                <feSpecularLighting
                  result="spec"
                  in="blur"
                  specularExponent="100"
                  specularConstant={responsiveConfig.lightingIntensity}
                  lightingColor="white"
                >
                  <fePointLight ref={pointLightRef} x="100" y="100" z="300" />
                </feSpecularLighting>
                <feComposite in="spec" in2="SourceGraphic" result="lit" />
                <feComposite in="lit" in2="SourceAlpha" operator="in" />
              </filter>

              <filter
                id="sticker-peel-point-light-flipped"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feGaussianBlur stdDeviation="10" result="blur" />
                <feSpecularLighting
                  result="spec"
                  in="blur"
                  specularExponent="100"
                  specularConstant={responsiveConfig.lightingIntensity * 7}
                  lightingColor="white"
                >
                  <fePointLight ref={pointLightFlippedRef} x="100" y="100" z="300" />
                </feSpecularLighting>
                <feComposite in="spec" in2="SourceGraphic" result="lit" />
                <feComposite in="lit" in2="SourceAlpha" operator="in" />
              </filter>

              <filter id="sticker-peel-drop-shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow
                  dx="2"
                  dy="4"
                  stdDeviation={3 * responsiveConfig.shadowIntensity}
                  floodColor="black"
                  floodOpacity={responsiveConfig.shadowIntensity}
                />
              </filter>

              <filter id="sticker-peel-expand-fill" x="-50%" y="-50%" width="200%" height="200%">
                <feOffset dx="0" dy="0" in="SourceAlpha" result="shape" />
                <feFlood floodColor="rgb(179,179,179)" result="flood" />
                <feComposite operator="in" in="flood" in2="shape" />
              </filter>
            </defs>
          </svg>

          <div
            ref={containerRef}
            className={[styles.stickerContainer, imageLoaded ? styles.stickerContainerLoaded : ""]
              .filter(Boolean)
              .join(" ")}
          >
            <div className={styles.stickerMain}>
              <div className={styles.stickerLighting}>
                {windowLoaded ? (
                  <img
                    src={imageSrc}
                    alt={alt}
                    className={styles.stickerImage}
                    draggable="false"
                    onLoad={() => setImageLoaded(true)}
                    onContextMenu={(event) => event.preventDefault()}
                  />
                ) : null}
              </div>
            </div>

            <div className={styles.flap} aria-hidden="true">
              <div className={styles.flapLighting}>
                {windowLoaded ? (
                  <img
                    src={imageSrc}
                    alt=""
                    className={styles.flapImage}
                    draggable="false"
                    onLoad={() => setImageLoaded(true)}
                    onContextMenu={(event) => event.preventDefault()}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
