"use client";
// cspell:words Nextdotjs Supabase Antdesign Rollupdotjs iconify logoloop

import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  SiDocker,
  SiGithub,
  SiNextdotjs,
  SiPrisma,
  SiReact,
  SiStripe,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiJavascript,
  SiVercel,
  SiNestjs,
  SiCloudflare,
  SiAntdesign,
  SiNginx,
  SiRollupdotjs,
  SiNetlify,
  SiNuxt,
} from "react-icons/si";

import { FaRust, FaVuejs } from "react-icons/fa";
import { GrMysql } from "react-icons/gr";
import { DiPostgresql } from "react-icons/di";
import { BiLogoVisualStudio } from "react-icons/bi";
import { AiOutlineOpenAI } from "react-icons/ai";
import { RiClaudeLine, RiGeminiFill, RiSvelteFill } from "react-icons/ri";

type LogoItem = {
  node: ReactNode;
  title: string;
  href: string;
  queryUrl: string;
  ariaLabel?: string;
};

// 默认滚动速度，单位 px/s。
export const TECH_LOGO_LOOP_SPEED = 120;
// 鼠标悬停时的目标速度，设为 0 表示缓停到静止。
export const TECH_LOGO_LOOP_HOVER_SPEED = 0;
// 图标视觉高度，单位 px。
export const TECH_LOGO_LOOP_LOGO_HEIGHT = 36;
// 相邻图标之间的水平间距，单位 px。
export const TECH_LOGO_LOOP_GAP = 40;
// 是否启用左右两侧渐隐。
export const TECH_LOGO_LOOP_FADE_OUT = true;
// 是否启用图标 hover 放大。
export const TECH_LOGO_LOOP_SCALE_ON_HOVER = false;
// 正常滚动时的速度平滑系数，越小越快贴近目标速度。
export const TECH_LOGO_LOOP_SMOOTH_TAU = 0.22;
// 悬停缓停时的速度平滑系数，越小停得越快。
export const TECH_LOGO_LOOP_HOVER_SMOOTH_TAU = 0.55;
// 至少渲染多少份重复轨道，避免宽屏下出现空白。
export const TECH_LOGO_LOOP_MIN_COPIES = 2;
// 在视口填满基础上额外补多少份轨道，保证无限循环观感。
export const TECH_LOGO_LOOP_COPY_HEADROOM = 2;

const iconifySearchUrl = (query: string) =>
  `https://api.iconify.design/search?query=${query}&prefix=logos`;

const createLogoItem = (node: ReactNode, title: string, href: string, query: string): LogoItem => ({
  node,
  title,
  href,
  queryUrl: iconifySearchUrl(query),
});

const frontendLogos: readonly LogoItem[] = [
  createLogoItem(<SiReact />, "React", "https://react.dev/", "react"),
  createLogoItem(<SiNextdotjs />, "Next.js", "https://nextjs.org/", "nextjs"),
  createLogoItem(<FaVuejs />, "Vue", "https://vuejs.org/", "vuejs"),
  createLogoItem(<SiNuxt />, "Nuxt", "https://nuxt.com/", "nuxt"),
  createLogoItem(<RiSvelteFill />, "Svelte", "https://svelte.dev/", "svelte"),
  createLogoItem(<SiTypescript />, "TypeScript", "https://www.typescriptlang.org/", "typescript"),
  createLogoItem(
    <SiJavascript />,
    "JavaScript",
    "https://developer.mozilla.org/docs/Web/JavaScript",
    "javascript",
  ),
  createLogoItem(<SiTailwindcss />, "Tailwind CSS", "https://tailwindcss.com/", "tailwindcss"),
  createLogoItem(<SiAntdesign />, "Ant Design", "https://ant.design/", "ant-design"),
];

const backendLogos: readonly LogoItem[] = [
  createLogoItem(<SiNestjs />, "NestJS", "https://nestjs.com/", "nestjs"),
  createLogoItem(<SiPrisma />, "Prisma", "https://www.prisma.io/", "prisma"),
  createLogoItem(<SiSupabase />, "Supabase", "https://supabase.com/", "supabase"),
  createLogoItem(<GrMysql />, "MySQL", "https://www.mysql.com/", "mysql"),
  createLogoItem(<DiPostgresql />, "PostgreSQL", "https://www.postgresql.org/", "postgresql"),
  createLogoItem(<FaRust />, "Rust", "https://www.rust-lang.org/", "rust"),
];

const infrastructureLogos: readonly LogoItem[] = [
  createLogoItem(<SiDocker />, "Docker", "https://www.docker.com/", "docker"),
  createLogoItem(<SiVercel />, "Vercel", "https://vercel.com/", "vercel"),
  createLogoItem(<SiStripe />, "Stripe", "https://stripe.com/", "stripe"),
  createLogoItem(<SiCloudflare />, "Cloudflare", "https://www.cloudflare.com/", "cloudflare"),
  createLogoItem(<SiNginx />, "Nginx", "https://nginx.org/", "nginx"),
  createLogoItem(<SiNetlify />, "Netlify", "https://www.netlify.com/", "netlify"),
  createLogoItem(<SiRollupdotjs />, "Rollup", "https://rollupjs.org/", "rollup"),
  createLogoItem(
    <BiLogoVisualStudio />,
    "VS Code",
    "https://code.visualstudio.com/",
    "visual-studio-code",
  ),
  createLogoItem(<SiGithub />, "GitHub", "https://github.com/", "github"),
];

const aiLogos: readonly LogoItem[] = [
  createLogoItem(<AiOutlineOpenAI />, "OpenAI", "https://openai.com/", "openai"),
  createLogoItem(<RiGeminiFill />, "Gemini", "https://gemini.google.com/", "gemini"),
  createLogoItem(<RiClaudeLine />, "Claude", "https://claude.ai/", "claude"),
];

const techLogos: readonly LogoItem[] = [
  ...frontendLogos,
  ...backendLogos,
  ...infrastructureLogos,
  ...aiLogos,
];

const toCssLength = (value: number | string | undefined) =>
  typeof value === "number" ? `${value}px` : (value ?? undefined);

const sectionStyle: CSSProperties = {
  margin: "0 calc(50% - 50vw)",
  padding: "0 0 clamp(2.2rem, 4vw, 3.5rem)",
};

const rootStyle: CSSProperties = {
  position: "relative",
  width: "100%",
  overflow: "hidden",
  color: "var(--c-ink-strong)",
};

const trackStyleBase: CSSProperties = {
  display: "flex",
  width: "max-content",
  willChange: "transform",
  userSelect: "none",
  position: "relative",
  zIndex: 0,
};

const listStyleBase: CSSProperties = {
  display: "flex",
  alignItems: "center",
  margin: 0,
  padding: 0,
  listStyle: "none",
};

const fadeWidth = "clamp(24px, 8%, 120px)";
const fadeSideBase: CSSProperties = {
  position: "absolute",
  top: 0,
  bottom: 0,
  width: fadeWidth,
  pointerEvents: "none",
  zIndex: 10,
};

const itemBaseStyle: CSSProperties = {
  flex: "0 0 auto",
  lineHeight: 1,
};

const linkStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  textDecoration: "none",
  borderRadius: 4,
  transition: "opacity 0.2s ease",
  color: "inherit",
};

const nodeStyleBase: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  color: "inherit",
};

type LogoLoopProps = {
  logos: readonly LogoItem[];
  speed?: number;
  direction?: "left" | "right" | "up" | "down";
  width?: number | string;
  logoHeight?: number;
  gap?: number;
  hoverSpeed?: number;
  fadeOut?: boolean;
  fadeOutColor?: string;
  scaleOnHover?: boolean;
  ariaLabel?: string;
  style?: CSSProperties;
};

type LogoItemViewProps = {
  item: LogoItem;
  gap: number;
  logoHeight: number;
  scaleOnHover: boolean;
};

function LogoItemView({ item, gap, logoHeight, scaleOnHover }: LogoItemViewProps) {
  const itemStyle = {
    ...itemBaseStyle,
    marginRight: `${gap}px`,
    fontSize: `${logoHeight}px`,
  } as CSSProperties;

  const nodeStyle = {
    ...nodeStyleBase,
    ...(scaleOnHover ? { transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)" } : null),
  } as CSSProperties;

  const iconStyle = {
    display: "block",
    width: "auto",
    height: `${logoHeight}px`,
    objectFit: "contain",
    imageRendering: "-webkit-optimize-contrast",
    WebkitUserDrag: "none",
    pointerEvents: "none",
    fill: "currentColor",
  } as CSSProperties;

  return (
    <li style={itemStyle} role="listitem">
      <a
        style={linkStyle}
        href={item.href}
        aria-label={item.ariaLabel ?? item.title}
        target="_blank"
        rel="noreferrer noopener"
        data-icon-query-url={item.queryUrl}
      >
        <span style={nodeStyle} aria-hidden="true">
          <span style={iconStyle}>{item.node}</span>
        </span>
      </a>
    </li>
  );
}

const LogoLoop = memo(function LogoLoop({
  logos,
  speed = 100,
  direction = "left",
  width = "100%",
  logoHeight = 60,
  gap = 60,
  hoverSpeed = 0,
  fadeOut = true,
  scaleOnHover = true,
  ariaLabel = "Partner logos",
  style,
}: LogoLoopProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const seqRef = useRef<HTMLUListElement | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);

  const [seqWidth, setSeqWidth] = useState(0);
  const [seqHeight, setSeqHeight] = useState(0);
  const [copyCount, setCopyCount] = useState<number>(TECH_LOGO_LOOP_MIN_COPIES);
  const [isHovered, setIsHovered] = useState(false);

  const effectiveHoverSpeed = useMemo(() => hoverSpeed, [hoverSpeed]);
  const isVertical = direction === "up" || direction === "down";

  const targetVelocity = useMemo(() => {
    const magnitude = Math.abs(speed);
    const directionMultiplier = isVertical
      ? direction === "up"
        ? 1
        : -1
      : direction === "left"
        ? 1
        : -1;
    const speedMultiplier = speed < 0 ? -1 : 1;
    return magnitude * directionMultiplier * speedMultiplier;
  }, [speed, direction, isVertical]);

  const updateDimensions = useCallback(() => {
    const containerWidth = containerRef.current?.clientWidth ?? 0;
    const sequenceRect = seqRef.current?.getBoundingClientRect?.();
    const sequenceWidth = sequenceRect?.width ?? 0;
    const sequenceHeight = sequenceRect?.height ?? 0;

    if (isVertical) {
      const parentHeight = containerRef.current?.parentElement?.clientHeight ?? 0;
      if (containerRef.current && parentHeight > 0) {
        const targetHeight = Math.ceil(parentHeight);
        if (containerRef.current.style.height !== `${targetHeight}px`) {
          containerRef.current.style.height = `${targetHeight}px`;
        }
      }

      if (sequenceHeight > 0) {
        setSeqHeight(Math.ceil(sequenceHeight));
        const viewport = containerRef.current?.clientHeight ?? parentHeight ?? sequenceHeight;
        const copiesNeeded = Math.ceil(viewport / sequenceHeight) + TECH_LOGO_LOOP_COPY_HEADROOM;
        setCopyCount(Math.max(TECH_LOGO_LOOP_MIN_COPIES, copiesNeeded));
      }
    } else if (sequenceWidth > 0) {
      setSeqWidth(Math.ceil(sequenceWidth));
      const copiesNeeded = Math.ceil(containerWidth / sequenceWidth) + TECH_LOGO_LOOP_COPY_HEADROOM;
      setCopyCount(Math.max(TECH_LOGO_LOOP_MIN_COPIES, copiesNeeded));
    }
  }, [isVertical]);

  useEffect(() => {
    const callback = () => updateDimensions();

    if (typeof window === "undefined") return undefined;

    if (!window.ResizeObserver) {
      window.addEventListener("resize", callback);
      callback();
      return () => window.removeEventListener("resize", callback);
    }

    const observedElements = [containerRef, seqRef];
    const observers = observedElements.map((ref) => {
      if (!ref.current) return null;
      const observer = new ResizeObserver(callback);
      observer.observe(ref.current);
      return observer;
    });

    callback();
    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, [updateDimensions, logos, gap, logoHeight, isVertical]);

  useEffect(() => {
    const images = seqRef.current?.querySelectorAll("img") ?? [];
    if (images.length === 0) {
      const raf = window.requestAnimationFrame(updateDimensions);
      return () => window.cancelAnimationFrame(raf);
    }

    let remaining = images.length;
    const handleLoad = () => {
      remaining -= 1;
      if (remaining === 0) updateDimensions();
    };

    images.forEach((img) => {
      const htmlImg = img as HTMLImageElement;
      if (htmlImg.complete) {
        handleLoad();
      } else {
        htmlImg.addEventListener("load", handleLoad, { once: true });
        htmlImg.addEventListener("error", handleLoad, { once: true });
      }
    });

    return () => {
      images.forEach((img) => {
        img.removeEventListener("load", handleLoad);
        img.removeEventListener("error", handleLoad);
      });
    };
  }, [logos, gap, logoHeight, isVertical, updateDimensions]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    const seqSize = isVertical ? seqHeight : seqWidth;
    let rafId: number | null = null;
    if (seqSize > 0) {
      offsetRef.current = ((offsetRef.current % seqSize) + seqSize) % seqSize;
      track.style.transform = isVertical
        ? `translate3d(0, ${-offsetRef.current}px, 0)`
        : `translate3d(${-offsetRef.current}px, 0, 0)`;
    }

    const animate = (timestamp: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }

      const deltaTime = Math.max(0, timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      const target = isHovered ? effectiveHoverSpeed : targetVelocity;
      const smoothTau = isHovered ? TECH_LOGO_LOOP_HOVER_SMOOTH_TAU : TECH_LOGO_LOOP_SMOOTH_TAU;
      const easingFactor = 1 - Math.exp(-deltaTime / smoothTau);
      velocityRef.current += (target - velocityRef.current) * easingFactor;

      if (seqSize > 0) {
        let nextOffset = offsetRef.current + velocityRef.current * deltaTime;
        nextOffset = ((nextOffset % seqSize) + seqSize) % seqSize;
        offsetRef.current = nextOffset;

        track.style.transform = isVertical
          ? `translate3d(0, ${-offsetRef.current}px, 0)`
          : `translate3d(${-offsetRef.current}px, 0, 0)`;
      }

      rafId = window.requestAnimationFrame(animate);
    };

    rafId = window.requestAnimationFrame(animate);

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }

      lastTimestampRef.current = null;
    };
  }, [targetVelocity, seqWidth, seqHeight, isHovered, effectiveHoverSpeed, isVertical]);

  const cssVariables = useMemo(
    () =>
      ({
        "--logoloop-gap": `${gap}px`,
        "--logoloop-logoHeight": `${logoHeight}px`,
      }) as CSSProperties,
    [gap, logoHeight],
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const logoLists = useMemo(
    () =>
      Array.from({ length: copyCount }, (_, copyIndex) => {
        return (
          <ul
            style={listStyleBase}
            key={`copy-${copyIndex}`}
            role="list"
            aria-hidden={copyIndex > 0}
            ref={copyIndex === 0 ? seqRef : undefined}
          >
            {logos.map((item, itemIndex) => (
              <LogoItemView
                key={`${copyIndex}-${itemIndex}`}
                item={item}
                gap={gap}
                logoHeight={logoHeight}
                scaleOnHover={scaleOnHover}
              />
            ))}
          </ul>
        );
      }),
    [copyCount, logos, gap, logoHeight, scaleOnHover],
  );

  const combinedRootStyle = useMemo(
    () =>
      ({
        ...rootStyle,
        ...(width
          ? { width: isVertical ? (toCssLength(width) ?? "100%") : (toCssLength(width) ?? "100%") }
          : null),
        ...cssVariables,
        ...style,
      }) as CSSProperties,
    [width, cssVariables, style, isVertical],
  );

  const fadeLeftStyle = {
    ...fadeSideBase,
    left: 0,
    background:
      "linear-gradient(to right, var(--logoloop-fadeColor, var(--c-bg)) 0%, rgb(0 0 0 / 0%) 100%)",
  } as CSSProperties;

  const fadeRightStyle = {
    ...fadeSideBase,
    right: 0,
    background:
      "linear-gradient(to left, var(--logoloop-fadeColor, var(--c-bg)) 0%, rgb(0 0 0 / 0%) 100%)",
  } as CSSProperties;

  return (
    <div ref={containerRef} style={combinedRootStyle} role="region" aria-label={ariaLabel}>
      {fadeOut ? <div style={fadeLeftStyle} aria-hidden="true" /> : null}
      {fadeOut ? <div style={fadeRightStyle} aria-hidden="true" /> : null}
      <div
        style={trackStyleBase}
        ref={trackRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {logoLists}
      </div>
    </div>
  );
});

LogoLoop.displayName = "LogoLoop";

export function TechLogoLoop() {
  return (
    <section style={sectionStyle}>
      <LogoLoop
        logos={techLogos}
        speed={TECH_LOGO_LOOP_SPEED}
        direction="left"
        logoHeight={TECH_LOGO_LOOP_LOGO_HEIGHT}
        gap={TECH_LOGO_LOOP_GAP}
        hoverSpeed={TECH_LOGO_LOOP_HOVER_SPEED}
        fadeOut={TECH_LOGO_LOOP_FADE_OUT}
        scaleOnHover={TECH_LOGO_LOOP_SCALE_ON_HOVER}
        ariaLabel="Our tech stack"
      />
    </section>
  );
}

export default TechLogoLoop;
