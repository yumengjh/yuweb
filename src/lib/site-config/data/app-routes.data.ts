import type { AppRouteConfig } from "../types/site-config.types";

const pathnameRoutes: AppRouteConfig[] = [
  {
    id: "home",
    pathname: "/",
    match: "exact",
    layout: {
      showNavigation: true,
      showFooter: true,
      fixedNavigation: true,
      closeNavigationOnScroll: true,
      activeNavigationKey: "home",
    },
  },
  {
    id: "about",
    pathname: "/about",
    match: "prefix",
    layout: {
      showNavigation: true,
      showFooter: true,
      fixedNavigation: false,
      closeNavigationOnScroll: false,
      activeNavigationKey: "about",
    },
  },
  {
    id: "stack",
    pathname: "/stack",
    match: "prefix",
    layout: {
      showNavigation: true,
      showFooter: true,
      fixedNavigation: false,
      closeNavigationOnScroll: true,
      activeNavigationKey: "stack",
    },
  },
  {
    id: "curations",
    pathname: "/curations",
    match: "prefix",
    layout: {
      showNavigation: true,
      showFooter: true,
      fixedNavigation: false,
      closeNavigationOnScroll: true,
      activeNavigationKey: "curations",
    },
  },
  {
    id: "journey",
    pathname: "/journey",
    match: "prefix",
    layout: {
      showNavigation: true,
      showFooter: true,
      fixedNavigation: false,
      closeNavigationOnScroll: true,
      activeNavigationKey: "journey",
    },
  },
  {
    id: "blog",
    pathname: "/blog",
    match: "prefix",
    layout: {
      showNavigation: true,
      showFooter: true,
      fixedNavigation: false,
      closeNavigationOnScroll: true,
      activeNavigationKey: "blog",
    },
  },
  {
    id: "notes",
    pathname: "/notes",
    match: "prefix",
    layout: {
      showNavigation: true,
      showFooter: true,
      fixedNavigation: false,
      closeNavigationOnScroll: true,
      activeNavigationKey: "notes",
    },
  },
  {
    id: "projects",
    pathname: "/projects",
    match: "prefix",
    layout: {
      showNavigation: true,
      showFooter: true,
      fixedNavigation: false,
      closeNavigationOnScroll: true,
      activeNavigationKey: "projects",
    },
  },
  {
    id: "collections",
    pathname: "/collections",
    match: "prefix",
    layout: {
      showNavigation: true,
      showFooter: true,
      fixedNavigation: false,
      closeNavigationOnScroll: true,
      activeNavigationKey: "collections",
    },
  },
];

// 缺点：这里只能覆盖“未知 pathname 触发的 404”导航；若后续在已匹配页面内主动调用 notFound()，仍需显式切到 notFound 配置。
export const notFoundRoute: AppRouteConfig = {
  id: "notFound",
  layout: {
    showNavigation: true,
    showFooter: true,
    fixedNavigation: true,
    closeNavigationOnScroll: false,
    activeNavigationKey: undefined,
  },
};

export const appRoutes: AppRouteConfig[] = [...pathnameRoutes, notFoundRoute];

export const fallbackRoute = pathnameRoutes[0];
