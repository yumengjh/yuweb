"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { SiteFooter } from "@/components/site-footer/SiteFooter";
import { TopNavigationBar } from "@/components/top-navigation-bar/TopNavigationBar";
import { getRouteConfigByPathname } from "@/lib/site-config";

import styles from "./AppShell.module.scss";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const route = getRouteConfigByPathname(pathname);

  return (
    <>
      {route.layout.showNavigation && (
        <TopNavigationBar
          activeKey={route.layout.activeNavigationKey}
          closeOnScroll={route.layout.closeNavigationOnScroll}
          fixed={route.layout.fixedNavigation}
        />
      )}

      {route.layout.showNavigation && route.layout.fixedNavigation && (
        <div aria-hidden="true" className={styles.fixedOffset} />
      )}

      {children}

      {route.layout.showFooter && <SiteFooter />}
    </>
  );
}
