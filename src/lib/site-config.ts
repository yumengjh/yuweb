/* cspell:ignore YUMENGJH */

export type AppRouteId = "home" | "about" | "stack" | "curations" | "journey" | "blog";

export type SiteFooterDomainRule = {
  exact?: string[];
  suffix?: string[];
};

export type SiteFooterMetaItem = {
  id: string;
  label?: string;
  text: string;
  href?: string;
  domains?: SiteFooterDomainRule;
};

export type SiteFooterLink = {
  href: string;
  label: string;
};

export type SiteConfig = {
  name: string;
  brandLatin: string;
  description: string;
  footer: {
    summary: string;
    links: SiteFooterLink[];
    metaItems: SiteFooterMetaItem[];
  };
};

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

export const siteConfig: SiteConfig = {
  name: "鱼梦江湖",
  brandLatin: "YUMENGJH",
  description:
    "我是鱼梦江湖（@yumengjh），一名持续在数字空间中构筑结构与表达的开发者。这个网站不是传统意义上的博客，而是一处逐步展开的个人空间：在这里记录正在形成的思考，整理学习与笔记，构筑阶段性的页面与系统，并将收藏与选择沉淀为可被浏览的结构。项目、记录、素材与路径在此交织，它更像一座不断扩展的私人空间或长期展览，而非一个被一次性完成的作品。",
  footer: {
    summary: "一个持续生长的个人空间，用来记录、构筑与整理，让思考、项目与收藏在结构中慢慢成形。",
    links: [
      { href: "/about", label: "关于" },
      { href: "/notes", label: "笔记" },
      { href: "/projects", label: "项目" },
      { href: "/collections", label: "收藏" },
      { href: "/journey", label: "旅程" },
    ],
    metaItems: [
      {
        id: "email",
        label: "邮箱",
        text: "hi@yumgjs.com",
        href: "mailto:hi@yumgjs.com",
      },
      {
        id: "github",
        label: "GitHub",
        text: "访问我的 GitHub 主页",
        href: "https://github.com/yumengjh",
      },
      {
        id: "copyright",
        label: "版权",
        text: "© 2026 鱼梦江湖 ( @yumengjh ) 版权所有",
        href: "#",
      },
      {
        id: "icp",
        label: "备案号",
        text: "鄂ICP备2026009056号",
        href: "https://beian.miit.gov.cn/",
        domains: {
          suffix: ["localhost", "yumg.cn"],
        },
      },
      // {
      //   id: "police",
      //   label: "公安备案",
      //   text: "沪公网安备12345678901234号",
      //   href: "https://beian.mps.gov.cn/#/query/webSearch",
      //   domains: {
      //     suffix: ["localhost", "yumg.cn"],
      //   },
      // },
    ],
  },
};

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
      fixedNavigation: true,
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
      closeNavigationOnScroll: false,
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

export function normalizeHostname(hostname?: string | null): string {
  if (!hostname) {
    return "";
  }

  return hostname.trim().toLowerCase().replace(/:\d+$/, "");
}

export function matchesDomainRule(
  hostname: string | null | undefined,
  domains?: SiteFooterDomainRule,
): boolean {
  if (!domains) {
    return true;
  }

  const normalizedHostname = normalizeHostname(hostname);

  if (!normalizedHostname) {
    return false;
  }

  const exactMatches = domains.exact?.map(normalizeHostname).filter(Boolean) ?? [];
  if (exactMatches.includes(normalizedHostname)) {
    return true;
  }

  const suffixMatches = domains.suffix?.map(normalizeHostname).filter(Boolean) ?? [];
  return suffixMatches.some(
    (suffix) => normalizedHostname === suffix || normalizedHostname.endsWith(`.${suffix}`),
  );
}

export function getVisibleFooterMetaItems(hostname?: string | null): SiteFooterMetaItem[] {
  return siteConfig.footer.metaItems.filter((item) => matchesDomainRule(hostname, item.domains));
}

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
