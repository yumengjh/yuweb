/* cspell:ignore YUMENGJH */

export type AppRouteId = "home" | "about" | "stack" | "curations" | "journey" | "blog";

export type AppRouteLayoutConfig = {
  showNavigation: boolean;
  showFooter: boolean;
  fixedNavigation: boolean;
  closeNavigationOnScroll: boolean;
  activeNavigationKey?: string;
};

export type AppRouteConfig = {
  id: AppRouteId;
  pathname: string;
  title: string;
  description: string;
  match: "exact" | "prefix";
  layout: AppRouteLayoutConfig;
};

export const siteConfig = {
  name: "鱼梦江湖",
  brandLatin: "YUMENGJH",
  description: "聚焦数字空间、系统感与前端构筑方式的个人作品站。",
  footer: {
    summary: "A restrained portfolio focused on digital space, systems, and front-end craft.",
    links: [
      { href: "/about", label: "About" },
      { href: "/stack", label: "Stack" },
      { href: "/curations", label: "Curations" },
      { href: "/journey", label: "Journey" },
    ],
  },
} as const;

export const appRoutes: AppRouteConfig[] = [
  {
    id: "home",
    pathname: "/",
    title: "Home",
    description: "首页，串联关于、技术栈、精选项目与旅程。",
    match: "exact",
    layout: {
      showNavigation: true,
      showFooter: true,
      fixedNavigation: false,
      closeNavigationOnScroll: true,
      activeNavigationKey: "home",
    },
  },
  {
    id: "about",
    pathname: "/about",
    title: "About",
    description: "关于鱼梦江湖的空间感、表达方式与当前关注。",
    match: "prefix",
    layout: {
      showNavigation: true,
      showFooter: true,
      fixedNavigation: false,
      closeNavigationOnScroll: true,
      activeNavigationKey: "about",
    },
  },
  {
    id: "stack",
    pathname: "/stack",
    title: "Stack",
    description: "围绕 Next.js、TypeScript 与系统化前端实践展开的技术栈页面。",
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
    title: "Curations",
    description: "精选项目与持续归档的参考体系。",
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
    title: "Journey",
    description: "按时间线整理的经历、阶段与正在进行中的工作。",
    match: "prefix",
    layout: {
      showNavigation: true,
      showFooter: true,
      fixedNavigation: false,
      closeNavigationOnScroll: true,
      activeNavigationKey: "旅程",
    },
  },
  {
    id: "blog",
    pathname: "/blog",
    title: "Blog",
    description: "关于数字设计、前端工程与个人思考的记录。",
    match: "prefix",
    layout: {
      showNavigation: true,
      showFooter: true,
      fixedNavigation: false,
      closeNavigationOnScroll: true,
    },
  },
] as const;

const fallbackRoute = appRoutes[0];

export function getRouteConfigById(id: AppRouteId): AppRouteConfig {
  return appRoutes.find((route) => route.id === id) ?? fallbackRoute;
}

export function getRouteConfigByPathname(pathname: string): AppRouteConfig {
  if (!pathname) {
    return fallbackRoute;
  }

  const exactMatch = appRoutes.find(
    (route) => route.match === "exact" && route.pathname === pathname,
  );

  if (exactMatch) {
    return exactMatch;
  }

  const prefixMatch = appRoutes.find(
    (route) =>
      route.match === "prefix" &&
      (pathname === route.pathname || pathname.startsWith(`${route.pathname}/`)),
  );

  return prefixMatch ?? fallbackRoute;
}
