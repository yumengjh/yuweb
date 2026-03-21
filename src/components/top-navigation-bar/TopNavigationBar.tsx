"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { cn } from "@/utils/cn";

import styles from "./TopNavigationBar.module.scss";

type NavigationKey = "about" | "stack" | "curations" | "journey";

type NavigationItem = {
  href: string;
  key: NavigationKey;
  label: string;
};

const navigationItems: NavigationItem[] = [
  { href: "/about", key: "about", label: "About" },
  { href: "/stack", key: "stack", label: "Stack" },
  { href: "/curations", key: "curations", label: "Curations" },
  { href: "/journey", key: "journey", label: "Journey" },
];

type TopNavigationBarProps = {
  activeKey?: NavigationKey;
};

export function TopNavigationBar({ activeKey }: TopNavigationBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className={styles.bar} data-name="Top Navigation Bar" data-node-id="3:608">
        <Link className={styles.brand} href="/">
          鱼梦江湖
        </Link>
        <nav aria-label="Primary" className={styles.nav}>
          {navigationItems.map((item) => {
            const isActive = item.key === activeKey;

            return (
              <Link
                key={item.key}
                aria-current={isActive ? "page" : undefined}
                className={cn(styles.navLink, isActive && styles.navLinkActive)}
                href={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div aria-hidden="true" className={styles.desktopIcon}>
          <span />
          <span />
        </div>
        <button
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          className={cn(styles.menuButton, isMenuOpen && styles.menuButtonOpen)}
          type="button"
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
        </button>
      </header>
      <div
        aria-hidden={!isMenuOpen}
        className={cn(styles.mobileMenuOverlay, isMenuOpen && styles.mobileMenuOverlayOpen)}
        onClick={() => setIsMenuOpen(false)}
      >
        <div className={styles.mobileMenuPanel} onClick={(event) => event.stopPropagation()}>
          <nav aria-label="Mobile Primary" className={styles.mobileNav}>
            {navigationItems.map((item, index) => {
              const isActive = item.key === activeKey;

              return (
                <Link
                  key={item.key}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(styles.mobileNavLink, isActive && styles.mobileNavLinkActive)}
                  href={item.href}
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
