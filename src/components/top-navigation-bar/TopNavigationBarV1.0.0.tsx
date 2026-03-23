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
  menu: MenuContent;
};

// ─── Default navigation data ──────────────────────────────────────────────────

const navigationItems: NavigationItem[] = [
  {
    key: "about",
    label: "About",
    href: "/about",
    menu: {
      kind: "groups",
      groups: [
        {
          label: "Site",
          entries: [
            {
              title: "Origin Story",
              description: "了解这个站点从哪里开始，以及它为什么会被做出来。",
              href: "/about#origin",
            },
            {
              title: "Voice & Tone",
              description: "查看我偏好的叙事方式、审美方向与表达节奏。",
              href: "/about#voice",
            },
          ],
        },
        {
          label: "Now",
          entries: [
            {
              title: "What's Current",
              description: "快速了解现在正在推进的主题、页面与内容侧重点。",
              href: "/about#current",
            },
            {
              title: "Open About Page",
              description: "沿着关于页继续进入更完整的个人与项目介绍。",
              href: "/about",
            },
          ],
        },
      ],
    },
  },
  {
    key: "stack",
    label: "Stack",
    href: "/stack",
    menu: {
      kind: "entries",
      entries: [
        {
          title: "Frontend Base",
          description: "前端框架、类型系统与构建方式如何组合在一起。",
          href: "/stack#frontend",
        },
        {
          title: "Design System",
          description: "样式、设计 token 与组件拆分的工程组织方式。",
          href: "/stack#design",
        },
        {
          title: "Interaction Rules",
          description: "动效、交互细节与可维护性的取舍原则。",
          href: "/stack#interaction",
        },
        {
          title: "Open Stack Page",
          description: "继续查看完整的技术栈与项目实现细节。",
          href: "/stack",
        },
      ],
    },
  },
  {
    key: "curations",
    label: "Curations",
    href: "/curations",
    menu: {
      kind: "entries",
      entries: [
        {
          title: "Reading Notes",
          description: "收集值得反复阅读、保存与回看的文本内容。",
          href: "/curations#reading",
        },
        {
          title: "Visual Picks",
          description: "归档具有参考价值的视觉、版式与界面案例。",
          href: "/curations#visual",
        },
        {
          title: "Reference Shelf",
          description: "沉淀灵感来源，保留会持续影响表达的资料。",
          href: "/curations#reference",
        },
        {
          title: "Open Curations",
          description: "进入 Curations 页面查看整理中的全部内容。",
          href: "/curations",
        },
      ],
    },
  },
  {
    key: "journey",
    label: "Journey",
    href: "/journey",
    menu: {
      // Demo: custom component slot
      kind: "component",
      component: function JourneyMenu() {
        return (
          <div style={{ display: "flex", gap: 48 }}>
            <div>
              <p style={{ margin: "0 0 6px", fontSize: 12, letterSpacing: "0.1em", opacity: 0.5 }}>
                CHAPTERS
              </p>
              {[
                { title: "Milestones", href: "/journey#milestones" },
                { title: "In Progress", href: "/journey#in-progress" },
                { title: "Timeline View", href: "/journey#timeline" },
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
            <div style={{ width: 1, background: "var(--c-border)", alignSelf: "stretch" }} />
            <div style={{ maxWidth: 260 }}>
              <p style={{ margin: "0 0 8px", fontSize: 12, letterSpacing: "0.1em", opacity: 0.5 }}>
                LATEST
              </p>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, opacity: 0.72 }}>
                记录仍在发生的过程，而不是只保留最终结果。用时间线视角整理项目、想法与行动。
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
                Open Journey →
              </Link>
            </div>
          </div>
        );
      },
    },
  },
];

// ─── Helper: is a URL external? ──────────────────────────────────────────────

function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href) || href.startsWith("//");
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
}: {
  content: MenuContent;
  isSwitching: boolean;
  onClose: () => void;
}) {
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
};

export function TopNavigationBar({ activeKey, items = navigationItems }: TopNavigationBarProps) {
  const [openKey, setOpenKey] = useState<NavigationKey | null>(null);
  const [displayKey, setDisplayKey] = useState<NavigationKey | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(84);

  const navRootRef = useRef<HTMLElement | null>(null);
  // Shell ref — we set style.height imperatively so the browser always
  // sees a valid from→to pair for CSS transition (no React batching surprises).
  const shellRef = useRef<HTMLDivElement | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openFrameRef = useRef<number | null>(null);
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

  // ── Open / close ────────────────────────────────────────────────────────────

  const openMenu = useCallback(
    (key: NavigationKey) => {
      clearCloseTimer();
      clearOpenFrame();

      if (openKey !== null) {
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
    [clearCloseTimer, clearOpenFrame, openKey, setShellHeight],
  );

  const closeMenu = useCallback(() => {
    if (openKey === null && displayKey === null) return;
    clearCloseTimer();
    clearOpenFrame();
    // Animate height to 0 imperatively, then let CSS transition handle it.
    setShellHeight(0);
    setOpenKey(null);
    closeTimerRef.current = setTimeout(() => {
      setDisplayKey(null);
      closeTimerRef.current = null;
    }, DESKTOP_DROPDOWN_CLOSE_DURATION_MS);
  }, [clearCloseTimer, clearOpenFrame, displayKey, openKey, setShellHeight]);

  const toggleMenu = (key: NavigationKey) => {
    if (openKey === key) {
      closeMenu();
      return;
    }
    openMenu(key);
  };

  const closeAll = () => {
    setIsMenuOpen(false);
    closeMenu();
  };

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
      clearOpenFrame();
    },
    [clearCloseTimer, clearOpenFrame],
  );

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Header bar ───────────────────────────────────────────────── */}
      <header
        ref={navRootRef}
        className={cn(styles.bar, isDropdownVisible && styles.barDropdownOpen)}
        data-name="Top Navigation Bar"
      >
        <div className={styles.barInner}>
          {/* Brand */}
          <Link className={styles.brand} href="/" onClick={closeAll}>
            鱼梦江湖
          </Link>

          {/* Desktop nav triggers */}
          <nav aria-label="Primary" className={styles.nav}>
            {items.map((item) => {
              const isActive = item.key === activeKey;
              const isOpen = item.key === openKey;
              return (
                <div key={item.key} className={styles.navItem}>
                  <button
                    aria-controls={desktopMenuId}
                    aria-expanded={isOpen}
                    className={cn(
                      styles.navTrigger,
                      (isActive || isOpen) && styles.navTriggerActive,
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
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
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
          aria-label="Desktop navigation menu"
          className={cn(
            styles.desktopDropdownShell,
            isDropdownOpen && styles.desktopDropdownShellOpen,
          )}
          id={desktopMenuId}
          role="region"
        >
          {activeItem && (
            <div key={activeItem.key} className={styles.desktopDropdownViewport}>
              <div
                className={cn(
                  styles.desktopDropdownPanel,
                  isDropdownOpen && styles.desktopDropdownPanelOpen,
                )}
              >
                <div className={styles.desktopDropdownContent}>
                  <MenuContentRenderer
                    content={activeItem.menu}
                    isSwitching={false}
                    onClose={closeMenu}
                  />
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
        {items.map((item) => (
          <div
            key={item.key}
            ref={(node) => {
              measureRefs.current[item.key] = node;
            }}
            className={styles.desktopDropdownMeasurePanel}
          >
            <div className={styles.desktopDropdownContent}>
              <MenuContentRenderer content={item.menu} isSwitching={false} onClose={() => {}} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Mobile overlay ───────────────────────────────────────────── */}
      <div
        aria-hidden={!isMenuOpen}
        className={cn(styles.mobileMenuOverlay, isMenuOpen && styles.mobileMenuOverlayOpen)}
        onClick={() => setIsMenuOpen(false)}
      >
        <div className={styles.mobileMenuPanel} onClick={(e) => e.stopPropagation()}>
          <nav aria-label="Mobile Primary" className={styles.mobileNav}>
            {items.map((item, index) => {
              const isActive = item.key === activeKey;
              return (
                <Link
                  key={item.key}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(styles.mobileNavLink, isActive && styles.mobileNavLinkActive)}
                  href={item.href ?? "#"}
                  style={{ transitionDelay: isMenuOpen ? `${90 + index * 45}ms` : "0ms" }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className={styles.mobileNavIndex}>0{index + 1}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
