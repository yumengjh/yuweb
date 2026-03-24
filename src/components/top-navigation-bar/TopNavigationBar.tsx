"use client";

/* cspell:ignore Yumengjh */

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

const DESKTOP_DROPDOWN_CLOSE_DURATION_MS = 520;

// ─── Menu content types ───────────────────────────────────────────────────────

/** A single clickable menu entry with an optional link. */
export type MenuEntry = {
  /** Short heading shown in bold. */
  title: string;
  /** Longer description shown below the title. */
  description?: string;
  /**
   * Where this entry links to.
   * - Relative paths (`/about`, `#section`) use Next.js <Link> (SPA navigation).
   * - Absolute URLs (`https://…`) render a plain <a>.
   */
  href: string;
  /**
   * How to open the link — same values as the HTML `target` attribute.
   * Defaults to `"_self"`.
   */
  target?: "_self" | "_blank" | "_parent" | "_top";
};

/** A named group of entries separated by a divider from other groups. */
export type MenuGroup = {
  /** Optional label rendered above the group (purely decorative / a11y). */
  label?: string;
  entries: MenuEntry[];
};

/**
 * What to render inside a nav item's dropdown.
 *
 * Three flavours:
 *  - `entries`  — flat list of `MenuEntry` objects
 *  - `groups`   — grouped entries separated by dividers
 *  - `component`— any React component / JSX; you own the markup entirely
 */
export type MenuContent =
  | { kind: "entries"; entries: MenuEntry[] }
  | { kind: "groups"; groups: MenuGroup[] }
  | { kind: "component"; component: ComponentType | (() => ReactNode) };

// ─── Navigation item ─────────────────────────────────────────────────────────

export type NavigationKey = string;

export type NavigationItem = {
  key: NavigationKey;
  label: string;
  /** Top-level href used when the user clicks the nav trigger as a link (optional). */
  href?: string;
  /** Menu content for dropdown navigation. If omitted, the item renders as a direct link. */
  menu?: MenuContent;
  mobileMenu?: MenuGroup[];
};

// ─── Default navigation data ──────────────────────────────────────────────────

const navigationItems: NavigationItem[] = [
  {
    key: "about",
    label: "关于",
    href: "/about",
    menu: {
      kind: "groups",
      groups: [
        {
          label: "开始",
          entries: [
            {
              title: "从这里开始",
              description: "第一次来到这里，可以先从几个入口快速了解这个网站。",
              href: "/about#start",
            },
            {
              title: "这个网站",
              description: "为什么会有这个网站，它想承载什么，又会如何继续生长。",
              href: "/about#site",
            },
          ],
        },
        {
          label: "关于我",
          entries: [
            {
              title: "当前状态",
              description: "我正在关注什么、推进什么，以及最近停留的问题。",
              href: "/about#now",
            },
            {
              title: "学习方式",
              description: "我如何学习、记录、整理，并逐步形成自己的方法。",
              href: "/about#learning",
            },
            {
              title: "关注领域",
              description: "长期关心的技术、设计、结构和表达方向。",
              href: "/about#fields",
            },
          ],
        },
        {
          label: "延伸",
          entries: [
            {
              title: "技术栈",
              description: "查看目前使用的工具、框架与页面系统组织方式。",
              href: "/about#stack",
            },
            {
              title: "查看关于页",
              description: "进入完整的自我介绍与站点说明页面。",
              href: "/about",
            },
          ],
        },
      ],
    },
  },

  {
    key: "notes",
    label: "笔记",
    href: "/notes",
    menu: {
      kind: "entries",
      entries: [
        {
          title: "最近更新",
          description: "最近记下的内容、正在延展的问题和新的观察。",
          href: "/notes#recent",
        },
        {
          title: "技术笔记",
          description: "围绕框架、工程、交互与实现细节展开的个人记录。",
          href: "/notes#tech",
        },
        {
          title: "学习记录",
          description: "正在学习的内容、阶段性理解与路径整理。",
          href: "/notes#learning",
        },
        {
          title: "灵感碎片",
          description: "一些还没长成文章的判断、想法和短促记录。",
          href: "/notes#fragments",
        },
        {
          title: "问题与答案",
          description: "把遇到的问题、拆解过程与暂时答案保留下来。",
          href: "/notes#qa",
        },
        {
          title: "查看笔记",
          description: "进入全部公开笔记与记录。",
          href: "/notes",
        },
      ],
    },
  },

  {
    key: "projects",
    label: "项目",
    href: "/projects",
    menu: {
      kind: "groups",
      groups: [
        {
          label: "进行中",
          entries: [
            {
              title: "正在做的事",
              description: "查看目前仍在推进、迭代或打磨中的项目与页面。",
              href: "/projects#in-progress",
            },
            {
              title: "页面实验",
              description: "一些围绕布局、交互和结构进行的持续实验。",
              href: "/projects#experiments",
            },
          ],
        },
        {
          label: "归档",
          entries: [
            {
              title: "代表作品",
              description: "当前阶段最能代表判断、表达和实现方式的项目。",
              href: "/projects#featured",
            },
            {
              title: "开源项目",
              description: "已公开的仓库、工具与可以继续查看的实现记录。",
              href: "/projects#opensource",
            },
          ],
        },
        {
          label: "中止 / 未完成",
          entries: [
            {
              title: "停止的想法",
              description: "那些曾经认真开始、后来停下来的方向与设想。",
              href: "/projects#abandoned-ideas",
            },
            {
              title: "失败记录",
              description: "做坏的页面、走偏的方案和最终放弃的项目尝试。",
              href: "/projects#failures",
            },
            {
              title: "查看项目页",
              description: "进入完整的项目、实验与归档内容。",
              href: "/projects",
            },
          ],
        },
      ],
    },
  },

  {
    key: "collections",
    label: "收藏",
    href: "/collections",
    menu: {
      kind: "entries",
      entries: [
        {
          title: "书籍",
          description: "留下来的书、反复翻看的部分，以及它们为何重要。",
          href: "/collections#books",
        },
        {
          title: "文章",
          description: "收藏的博客文章、写作者与值得反复阅读的内容。",
          href: "/collections#articles",
        },
        {
          title: "素材库",
          description: "为项目和页面长期保留的视觉、文字与结构样本。",
          href: "/collections#material-library",
        },
        {
          title: "参考体系",
          description: "如何整理参考、归档链接，并形成自己的留存方式。",
          href: "/collections#reference-system",
        },
        {
          title: "工具箱",
          description: "日常使用或阶段性偏爱的工具、站点与工作辅助材料。",
          href: "/collections#toolkit",
        },
        {
          title: "查看收藏",
          description: "进入完整的收藏与个人留存内容。",
          href: "/collections",
        },
      ],
    },
  },

  {
    key: "journey",
    label: "旅程",
    href: "/journey",
    menu: {
      kind: "component",
      component: function JourneyMenu() {
        return (
          <div style={{ display: "flex", gap: 48 }}>
            <div>
              <p
                style={{
                  margin: "0 0 6px",
                  fontSize: 12,
                  letterSpacing: "0.1em",
                  opacity: 0.5,
                }}
              >
                节点
              </p>

              {[
                { title: "阶段节点", href: "/journey#milestones" },
                { title: "进行中", href: "/journey#in-progress" },
                { title: "时间线视图", href: "/journey#timeline" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: "block",
                    padding: "8px 0",
                    fontSize: 16,
                    color: "var(--c-ink-strong)",
                    textDecoration: "none",
                  }}
                >
                  {item.title}
                </Link>
              ))}
            </div>

            <div
              style={{
                width: 1,
                background: "var(--c-border)",
                alignSelf: "stretch",
              }}
            />

            <div style={{ maxWidth: 260 }}>
              <p
                style={{
                  margin: "0 0 8px",
                  fontSize: 12,
                  letterSpacing: "0.1em",
                  opacity: 0.5,
                }}
              >
                最近
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: 15,
                  lineHeight: 1.6,
                  opacity: 0.72,
                }}
              >
                这里保留的不只是经历，还有那些逐渐形成、又不断被修正的判断。
              </p>

              <Link
                href="/journey"
                style={{
                  display: "inline-block",
                  marginTop: 14,
                  fontSize: 13,
                  color: "var(--c-ink-strong)",
                  textDecoration: "underline",
                  textUnderlineOffset: 3,
                }}
              >
                查看旅程 →
              </Link>
            </div>
          </div>
        );
      },
    },
    mobileMenu: [
      {
        label: "旅程",
        entries: [
          { title: "阶段节点", href: "/journey#milestones" },
          { title: "进行中", href: "/journey#in-progress" },
          { title: "时间线视图", href: "/journey#timeline" },
          { title: "查看旅程", href: "/journey" },
        ],
      },
    ],
  },
];

// ─── Helper: is a URL external? ──────────────────────────────────────────────

function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href) || href.startsWith("//");
}

function getMobileMenuGroups(item: NavigationItem): MenuGroup[] {
  if (item.mobileMenu) {
    return item.mobileMenu;
  }

  if (!item.menu) {
    return item.href ? [{ entries: [{ title: `查看${item.label}`, href: item.href }] }] : [];
  }

  if (item.menu.kind === "groups") {
    return item.menu.groups;
  }

  if (item.menu.kind === "entries") {
    return [{ entries: item.menu.entries }];
  }

  return item.href ? [{ entries: [{ title: `查看${item.label}`, href: item.href }] }] : [];
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

function MenuContentRenderer({ content, onClose }: { content: MenuContent; onClose: () => void }) {
  if (content.kind === "component") {
    const Comp = content.component;
    return <Comp />;
  }

  // Flatten groups → entries for rendering
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
};

export function TopNavigationBar({
  activeKey,
  items = navigationItems,
  fixed = false,
  closeOnScroll = true,
}: TopNavigationBarProps) {
  const [openKey, setOpenKey] = useState<NavigationKey | null>(null);
  const [displayKey, setDisplayKey] = useState<NavigationKey | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileOpenKey, setMobileOpenKey] = useState<NavigationKey | null>(null);
  const [headerHeight, setHeaderHeight] = useState(84);

  const navRootRef = useRef<HTMLElement | null>(null);
  // Shell ref — we set style.height imperatively so the browser always
  // sees a valid from→to pair for CSS transition (no React batching surprises).
  const shellRef = useRef<HTMLDivElement | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openFrameRef = useRef<number | null>(null);
  const dropdownReadyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownScrollReadyRef = useRef(false);
  const dropdownWheelDeltaRef = useRef(0);
  const measureRefs = useRef<Record<string, HTMLDivElement | null>>({});
  // Keep panelHeights in a ref too so imperative code can read the latest value
  // without stale closures.
  const panelHeightsRef = useRef<Record<string, number>>({});
  const desktopMenuId = useId();

  const activeItem = items.find((i) => i.key === displayKey) ?? null;
  const isDropdownOpen = openKey !== null;
  const isDropdownVisible = activeItem !== null;

  // ── Imperative shell height helper ──────────────────────────────────────────

  const setShellHeight = useCallback((px: number) => {
    if (shellRef.current) shellRef.current.style.height = `${px}px`;
  }, []);

  // ── Timers ──────────────────────────────────────────────────────────────────

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

  // ── Open / close ────────────────────────────────────────────────────────────

  const openMenu = useCallback(
    (key: NavigationKey) => {
      clearCloseTimer();
      clearOpenFrame();
      clearDropdownReadyTimer();
      dropdownWheelDeltaRef.current = 0;

      if (openKey !== null) {
        dropdownScrollReadyRef.current = true;
        // Switching between already-open menus should snap immediately without
        // any height or content interpolation.
        if (shellRef.current) {
          shellRef.current.style.transition = "none";
        }

        flushSync(() => {
          setDisplayKey(key);
          setOpenKey(key);
        });

        const newH = panelHeightsRef.current[key] ?? 0;
        setShellHeight(newH);

        if (shellRef.current) {
          void shellRef.current.offsetHeight;
        }

        requestAnimationFrame(() => {
          if (shellRef.current) {
            shellRef.current.style.transition = "";
          }
        });
        return;
      }

      // ── Fresh open ───────────────────────────────────────────────────────────
      dropdownScrollReadyRef.current = false;
      setDisplayKey(key);
      // Start from 0 so the CSS transition animates open.
      setShellHeight(0);
      openFrameRef.current = requestAnimationFrame(() => {
        const h = panelHeightsRef.current[key] ?? 0;
        setShellHeight(h);
        setOpenKey(key);
        openFrameRef.current = null;
      });
    },
    [clearCloseTimer, clearDropdownReadyTimer, clearOpenFrame, openKey, setShellHeight],
  );

  const closeMenu = useCallback(() => {
    if (openKey === null && displayKey === null) return;
    clearCloseTimer();
    clearOpenFrame();
    clearDropdownReadyTimer();
    dropdownScrollReadyRef.current = false;
    dropdownWheelDeltaRef.current = 0;
    // Collapse shell height with animation, then remove content after animation ends.
    setOpenKey(null);
    setShellHeight(0);
    closeTimerRef.current = setTimeout(() => {
      setDisplayKey(null);
      closeTimerRef.current = null;
    }, DESKTOP_DROPDOWN_CLOSE_DURATION_MS);
  }, [
    clearCloseTimer,
    clearDropdownReadyTimer,
    clearOpenFrame,
    displayKey,
    openKey,
    setShellHeight,
  ]);

  const toggleMenu = (key: NavigationKey) => {
    if (openKey === key) {
      closeMenu();
      return;
    }
    openMenu(key);
  };

  const closeAll = useCallback(() => {
    setIsMenuOpen(false);
    setMobileOpenKey(null);
    closeMenu();
  }, [closeMenu]);

  // ── Effects ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen && !isDropdownOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        closeMenu();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeMenu, isDropdownOpen, isMenuOpen]);

  useEffect(() => {
    if (!isDropdownOpen) return;
    const onPointer = (e: PointerEvent) => {
      if (!navRootRef.current?.contains(e.target as Node)) closeMenu();
    };
    window.addEventListener("pointerdown", onPointer);
    return () => window.removeEventListener("pointerdown", onPointer);
  }, [closeMenu, isDropdownOpen]);

  useEffect(() => {
    if (!isDropdownOpen) return;

    clearDropdownReadyTimer();
    dropdownScrollReadyRef.current = false;
    dropdownWheelDeltaRef.current = 0;
    dropdownReadyTimerRef.current = setTimeout(() => {
      dropdownScrollReadyRef.current = true;
      dropdownReadyTimerRef.current = null;
    }, DESKTOP_DROPDOWN_CLOSE_DURATION_MS);

    return () => {
      clearDropdownReadyTimer();
      dropdownScrollReadyRef.current = false;
      dropdownWheelDeltaRef.current = 0;
    };
  }, [clearDropdownReadyTimer, isDropdownOpen]);

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

  // Measure panel heights from hidden layer — written to ref only (imperative height control)
  useLayoutEffect(() => {
    const update = () => {
      const next: Record<string, number> = {};
      for (const [key, node] of Object.entries(measureRefs.current)) {
        if (node) next[key] = node.getBoundingClientRect().height;
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

  // Measure header height
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

  useEffect(
    () => () => {
      clearCloseTimer();
      clearDropdownReadyTimer();
      clearOpenFrame();
    },
    [clearCloseTimer, clearDropdownReadyTimer, clearOpenFrame],
  );

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Header bar ───────────────────────────────────────────────── */}
      <header
        ref={navRootRef}
        className={cn(
          styles.bar,
          fixed && styles.barFixed,
          isDropdownVisible && styles.barDropdownOpen,
        )}
        data-name="Top Navigation Bar"
      >
        <div className={styles.barInner}>
          {/* Brand */}
          <Link className={styles.brand} href="/" onClick={closeAll}>
            鱼梦江湖
          </Link>

          {/* Desktop nav triggers */}
          <nav aria-label="主导航" className={styles.nav}>
            {items.map((item) => {
              const isActive = item.key === activeKey;
              const isOpen = item.key === openKey;

              // Direct link (no dropdown menu)
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
                        {item.label}
                      </a>
                    </div>
                  );
                }

                return (
                  <div key={item.key} className={styles.navItem}>
                    <Link className={linkClassName} href={href} onClick={closeAll}>
                      {item.label}
                    </Link>
                  </div>
                );
              }

              // Dropdown menu
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
                  >
                    <span>{item.label}</span>
                    <span aria-hidden="true" className={styles.navTriggerIcon}>
                      <svg fill="none" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M2.25 4.5 6 8.25 9.75 4.5"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.2"
                        />
                      </svg>
                    </span>
                  </button>
                </div>
              );
            })}
          </nav>

          {/* Diamond icon (decorative) */}
          <div aria-hidden="true" className={styles.desktopIcon}>
            <span />
            <span />
          </div>

          {/* Mobile hamburger */}
          <button
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "关闭导航菜单" : "打开导航菜单"}
            className={cn(styles.menuButton, isMenuOpen && styles.menuButtonOpen)}
            type="button"
            onClick={() => {
              closeMenu();
              setIsMenuOpen((v) => !v);
            }}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {/* ── Desktop dropdown shell ──────────────────────────────────── */}
        <div
          ref={shellRef}
          aria-hidden={!isDropdownOpen}
          aria-label="桌面导航菜单"
          className={cn(
            styles.desktopDropdownShell,
            isDropdownOpen && styles.desktopDropdownShellOpen,
          )}
          id={desktopMenuId}
          role="region"
        >
          {activeItem && activeItem.menu && (
            <div key={activeItem.key} className={styles.desktopDropdownViewport}>
              <div
                className={cn(
                  styles.desktopDropdownPanel,
                  isDropdownOpen && styles.desktopDropdownPanelOpen,
                )}
              >
                <div className={styles.desktopDropdownContent}>
                  <MenuContentRenderer content={activeItem.menu} onClose={closeMenu} />
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ── Backdrop overlay ─────────────────────────────────────────── */}
      <div className={styles.desktopMenuOverlayWrap}>
        <div
          aria-hidden={!isDropdownOpen}
          className={cn(styles.desktopMenuOverlay, isDropdownOpen && styles.desktopMenuOverlayOpen)}
          style={{ top: `${headerHeight}px` }}
          onClick={closeMenu}
        />
      </div>

      {/* ── Hidden measure layer ─────────────────────────────────────── */}
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
                <MenuContentRenderer content={item.menu} onClose={() => {}} />
              </div>
            </div>
          ) : null,
        )}
      </div>

      {/* ── Mobile overlay ───────────────────────────────────────────── */}
      <div
        aria-hidden={!isMenuOpen}
        className={cn(styles.mobileMenuOverlay, isMenuOpen && styles.mobileMenuOverlayOpen)}
        style={{ top: `${headerHeight}px` }}
        onClick={closeAll}
      >
        <div className={styles.mobileMenuPanel} onClick={(e) => e.stopPropagation()}>
          <nav aria-label="移动端主导航" className={styles.mobileNav}>
            {items.map((item, index) => {
              const isActive = item.key === activeKey;
              const isExpanded = item.key === mobileOpenKey;
              const mobileGroups = getMobileMenuGroups(item);

              // Direct link (no dropdown menu)
              if (!item.menu) {
                const href = item.href ?? "#";
                const isExternal = isExternalHref(href);
                const linkClassName = cn(
                  styles.mobileNavLink,
                  isActive && styles.mobileNavLinkActive,
                );

                return (
                  <div
                    key={item.key}
                    className={styles.mobileNavItem}
                    style={{ transitionDelay: isMenuOpen ? `${90 + index * 45}ms` : "0ms" }}
                  >
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

              // Dropdown menu
              return (
                <div
                  key={item.key}
                  className={cn(styles.mobileNavItem, isExpanded && styles.mobileNavItemExpanded)}
                  style={{ transitionDelay: isMenuOpen ? `${90 + index * 45}ms` : "0ms" }}
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
                    <span aria-hidden="true" className={styles.mobileNavIcon}>
                      <span />
                      <span />
                    </span>
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
                数字策展
                <br />
                导航层
                <br />
                2024 年 / 移动视图
              </p>
              <div aria-hidden="true" className={styles.mobileFooterIcons}>
                <span className={styles.mobileFooterIcon}>
                  <svg fill="none" viewBox="0 0 14 15" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M11.666 10.833a1.667 1.667 0 1 0-1.519-.981L4.74 6.982a1.67 1.67 0 0 0 0-1.964l5.406-2.87A1.666 1.666 0 1 0 9.625 1.5a1.66 1.66 0 0 0 .17.737L4.39 5.107a1.667 1.667 0 1 0 0 4.786l5.406 2.87a1.664 1.664 0 0 0-.17.737 1.667 1.667 0 1 0 2.041-1.667Z"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1"
                    />
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
