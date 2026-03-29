"use client";
// cspell:words Compressa wdth wght

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

type TextPressureTag = "div" | "h1" | "h2" | "span";

type TextPressureProps = {
  text?: string;
  fontFamily?: string;
  fontUrl?: string;
  widthRange?: readonly [number, number];
  weightRange?: readonly [number, number];
  italicRange?: readonly [number, number];
  width?: boolean;
  weight?: boolean;
  italic?: boolean;
  alpha?: boolean;
  flex?: boolean;
  stroke?: boolean;
  scale?: boolean;
  textColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  smoothing?: number;
  className?: string;
  minFontSize?: number;
  renderTitleAs?: TextPressureTag;
};

function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;

  return Math.sqrt(dx * dx + dy * dy);
}

function getAttr(distance: number, maxDist: number, minVal: number, maxVal: number) {
  const val = maxVal - Math.abs((maxVal * distance) / maxDist);

  return Math.max(minVal, val + minVal);
}

function debounce<TArgs extends unknown[]>(func: (...args: TArgs) => void, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return (...args: TArgs) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export function TextPressure({
  text = "Compressa",
  fontFamily = "Compressa VF",
  fontUrl = "/fonts/CompressaPRO-GX.woff2",
  widthRange = [65, 190],
  weightRange = [320, 900],
  italicRange = [0, 1],
  width = true,
  weight = true,
  italic = true,
  alpha = false,
  flex = true,
  stroke = false,
  scale = false,
  textColor = "#FFFFFF",
  strokeColor = "#FF0000",
  strokeWidth = 2.2,
  smoothing = 12,
  className = "",
  minFontSize = 24,
  renderTitleAs = "h1",
}: TextPressureProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLElement | null>(null);
  const spansRef = useRef<Array<HTMLSpanElement | null>>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const cursorRef = useRef({ x: 0, y: 0 });
  const [fontSize, setFontSize] = useState(minFontSize);
  const [scaleY, setScaleY] = useState(1);
  const [lineHeight, setLineHeight] = useState(1);
  const chars = Array.from(text);
  const TitleTag = renderTitleAs;

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      cursorRef.current.x = event.clientX;
      cursorRef.current.y = event.clientY;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];

      if (!touch) return;

      cursorRef.current.x = touch.clientX;
      cursorRef.current.y = touch.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    if (containerRef.current) {
      const {
        left,
        top,
        width: containerWidth,
        height: containerHeight,
      } = containerRef.current.getBoundingClientRect();

      mouseRef.current.x = left + containerWidth / 2;
      mouseRef.current.y = top + containerHeight / 2;
      cursorRef.current.x = mouseRef.current.x;
      cursorRef.current.y = mouseRef.current.y;
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  const setSize = useCallback(() => {
    if (!containerRef.current || !titleRef.current) return;

    const { width: containerWidth, height: containerHeight } =
      containerRef.current.getBoundingClientRect();

    let nextFontSize = containerWidth / (Math.max(chars.length, 1) / 2);
    nextFontSize = Math.max(nextFontSize, minFontSize);

    setFontSize(nextFontSize);
    setScaleY(1);
    setLineHeight(1);

    requestAnimationFrame(() => {
      if (!titleRef.current) return;

      const textRect = titleRef.current.getBoundingClientRect();

      if (scale && textRect.height > 0) {
        const yRatio = containerHeight / textRect.height;
        setScaleY(yRatio);
        setLineHeight(yRatio);
      }
    });
  }, [chars.length, minFontSize, scale]);

  useEffect(() => {
    const debouncedSetSize = debounce(setSize, 100);

    debouncedSetSize();
    window.addEventListener("resize", debouncedSetSize);

    return () => {
      window.removeEventListener("resize", debouncedSetSize);
    };
  }, [setSize]);

  useEffect(() => {
    let rafId = 0;

    const animate = () => {
      mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) / smoothing;
      mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) / smoothing;

      if (titleRef.current) {
        const titleRect = titleRef.current.getBoundingClientRect();
        const maxDist = titleRect.width / 2;

        spansRef.current.forEach((span) => {
          if (!span) return;

          const rect = span.getBoundingClientRect();
          const charCenter = {
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height / 2,
          };

          const d = dist(mouseRef.current, charCenter);
          const wdth = width ? Math.floor(getAttr(d, maxDist, widthRange[0], widthRange[1])) : 100;
          const wght = weight
            ? Math.floor(getAttr(d, maxDist, weightRange[0], weightRange[1]))
            : 400;
          const italVal = italic
            ? getAttr(d, maxDist, italicRange[0], italicRange[1]).toFixed(2)
            : "0";
          const alphaVal = alpha ? getAttr(d, maxDist, 0, 1).toFixed(2) : "1";
          const nextFontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`;

          if (span.style.fontVariationSettings !== nextFontVariationSettings) {
            span.style.fontVariationSettings = nextFontVariationSettings;
          }

          if (alpha && span.style.opacity !== alphaVal) {
            span.style.opacity = alphaVal;
          }
        });
      }

      rafId = window.requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [alpha, italic, italicRange, smoothing, weight, weightRange, width, widthRange]);

  const styleElement = useMemo<ReactNode>(() => {
    return (
      <style>{`
        @font-face {
          font-family: '${fontFamily}';
          src: url('${fontUrl}');
          font-style: normal;
        }

        .text-pressure-flex {
          display: flex;
          justify-content: space-between;
        }

        .text-pressure-stroke span {
          position: relative;
          color: ${textColor};
        }

        .text-pressure-stroke span::after {
          content: attr(data-char);
          position: absolute;
          left: 0;
          top: 0;
          color: transparent;
          z-index: -1;
          -webkit-text-stroke-width: ${strokeWidth}px;
          -webkit-text-stroke-color: ${strokeColor};
        }

        .text-pressure-title {
          color: ${textColor};
        }
      `}</style>
    );
  }, [fontFamily, fontUrl, strokeColor, strokeWidth, textColor]);

  const dynamicClassName = [
    className,
    flex ? "text-pressure-flex" : "",
    stroke ? "text-pressure-stroke" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: "transparent",
      }}
    >
      {styleElement}
      <TitleTag
        ref={(node) => {
          titleRef.current = node;
        }}
        className={`text-pressure-title ${dynamicClassName}`}
        style={{
          fontFamily,
          textTransform: "uppercase",
          fontSize,
          lineHeight,
          transform: `scale(1, ${scaleY})`,
          transformOrigin: "center top",
          margin: 0,
          textAlign: "center",
          userSelect: "none",
          whiteSpace: "nowrap",
          fontWeight: 100,
          width: "100%",
        }}
      >
        {chars.map((char, index) => (
          <span
            key={`${char}-${index}`}
            ref={(node) => {
              spansRef.current[index] = node;
            }}
            data-char={char}
            style={{
              display: "inline-block",
              color: stroke ? undefined : textColor,
            }}
          >
            {char}
          </span>
        ))}
      </TitleTag>
    </div>
  );
}
