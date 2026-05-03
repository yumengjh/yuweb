"use client";

import Link from "next/link";
import {
  ComponentType,
  ReactNode,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";

import { cn } from "@/utils/cn";

import styles from "./TopNavigationBar.module.scss";

// ─── Duration constants ───────────────────────────────────────────────────────

const ENABLE_HOVER_SWITCH_AFTER_OPEN = true;
const TOP_SCROLL_THRESHOLD_PX = 1;
// ─── Menu content types ───────────────────────────────────────────────────────

export type MenuEntry = {
  title: string;
  description?: string;
  href: string;
  target?: "_self" | "_blank" | "_parent" | "_top";
};

export type MenuGroup = {
  label?: string;
  entries: MenuEntry[];
};

export type MenuContent =
  | { kind: "entries"; entries: MenuEntry[] }
  | { kind: "groups"; groups: MenuGroup[] }
  | { kind: "component"; component?: ComponentType | (() => ReactNode); contentId?: string };

// ─── Navigation item ─────────────────────────────────────────────────────────

export type NavigationKey = string;

export type NavigationItem = {
  key: NavigationKey;
  label: string;
  href?: string;
  menu?: MenuContent;
  mobileMenu?: MenuGroup[];
};

// ─── Default navigation data ──────────────────────────────────────────────────

// const navigationItems: NavigationItem[] = [
//   {
//     key: "about",
//     label: "关于",
//     href: "/about",
//     menu: {
//       kind: "groups",
//       groups: [
//         {
//           label: "开始",
//           entries: [
//             {
//               title: "从这里开始",
//               description: "第一次来到这里，可以先从几个入口快速了解这个网站。",
//               href: "/about#start",
//             },
//             {
//               title: "这个网站",
//               description: "为什么会有这个网站，它想承载什么，又会如何继续生长。",
//               href: "/about#site",
//             },
//           ],
//         },
//         {
//           label: "关于我",
//           entries: [
//             {
//               title: "当前状态",
//               description: "我正在关注什么、推进什么，以及最近停留的问题。",
//               href: "/about#now",
//             },
//             {
//               title: "学习方式",
//               description: "我如何学习、记录、整理，并逐步形成自己的方法。",
//               href: "/about#learning",
//             },
//             {
//               title: "关注领域",
//               description: "长期关心的技术、设计、结构和表达方向。",
//               href: "/about#fields",
//             },
//           ],
//         },
//         {
//           label: "延伸",
//           entries: [
//             {
//               title: "技术栈",
//               description: "查看目前使用的工具、框架与页面系统组织方式。",
//               href: "/about#stack",
//             },
//             {
//               title: "查看关于页",
//               description: "进入完整的自我介绍与站点说明页面。",
//               href: "/about",
//             },
//           ],
//         },
//       ],
//     },
//   },

//   {
//     key: "notes",
//     label: "笔记",
//     href: "/notes",
//     menu: {
//       kind: "entries",
//       entries: [
//         {
//           title: "最近更新",
//           description: "最近记下的内容、正在延展的问题和新的观察。",
//           href: "/notes#recent",
//         },
//         {
//           title: "技术笔记",
//           description: "围绕框架、工程、交互与实现细节展开的个人记录。",
//           href: "/notes#tech",
//         },
//         {
//           title: "学习记录",
//           description: "正在学习的内容、阶段性理解与路径整理。",
//           href: "/notes#learning",
//         },
//         {
//           title: "灵感碎片",
//           description: "一些还没长成文章的判断、想法和短促记录。",
//           href: "/notes#fragments",
//         },
//         {
//           title: "问题与答案",
//           description: "把遇到的问题、拆解过程与暂时答案保留下来。",
//           href: "/notes#qa",
//         },
//         {
//           title: "查看笔记",
//           description: "进入全部公开笔记与记录。",
//           href: "/notes",
//         },
//       ],
//     },
//   },

//   {
//     key: "projects",
//     label: "项目",
//     href: "/projects",
//     menu: {
//       kind: "groups",
//       groups: [
//         {
//           label: "进行中",
//           entries: [
//             {
//               title: "正在做的事",
//               description: "查看目前仍在推进、迭代或打磨中的项目与页面。",
//               href: "/projects#in-progress",
//             },
//             {
//               title: "页面实验",
//               description: "一些围绕布局、交互和结构进行的持续实验。",
//               href: "/projects#experiments",
//             },
//           ],
//         },
//         {
//           label: "归档",
//           entries: [
//             {
//               title: "代表作品",
//               description: "当前阶段最能代表判断、表达和实现方式的项目。",
//               href: "/projects#featured",
//             },
//             {
//               title: "开源项目",
//               description: "已公开的仓库、工具与可以继续查看的实现记录。",
//               href: "/projects#opensource",
//             },
//           ],
//         },
//         {
//           label: "中止 / 未完成",
//           entries: [
//             {
//               title: "停止的想法",
//               description: "那些曾经认真开始、后来停下来的方向与设想。",
//               href: "/projects#abandoned-ideas",
//             },
//             {
//               title: "失败记录",
//               description: "做坏的页面、走偏的方案和最终放弃的项目尝试。",
//               href: "/projects#failures",
//             },
//             {
//               title: "查看项目页",
//               description: "进入完整的项目、实验与归档内容。",
//               href: "/projects",
//             },
//           ],
//         },
//       ],
//     },
//   },

//   {
//     key: "collections",
//     label: "收藏",
//     href: "/collections",
//     menu: {
//       kind: "entries",
//       entries: [
//         {
//           title: "书籍",
//           description: "留下来的书、反复翻看的部分，以及它们为何重要。",
//           href: "/collections#books",
//         },
//         {
//           title: "文章",
//           description: "收藏的博客文章、写作者与值得反复阅读的内容。",
//           href: "/collections#articles",
//         },
//         {
//           title: "素材库",
//           description: "为项目和页面长期保留的视觉、文字与结构样本。",
//           href: "/collections#material-library",
//         },
//         {
//           title: "参考体系",
//           description: "如何整理参考、归档链接，并形成自己的留存方式。",
//           href: "/collections#reference-system",
//         },
//         {
//           title: "工具箱",
//           description: "日常使用或阶段性偏爱的工具、站点与工作辅助材料。",
//           href: "/collections#toolkit",
//         },
//         {
//           title: "查看收藏",
//           description: "进入完整的收藏与个人留存内容。",
//           href: "/collections",
//         },
//       ],
//     },
//   },

//   {
//     key: "journey",
//     label: "旅程",
//     href: "/journey",
//     menu: {
//       kind: "component",
//       component: function JourneyMenu() {
//         return (
//           <div style={{ display: "flex", gap: 48 }}>
//             <div>
//               <p
//                 style={{
//                   margin: "0 0 6px",
//                   fontSize: 12,
//                   letterSpacing: "0.1em",
//                   opacity: 0.5,
//                 }}
//               >
//                 节点
//               </p>

//               {[
//                 { title: "阶段节点", href: "/journey#milestones" },
//                 { title: "进行中", href: "/journey#in-progress" },
//                 { title: "时间线视图", href: "/journey#timeline" },
//               ].map((item) => (
//                 <Link
//                   key={item.href}
//                   href={item.href}
//                   style={{
//                     display: "block",
//                     padding: "8px 0",
//                     fontSize: 16,
//                     color: "var(--c-ink-strong)",
//                     textDecoration: "none",
//                   }}
//                 >
//                   {item.title}
//                 </Link>
//               ))}
//             </div>

//             <div
//               style={{
//                 width: 1,
//                 background: "var(--c-border)",
//                 alignSelf: "stretch",
//               }}
//             />

//             <div style={{ maxWidth: 260 }}>
//               <p
//                 style={{
//                   margin: "0 0 8px",
//                   fontSize: 12,
//                   letterSpacing: "0.1em",
//                   opacity: 0.5,
//                 }}
//               >
//                 最近
//               </p>
//               <p
//                 style={{
//                   margin: 0,
//                   fontSize: 15,
//                   lineHeight: 1.6,
//                   opacity: 0.72,
//                 }}
//               >
//                 这里保留的不只是经历，还有那些逐渐形成、又不断被修正的判断。
//               </p>

//               <Link
//                 href="/journey"
//                 style={{
//                   display: "inline-block",
//                   marginTop: 14,
//                   fontSize: 13,
//                   color: "var(--c-ink-strong)",
//                   textDecoration: "underline",
//                   textUnderlineOffset: 3,
//                 }}
//               >
//                 查看旅程 →
//               </Link>
//             </div>
//           </div>
//         );
//       },
//     },
//     mobileMenu: [
//       {
//         label: "旅程",
//         entries: [
//           { title: "阶段节点", href: "/journey#milestones" },
//           { title: "进行中", href: "/journey#in-progress" },
//           { title: "时间线视图", href: "/journey#timeline" },
//           { title: "查看旅程", href: "/journey" },
//         ],
//       },
//     ],
//   },
// ];

// ─── Helper ───────────────────────────────────────────────────────────────────

function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href) || href.startsWith("//");
}

function getMobileMenuGroups(item: NavigationItem): MenuGroup[] {
  if (item.mobileMenu) return item.mobileMenu;
  if (!item.menu)
    return item.href ? [{ entries: [{ title: `查看${item.label}`, href: item.href }] }] : [];
  if (item.menu.kind === "groups") return item.menu.groups;
  if (item.menu.kind === "entries") return [{ entries: item.menu.entries }];
  return item.href ? [{ entries: [{ title: `查看${item.label}`, href: item.href }] }] : [];
}

function DesktopNavLabel({ label }: { label: string }) {
  return <span className={styles.navLabelHighlight}>{label}</span>;
}

// ─── MenuEntryLink ────────────────────────────────────────────────────────────

function MenuEntryLink({
  entry,
  className,
  style,
  onClick,
}: {
  entry: MenuEntry;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}) {
  const external = isExternalHref(entry.href);
  const target = entry.target ?? (external ? "_blank" : "_self");
  const rel = external ? "noopener noreferrer" : undefined;

  const inner = (
    <>
      <span className={styles.desktopDropdownItemTitle}>{entry.title}</span>
      {entry.description && (
        <span className={styles.desktopDropdownItemDescription}>{entry.description}</span>
      )}
    </>
  );

  if (external) {
    return (
      <a
        className={className}
        href={entry.href}
        rel={rel}
        style={style}
        target={target}
        onClick={onClick}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link className={className} href={entry.href} style={style} target={target} onClick={onClick}>
      {inner}
    </Link>
  );
}

// ─── MenuContentRenderer ──────────────────────────────────────────────────────

function MenuContentRenderer({
  content,
  onClose,
  componentMap,
}: {
  content: MenuContent;
  onClose: () => void;
  componentMap?: Record<string, ComponentType>;
}) {
  if (content.kind === "component") {
    const Comp = content.component;
    if (Comp) return <Comp />;
    if (componentMap && content.contentId && componentMap[content.contentId]) {
      const Mapped = componentMap[content.contentId];
      return <Mapped />;
    }
    return null;
  }

  const groups: MenuGroup[] =
    content.kind === "groups" ? content.groups : [{ entries: content.entries }];

  return (
    <>
      {groups.map((group, gi) => (
        <div key={gi} className={styles.desktopDropdownGroup}>
          {gi > 0 && <div className={styles.desktopDropdownDivider} />}
          {group.label && <p className={styles.desktopDropdownGroupLabel}>{group.label}</p>}
          <div className={styles.desktopDropdownGrid}>
            {group.entries.map((entry, entryIndex) => (
              <MenuEntryLink
                key={`${gi}-${entryIndex}-${entry.href}-${entry.title}`}
                className={styles.desktopDropdownItem}
                entry={entry}
                onClick={onClose}
              />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

// ─── TopNavigationBar ─────────────────────────────────────────────────────────

type TopNavigationBarProps = {
  activeKey?: NavigationKey;
  items?: NavigationItem[];
  fixed?: boolean;
  closeOnScroll?: boolean;
  brandHref?: string;
  labels?: {
    navAriaLabel: string;
    desktopMenuAriaLabel: string;
    openMenuLabel: string;
    closeMenuLabel: string;
  };
  mobileFooterLines?: string[];
  transitionConfig?: {
    duration?: number;
    enableHorizontal?: boolean;
    easing?: "smooth" | "snappy" | "linear" | "in-out" | "out" | "in";
    useNativeVariables?: boolean;
    effect?: "slide" | "reveal";
    dropdownStyle?: "offset" | "seamless";
  };
  componentMap?: Record<string, ComponentType>;
};

const defaultLabels = {
  navAriaLabel: "Primary navigation",
  desktopMenuAriaLabel: "Desktop navigation menu",
  openMenuLabel: "Open navigation menu",
  closeMenuLabel: "Close navigation menu",
};

export function TopNavigationBar({
  activeKey,
  items = [],
  fixed = false,
  closeOnScroll = true,
  brandHref = "/",
  labels = defaultLabels,
  mobileFooterLines = [],
  transitionConfig = {
    duration: 400,
    enableHorizontal: true,
    easing: "smooth",
    effect: "slide",
    dropdownStyle: "offset",
  },
  componentMap = {},
}: TopNavigationBarProps) {
  const [openKey, setOpenKey] = useState<NavigationKey | null>(null);
  const effect = transitionConfig.effect || "slide";
  const easingMap = {
    smooth: "cubic-bezier(0.32, 0, 0.12, 1)",
    snappy: "cubic-bezier(0.2, 1, 0.3, 1)",
    linear: "linear",
    "in-out": "ease-in-out",
    out: "ease-out",
    in: "ease-in",
    default: "ease",
  };
  const selectedEasing = easingMap[transitionConfig.easing || "smooth"] || easingMap.smooth;

  const dynamicStyles = transitionConfig.useNativeVariables
    ? {}
    : ({
        "--nav-drawer-duration": `${transitionConfig.duration}ms`,
        "--nav-drawer-ease": selectedEasing,
      } as React.CSSProperties);

  const [displayKey, setDisplayKey] = useState<NavigationKey | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileOpenKey, setMobileOpenKey] = useState<NavigationKey | null>(null);
  const [isAtTop, setIsAtTop] = useState(true);
  const [shouldAnimateTrack, setShouldAnimateTrack] = useState(false);
  // Mobile drawer shell state (mirrors desktop logic)

  const [headerHeight, setHeaderHeight] = useState(72);

  const navRootRef = useRef<HTMLElement | null>(null);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastHoverSwitchedKeyRef = useRef<NavigationKey | null>(null);

  const openFrameRef = useRef<number | null>(null);
  const dropdownReadyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownScrollReadyRef = useRef(false);
  const dropdownWheelDeltaRef = useRef(0);
  const measureRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const panelHeightsRef = useRef<Record<string, number>>({});
  const desktopMenuId = useId();

  const menuItems = items.filter((i) => !!i.menu);
  const activeItem = items.find((i) => i.key === displayKey) ?? null;
  const activeIndex = menuItems.findIndex((i) => i.key === displayKey);
  const isDropdownOpen = openKey !== null;
  const isDropdownVisible = activeItem !== null;
  const isTopTransparentActive = fixed && isAtTop && !isDropdownVisible && !isMenuOpen;

  const setShellHeight = useCallback((px: number) => {
    if (shellRef.current) shellRef.current.style.height = `${px}px`;
  }, []);

  const setPanelHeight = useCallback((px: number) => {
    if (panelRef.current) panelRef.current.style.height = `${px}px`;
  }, []);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const clearOpenFrame = useCallback(() => {
    if (openFrameRef.current) {
      cancelAnimationFrame(openFrameRef.current);
      openFrameRef.current = null;
    }
  }, []);

  const clearDropdownReadyTimer = useCallback(() => {
    if (dropdownReadyTimerRef.current) {
      clearTimeout(dropdownReadyTimerRef.current);
      dropdownReadyTimerRef.current = null;
    }
  }, []);

  const openMenu = useCallback(
    (key: NavigationKey) => {
      clearCloseTimer();
      clearOpenFrame();
      clearDropdownReadyTimer();
      dropdownWheelDeltaRef.current = 0;

      if (openKey !== null) {
        setShouldAnimateTrack(true);
        dropdownScrollReadyRef.current = true;
        if (shellRef.current) shellRef.current.style.transition = "none";
        flushSync(() => {
          setDisplayKey(key);
          setOpenKey(key);
        });
        const newH = panelHeightsRef.current[key] ?? 0;
        setShellHeight(newH);
        setPanelHeight(newH);
        if (shellRef.current) void shellRef.current.offsetHeight;
        requestAnimationFrame(() => {
          if (shellRef.current) shellRef.current.style.transition = "";
        });
        return;
      }

      dropdownScrollReadyRef.current = false;
      setDisplayKey(key);
      setShellHeight(0);
      const h = panelHeightsRef.current[key] ?? 0;
      setPanelHeight(h); // Set panel height immediately so translateY(-100%) is calculated correctly based on the target height
      openFrameRef.current = requestAnimationFrame(() => {
        // Use flushSync to ensure the state update (which adds the 'Open' class)
        // happens in the same frame as the direct DOM height update.
        flushSync(() => {
          setShellHeight(h);
          setOpenKey(key);
          setShouldAnimateTrack(false);
        });
        openFrameRef.current = null;
      });
    },
    [
      clearCloseTimer,
      clearDropdownReadyTimer,
      clearOpenFrame,
      openKey,
      setShellHeight,
      setPanelHeight,
    ],
  );

  const closeMenu = useCallback(() => {
    if (openKey === null && displayKey === null) return;
    setShouldAnimateTrack(false);
    clearCloseTimer();
    clearOpenFrame();
    clearDropdownReadyTimer();
    lastHoverSwitchedKeyRef.current = null;
    dropdownScrollReadyRef.current = false;
    dropdownWheelDeltaRef.current = 0;
    setOpenKey(null);
    setShellHeight(0);
    closeTimerRef.current = setTimeout(() => {
      setDisplayKey(null);
      closeTimerRef.current = null;
    }, transitionConfig.duration);
  }, [
    clearCloseTimer,
    clearDropdownReadyTimer,
    clearOpenFrame,
    displayKey,
    openKey,
    setShellHeight,
    transitionConfig.duration,
  ]);

  const toggleMenu = (key: NavigationKey) => {
    if (openKey === key && lastHoverSwitchedKeyRef.current === key) {
      lastHoverSwitchedKeyRef.current = null;
      return;
    }

    lastHoverSwitchedKeyRef.current = null;

    if (openKey === key) {
      closeMenu();
      return;
    }
    openMenu(key);
  };

  const handleDesktopTriggerPointerEnter = useCallback(
    (key: NavigationKey) => {
      if (!ENABLE_HOVER_SWITCH_AFTER_OPEN) return;
      if (!isDropdownOpen) return;
      if (openKey === key) return;
      lastHoverSwitchedKeyRef.current = key;
      openMenu(key);
    },
    [isDropdownOpen, openKey, openMenu],
  );

  const toggleMobileMenu = useCallback(() => {
    setIsMenuOpen((prev) => {
      const next = !prev;
      if (!next) setMobileOpenKey(null);
      return next;
    });
  }, [setMobileOpenKey]);

  const closeAll = useCallback(() => {
    setIsMenuOpen(false);
    setMobileOpenKey(null);
    closeMenu();
  }, [closeMenu, setMobileOpenKey]);

  // ── Body overflow lock ──────────────────────────────────────────────────────

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // ── Top scroll state for fixed nav surface ──────────────────────────────────

  useEffect(() => {
    if (!fixed) return;

    const updateTopState = () => {
      const nextIsAtTop = window.scrollY <= TOP_SCROLL_THRESHOLD_PX;
      setIsAtTop((previous) => (previous === nextIsAtTop ? previous : nextIsAtTop));
    };

    updateTopState();
    window.addEventListener("scroll", updateTopState, { passive: true });
    return () => window.removeEventListener("scroll", updateTopState);
  }, [fixed]);

  // ── Keyboard esc ───────────────────────────────────────────────────────────

  useEffect(() => {
    if (!isMenuOpen && !isDropdownOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        setMobileOpenKey(null);
        closeMenu();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeMenu, isDropdownOpen, isMenuOpen]);

  // ── Click outside ──────────────────────────────────────────────────────────

  useEffect(() => {
    if (!isDropdownOpen) return;
    const onPointer = (e: PointerEvent) => {
      if (!navRootRef.current?.contains(e.target as Node)) closeMenu();
    };
    window.addEventListener("pointerdown", onPointer);
    return () => window.removeEventListener("pointerdown", onPointer);
  }, [closeMenu, isDropdownOpen]);

  // ── Scroll-to-close (desktop) ─────────────────────────────────────────────

  useEffect(() => {
    if (!isDropdownOpen) return;
    clearDropdownReadyTimer();
    dropdownScrollReadyRef.current = false;
    dropdownWheelDeltaRef.current = 0;
    dropdownReadyTimerRef.current = setTimeout(() => {
      dropdownScrollReadyRef.current = true;
      dropdownReadyTimerRef.current = null;
    }, transitionConfig.duration);
    return () => {
      clearDropdownReadyTimer();
      dropdownScrollReadyRef.current = false;
      dropdownWheelDeltaRef.current = 0;
    };
  }, [clearDropdownReadyTimer, isDropdownOpen, transitionConfig.duration]);

  useEffect(() => {
    if (!isDropdownOpen || !closeOnScroll) return;
    const onWheel = (event: WheelEvent) => {
      if (!dropdownScrollReadyRef.current) return;
      if (event.deltaY < 0) {
        dropdownWheelDeltaRef.current = 0;
        return;
      }
      dropdownWheelDeltaRef.current += event.deltaY;
      if (dropdownWheelDeltaRef.current < 48) return;
      closeMenu();
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [closeMenu, closeOnScroll, isDropdownOpen]);

  // ── Measure panels ─────────────────────────────────────────────────────────

  useLayoutEffect(() => {
    const update = () => {
      const next: Record<string, number> = {};
      for (const [key, node] of Object.entries(measureRefs.current)) {
        if (node) next[key] = Math.ceil(node.getBoundingClientRect().height) + 2;
      }
      panelHeightsRef.current = next;
    };
    update();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(update);
    for (const node of Object.values(measureRefs.current)) {
      if (node) ro.observe(node);
    }
    return () => ro.disconnect();
  }, []);

  // ── Header height ──────────────────────────────────────────────────────────

  useLayoutEffect(() => {
    const node = navRootRef.current;
    if (!node) return;
    const update = () => setHeaderHeight(node.getBoundingClientRect().height);
    update();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(update);
    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  // ── Cleanup ────────────────────────────────────────────────────────────────

  useEffect(
    () => () => {
      clearCloseTimer();
      clearDropdownReadyTimer();
      clearOpenFrame();
    },
    [clearCloseTimer, clearDropdownReadyTimer, clearOpenFrame],
  );

  const dropdownStyle = transitionConfig.dropdownStyle || "offset";

  return (
    <>
      <header
        ref={navRootRef}
        className={cn(
          styles.bar,
          fixed && styles.barFixed,
          isTopTransparentActive && styles.barAtTopTransparent,
          (isDropdownVisible || isMenuOpen) && styles.barDropdownOpen,
        )}
        data-dropdown-style={dropdownStyle}
        data-name="Top Navigation Bar"
        style={dynamicStyles}
      >
        <div className={styles.barInner}>
          <Link className={styles.brand} href={brandHref} onClick={closeAll}>
            YUMENGJH
          </Link>

          <nav aria-label={labels.navAriaLabel} className={styles.nav}>
            {items.map((item) => {
              const isActive = item.key === activeKey;
              const isOpen = item.key === openKey;

              if (!item.menu) {
                const href = item.href ?? "#";
                const isExternal = isExternalHref(href);
                const linkClassName = cn(styles.navLink, isActive && styles.navLinkActive);
                if (isExternal) {
                  return (
                    <div key={item.key} className={styles.navItem}>
                      <a
                        className={linkClassName}
                        href={href}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <DesktopNavLabel label={item.label} />
                      </a>
                    </div>
                  );
                }
                return (
                  <div key={item.key} className={styles.navItem}>
                    <Link className={linkClassName} href={href} onClick={closeAll}>
                      <DesktopNavLabel label={item.label} />
                    </Link>
                  </div>
                );
              }

              return (
                <div key={item.key} className={styles.navItem}>
                  <button
                    aria-controls={desktopMenuId}
                    aria-expanded={isOpen}
                    className={cn(
                      styles.navTrigger,
                      isActive && !isOpen && styles.navTriggerActive,
                      isOpen && styles.navTriggerOpen,
                    )}
                    type="button"
                    onClick={() => toggleMenu(item.key)}
                    onPointerEnter={() => handleDesktopTriggerPointerEnter(item.key)}
                  >
                    <DesktopNavLabel label={item.label} />
                    <span aria-hidden="true" className={styles.navTriggerIcon}>
                      <svg
                        fill="none"
                        height="24"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="m19.75 8.75-7.25 7-7.25-7" />
                      </svg>
                    </span>
                  </button>
                </div>
              );
            })}
          </nav>

          <div aria-hidden="true" className={styles.desktopIcon}>
            <span />
            <span />
          </div>

          {/* Hamburger button — SVG path animation */}
          <label
            aria-label={isMenuOpen ? labels.closeMenuLabel : labels.openMenuLabel}
            className={cn(styles.menuButton, isMenuOpen && styles.menuButtonOpen)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleMobileMenu();
              }
            }}
          >
            <input
              type="checkbox"
              checked={isMenuOpen}
              className={styles.menuButtonInput}
              readOnly
              onClick={(e) => {
                e.preventDefault();
                toggleMobileMenu();
              }}
            />
            <svg viewBox="0 0 32 32" className={styles.menuButtonSvg}>
              <path
                d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
                className={cn(styles.menuLine, styles.menuLineTopBottom)}
              />
              <path d="M7 16 27 16" className={styles.menuLine} />
            </svg>
          </label>
        </div>

        {/* ── Desktop dropdown shell ── */}
        <div
          ref={shellRef}
          aria-hidden={!isDropdownOpen}
          aria-label={labels.desktopMenuAriaLabel}
          className={cn(
            styles.desktopDropdownShell,
            isDropdownOpen && styles.desktopDropdownShellOpen,
          )}
          id={desktopMenuId}
          role="region"
        >
          <div className={styles.desktopDropdownViewport}>
            <div
              ref={panelRef}
              className={cn(
                styles.desktopDropdownPanel,
                effect === "slide" && styles.desktopDropdownPanelSlide,
                isDropdownOpen && styles.desktopDropdownPanelOpen,
              )}
            >
              <div
                className={styles.desktopDropdownTrack}
                style={{
                  transform: activeIndex >= 0 ? `translateX(-${activeIndex * 100}%)` : undefined,
                  transition:
                    transitionConfig.enableHorizontal && shouldAnimateTrack ? undefined : "none",
                }}
              >
                {menuItems.map((item) => (
                  <div key={item.key} className={styles.desktopDropdownPanelItem}>
                    <div className={styles.desktopDropdownContent}>
                      <MenuContentRenderer
                        content={item.menu!}
                        componentMap={componentMap}
                        onClose={closeMenu}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Desktop measure layer ── */}
        <div aria-hidden="true" className={styles.desktopDropdownMeasureLayer}>
          {items.map((item) =>
            item.menu ? (
              <div
                key={item.key}
                ref={(node) => {
                  measureRefs.current[item.key] = node;
                }}
                className={styles.desktopDropdownMeasurePanel}
              >
                <div className={styles.desktopDropdownContent}>
                  <MenuContentRenderer
                    content={item.menu}
                    componentMap={componentMap}
                    onClose={() => {}}
                  />
                </div>
              </div>
            ) : null,
          )}
        </div>
      </header>

      {/* ── Desktop overlay ── */}
      <div className={styles.desktopMenuOverlayWrap}>
        <div
          aria-hidden={!isDropdownOpen}
          className={cn(styles.desktopMenuOverlay, isDropdownOpen && styles.desktopMenuOverlayOpen)}
          style={{ top: `${headerHeight}px` }}
          onClick={closeMenu}
        />
      </div>

      {/* Mobile overlay */}
      <div
        aria-hidden={!isMenuOpen}
        className={cn(styles.mobileMenuOverlay, isMenuOpen && styles.mobileMenuOverlayOpen)}
        style={{ top: `${headerHeight}px` }}
        onClick={closeAll}
      >
        <div className={styles.mobileMenuPanel} onClick={(e) => e.stopPropagation()}>
          <nav aria-label={labels.navAriaLabel} className={styles.mobileNav}>
            {items.map((item) => {
              const isActive = item.key === activeKey;
              const isExpanded = item.key === mobileOpenKey;
              const mobileGroups = getMobileMenuGroups(item);

              if (!item.menu) {
                const href = item.href ?? "#";
                const isExternal = isExternalHref(href);
                const linkClassName = cn(
                  styles.mobileNavLink,
                  isActive && styles.mobileNavLinkActive,
                );

                return (
                  <div key={item.key} className={styles.mobileNavItem}>
                    {isExternal ? (
                      <a
                        className={linkClassName}
                        href={href}
                        rel="noopener noreferrer"
                        target="_blank"
                        onClick={closeAll}
                      >
                        <span className={styles.mobileNavLabel}>{item.label}</span>
                      </a>
                    ) : (
                      <Link className={linkClassName} href={href} onClick={closeAll}>
                        <span className={styles.mobileNavLabel}>{item.label}</span>
                      </Link>
                    )}
                  </div>
                );
              }

              return (
                <div
                  key={item.key}
                  className={cn(styles.mobileNavItem, isExpanded && styles.mobileNavItemExpanded)}
                >
                  <button
                    aria-controls={`mobile-panel-${item.key}`}
                    aria-expanded={isExpanded}
                    className={cn(
                      styles.mobileNavTrigger,
                      isActive && styles.mobileNavTriggerActive,
                      isExpanded && styles.mobileNavTriggerExpanded,
                    )}
                    type="button"
                    onClick={() =>
                      setMobileOpenKey((current) => (current === item.key ? null : item.key))
                    }
                  >
                    <span className={styles.mobileNavLabel}>{item.label}</span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        styles.mobileNavIcon,
                        isExpanded && styles.mobileNavIconExpanded,
                      )}
                    />
                  </button>

                  <div
                    aria-hidden={!isExpanded}
                    className={cn(styles.mobileSubmenu, isExpanded && styles.mobileSubmenuExpanded)}
                    id={`mobile-panel-${item.key}`}
                  >
                    <div className={styles.mobileSubmenuInner}>
                      {mobileGroups.map((group, groupIndex) => (
                        <div
                          key={`${item.key}-${groupIndex}`}
                          className={styles.mobileSubmenuGroup}
                        >
                          {group.label && (
                            <p className={styles.mobileSubmenuLabel}>{group.label}</p>
                          )}
                          <div className={styles.mobileSubmenuEntries}>
                            {group.entries.map((entry, entryIndex) => {
                              const external = isExternalHref(entry.href);
                              const target = entry.target ?? (external ? "_blank" : "_self");
                              const rel = external ? "noopener noreferrer" : undefined;
                              const linkProps = {
                                className: styles.mobileSubmenuLink,
                                onClick: closeAll,
                              };

                              if (external) {
                                return (
                                  <a
                                    key={`${item.key}-${groupIndex}-${entryIndex}-${entry.href}`}
                                    {...linkProps}
                                    href={entry.href}
                                    rel={rel}
                                    target={target}
                                  >
                                    <span className={styles.mobileSubmenuLinkTitle}>
                                      {entry.title}
                                    </span>
                                    {entry.description && (
                                      <span className={styles.mobileSubmenuLinkDescription}>
                                        {entry.description}
                                      </span>
                                    )}
                                  </a>
                                );
                              }

                              return (
                                <Link
                                  key={`${item.key}-${groupIndex}-${entryIndex}-${entry.href}`}
                                  {...linkProps}
                                  href={entry.href}
                                  target={target}
                                >
                                  <span className={styles.mobileSubmenuLinkTitle}>
                                    {entry.title}
                                  </span>
                                  {entry.description && (
                                    <span className={styles.mobileSubmenuLinkDescription}>
                                      {entry.description}
                                    </span>
                                  )}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>

          <div className={styles.mobileMenuFooter}>
            <div className={styles.mobileFooterRule} />
            <div className={styles.mobileFooterMetaRow}>
              <p className={styles.mobileFooterMeta}>
                {mobileFooterLines.map((line, index) => (
                  <span key={`${line}-${index}`}>
                    {index > 0 && <br />}
                    {line}
                  </span>
                ))}
              </p>
              <div aria-hidden="true" className={styles.mobileFooterIcons}>
                <span className={styles.mobileFooterIcon}>
                  <svg
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="4928"
                  >
                    <path
                      d="M0 0h1024v1024H0z"
                      fill="currentColor"
                      opacity=".01"
                      p-id="4929"
                    ></path>
                    <path
                      d="M682.666667 238.933333a102.4 102.4 0 1 1 204.8 0 102.4 102.4 0 0 1-204.8 0z m102.4-170.666666a170.666667 170.666667 0 0 0-164.864 214.9376l-246.954667 123.4944a170.666667 170.666667 0 1 0 0 210.602666l246.954667 123.4944A170.871467 170.871467 0 0 0 785.066667 955.733333a170.666667 170.666667 0 1 0-134.314667-275.968l-246.954667-123.4944a170.871467 170.871467 0 0 0 0-88.541866l246.954667-123.4944A170.666667 170.666667 0 1 0 785.066667 68.266667zM136.533333 512a102.4 102.4 0 1 1 204.8 0 102.4 102.4 0 0 1-204.8 0z m546.133334 273.066667a102.4 102.4 0 1 1 204.8 0 102.4 102.4 0 0 1-204.8 0z"
                      fill="currentColor"
                      p-id="4930"
                    ></path>
                  </svg>
                </span>
                <span className={styles.mobileFooterIcon}>
                  <svg fill="none" viewBox="0 0 15 12" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M1.25 2.083 7.5 6.667l6.25-4.584M2.75.833h9.5A1.5 1.5 0 0 1 13.75 2.333v7.334a1.5 1.5 0 0 1-1.5 1.5h-9.5a1.5 1.5 0 0 1-1.5-1.5V2.333a1.5 1.5 0 0 1 1.5-1.5Z"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
