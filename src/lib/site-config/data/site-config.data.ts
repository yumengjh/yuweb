import {
  comingSoon,
  footer,
  getMessageToken,
  home,
  language,
  nav,
  notFound,
  route,
  site,
  theme,
} from "@/lib/i18n-keys";
import { supportedLocales } from "@/lib/locale-registry";

import type {
  AppRouteId,
  LocaleMode,
  MessageToken,
  SiteFooterLinkConfig,
  SiteFooterMetaItemConfig,
  SiteLocale,
  SiteNavigationEntryConfig,
  SiteNavigationItemConfig,
} from "../types/site-config.types";

const localeModeLabelTokens = Object.fromEntries(
  supportedLocales.map((locale) => [locale, getMessageToken(`language.mode.${locale}`)]),
) as Record<SiteLocale, MessageToken>;

const languageToggleModeLabels = {
  auto: language.mode.auto,
  ...localeModeLabelTokens,
} as const satisfies Record<LocaleMode, MessageToken>;

export const siteConfig = {
  i18n: {
    enabled: true,
    autoDetect: true,
    defaultLocale: supportedLocales[0] as SiteLocale,
    supportedLocales: [...supportedLocales] as SiteLocale[],
  },
  identity: {
    name: site.identity.name,
    brandLatin: "YUMENGJH",
    description: site.identity.description,
  },
  routeMeta: {
    home: {
      title: route.home.title,
      description: route.home.description,
    },
    about: {
      title: route.about.title,
      description: route.about.description,
    },
    stack: {
      title: route.stack.title,
      description: route.stack.description,
    },
    curations: {
      title: route.curations.title,
      description: route.curations.description,
    },
    journey: {
      title: route.journey.title,
      description: route.journey.description,
    },
    blog: {
      title: route.blog.title,
      description: route.blog.description,
    },
    notes: {
      title: route.notes.title,
      description: route.notes.description,
    },
    projects: {
      title: route.projects.title,
      description: route.projects.description,
    },
    collections: {
      title: route.collections.title,
      description: route.collections.description,
    },
  } as const satisfies Record<AppRouteId, { title: MessageToken; description: MessageToken }>,
  topNavigationBar: {
    labels: {
      navAriaLabel: nav.aria.primary,
      desktopMenuAriaLabel: nav.aria.desktopMenu,
      openMenuLabel: nav.aria.openMenu,
      closeMenuLabel: nav.aria.closeMenu,
    },
    mobileFooter: {
      lines: [nav.mobileFooter.line1, nav.mobileFooter.line2, nav.mobileFooter.line3] as const,
    },
    items: [
      {
        key: "about",
        label: nav.about.label,
        href: "/about",
        menu: {
          kind: "groups",
          groups: [
            {
              label: nav.about.group.start,
              entries: [
                {
                  title: nav.about.startFromHere.title,
                  description: nav.about.startFromHere.description,
                  href: "/about#start",
                },
                {
                  title: nav.about.thisSite.title,
                  description: nav.about.thisSite.description,
                  href: "/about#site",
                },
              ],
            },
            {
              label: nav.about.group.aboutMe,
              entries: [
                {
                  title: nav.about.current.title,
                  description: nav.about.current.description,
                  href: "/about#now",
                },
                {
                  title: nav.about.learning.title,
                  description: nav.about.learning.description,
                  href: "/about#learning",
                },
                {
                  title: nav.about.fields.title,
                  description: nav.about.fields.description,
                  href: "/about#fields",
                },
              ],
            },
            {
              label: nav.about.group.explore,
              entries: [
                {
                  title: nav.about.stack.title,
                  description: nav.about.stack.description,
                  href: "/about#stack",
                },
                {
                  title: nav.about.viewPage.title,
                  description: nav.about.viewPage.description,
                  href: "/about",
                },
              ],
            },
          ],
        },
      },
      {
        key: "notes",
        label: nav.notes.label,
        href: "/notes",
        menu: {
          kind: "entries",
          entries: [
            {
              title: nav.notes.recent.title,
              description: nav.notes.recent.description,
              href: "/notes#recent",
            },
            {
              title: nav.notes.tech.title,
              description: nav.notes.tech.description,
              href: "/notes#tech",
            },
            {
              title: nav.notes.learning.title,
              description: nav.notes.learning.description,
              href: "/notes#learning",
            },
            {
              title: nav.notes.fragments.title,
              description: nav.notes.fragments.description,
              href: "/notes#fragments",
            },
            {
              title: nav.notes.qa.title,
              description: nav.notes.qa.description,
              href: "/notes#qa",
            },
            {
              title: nav.notes.viewPage.title,
              description: nav.notes.viewPage.description,
              href: "/notes",
            },
          ],
        },
      },
      {
        key: "projects",
        label: nav.projects.label,
        href: "/projects",
        menu: {
          kind: "groups",
          groups: [
            {
              label: nav.projects.group.inProgress,
              entries: [
                {
                  title: nav.projects.inProgress.title,
                  description: nav.projects.inProgress.description,
                  href: "/projects#in-progress",
                },
                {
                  title: nav.projects.experiments.title,
                  description: nav.projects.experiments.description,
                  href: "/projects#experiments",
                },
              ],
            },
            {
              label: nav.projects.group.archive,
              entries: [
                {
                  title: nav.projects.featured.title,
                  description: nav.projects.featured.description,
                  href: "/projects#featured",
                },
                {
                  title: nav.projects.opensource.title,
                  description: nav.projects.opensource.description,
                  href: "/projects#opensource",
                },
              ],
            },
            {
              label: nav.projects.group.abandoned,
              entries: [
                {
                  title: nav.projects.abandonedIdeas.title,
                  description: nav.projects.abandonedIdeas.description,
                  href: "/projects#abandoned-ideas",
                },
                {
                  title: nav.projects.failures.title,
                  description: nav.projects.failures.description,
                  href: "/projects#failures",
                },
                {
                  title: nav.projects.viewPage.title,
                  description: nav.projects.viewPage.description,
                  href: "/projects",
                },
              ],
            },
          ],
        },
      },
      {
        key: "collections",
        label: nav.collections.label,
        href: "/collections",
        menu: {
          kind: "entries",
          entries: [
            {
              title: nav.collections.books.title,
              description: nav.collections.books.description,
              href: "/collections#books",
            },
            {
              title: nav.collections.articles.title,
              description: nav.collections.articles.description,
              href: "/collections#articles",
            },
            {
              title: nav.collections.materialLibrary.title,
              description: nav.collections.materialLibrary.description,
              href: "/collections#material-library",
            },
            {
              title: nav.collections.referenceSystem.title,
              description: nav.collections.referenceSystem.description,
              href: "/collections#reference-system",
            },
            {
              title: nav.collections.toolkit.title,
              description: nav.collections.toolkit.description,
              href: "/collections#toolkit",
            },
            {
              title: nav.collections.viewPage.title,
              description: nav.collections.viewPage.description,
              href: "/collections",
            },
          ],
        },
      },
      {
        key: "journey",
        label: nav.journey.label,
        href: "/journey",
        menu: {
          kind: "component",
          contentId: "journey",
        },
        mobileMenu: [
          {
            label: nav.journey.label,
            entries: [
              { title: nav.journey.milestones.title, href: "/journey#milestones" },
              { title: nav.journey.inProgress.title, href: "/journey#in-progress" },
              { title: nav.journey.timeline.title, href: "/journey#timeline" },
              { title: nav.journey.viewPageLabel, href: "/journey" },
            ],
          },
        ],
      },
    ] as const satisfies SiteNavigationItemConfig[],
    componentContent: {
      journey: {
        nodesLabel: nav.journey.nodesLabel,
        recentLabel: nav.journey.recentLabel,
        recentSummary: nav.journey.recentSummary,
        viewPageLabel: nav.journey.viewPageLabel,
        entries: [
          { title: nav.journey.milestones.title, href: "/journey#milestones" },
          { title: nav.journey.inProgress.title, href: "/journey#in-progress" },
          { title: nav.journey.timeline.title, href: "/journey#timeline" },
        ] as const satisfies SiteNavigationEntryConfig[],
      },
    },
  },
  footer: {
    summary: footer.summary,
    navAriaLabel: footer.aria.navigation,
    metaAriaLabel: footer.aria.metadata,
    links: [
      { href: "/about", label: nav.about.label },
      { href: "/stack", label: nav.stack.label },
      { href: "/curations", label: nav.curations.label },
      { href: "/journey", label: nav.journey.label },
      { href: "/blog", label: nav.blog.label },
    ] as const satisfies SiteFooterLinkConfig[],
    metaItems: [
      {
        id: "email",
        label: footer.meta.email.label,
        text: footer.meta.email.text,
        href: "mailto:hi@yumgjs.com",
      },
      {
        id: "github",
        label: footer.meta.github.label,
        text: footer.meta.github.text,
        href: "https://github.com/yumengjh",
      },
      {
        id: "copyright",
        label: footer.meta.copyright.label,
        text: footer.meta.copyright.text,
      },
      {
        id: "icp",
        label: footer.meta.icp.label,
        text: footer.meta.icp.text,
        href: "https://beian.miit.gov.cn/",
        domains: {
          suffix: ["localhost", "yumg.cn"],
        },
      },
    ] as const satisfies SiteFooterMetaItemConfig[],
  },
  homePage: {
    metadata: {
      title: home.metadata.title,
      description: home.metadata.description,
    },
    hero: {
      topLeft: home.hero.topLeft,
      topRight: home.hero.topRight,
      title: home.hero.title,
      titleAccent: home.hero.titleAccent,
      focusLabel: home.hero.focusLabel,
      focusValue: home.hero.focusValue,
      modeLabel: home.hero.modeLabel,
      modeValue: home.hero.modeValue,
      statusLabel: home.hero.statusLabel,
      statusValue: home.hero.statusValue,
      summary: home.hero.summary,
    },
    marquees: {
      afterHero: {
        itemsPath: home.marquees.afterHero.items,
        separator: home.marquee.separator,
        speed: 60,
        gap: "14px",
        direction: "left",
        pauseOnHover: true,
      },
      afterPhilosophy: {
        itemsPath: home.marquees.afterPhilosophy.items,
        separator: home.marquee.separator,
        speed: 42,
        gap: "16px",
        direction: "right",
        pauseOnHover: true,
      },
      afterCapabilities: {
        itemsPath: home.marquees.afterCapabilities.items,
        separator: home.marquee.separator,
        speed: 34,
        gap: "12px",
        direction: "left",
        pauseOnHover: true,
      },
      afterWorks: {
        itemsPath: home.marquees.afterWorks.items,
        separator: home.marquee.separator,
        speed: 40,
        gap: "18px",
        direction: "right",
        pauseOnHover: true,
      },
      afterGears: {
        itemsPath: home.marquees.afterGears.items,
        separator: home.marquee.separator,
        speed: 32,
        gap: "14px",
        direction: "left",
        pauseOnHover: true,
      },
      afterArchive: {
        itemsPath: home.marquees.afterArchive.items,
        separator: home.marquee.separator,
        speed: 44,
        gap: "16px",
        direction: "right",
        pauseOnHover: true,
      },
    },
    sectionTitles: {
      philosophy: home.section.philosophy,
      capabilities: home.section.capabilities,
      works: home.section.works,
      gears: home.section.gears,
      archive: home.section.archive,
      experience: home.section.experience,
    },
    philosophy: {
      title: home.philosophy.title,
      paragraphs: [home.philosophy.paragraph1, home.philosophy.paragraph2] as const,
    },
    links: {
      exploreCase: home.link.exploreCase,
      hardwareInventory: home.link.hardwareInventory,
      completeLibrary: home.link.completeLibrary,
    },
    table: {
      refId: home.table.refId,
      title: home.table.title,
      author: home.table.author,
      year: home.table.year,
    },
    capabilities: [
      {
        icon: "arch",
        title: home.capability.arch.title,
        eyebrow: home.capability.arch.eyebrow,
        desc: home.capability.arch.desc,
      },
      {
        icon: "logic",
        title: home.capability.logic.title,
        eyebrow: home.capability.logic.eyebrow,
        desc: home.capability.logic.desc,
      },
      {
        icon: "server",
        title: home.capability.server.title,
        eyebrow: home.capability.server.eyebrow,
        desc: home.capability.server.desc,
      },
      {
        icon: "optimize",
        title: home.capability.optimize.title,
        eyebrow: home.capability.optimize.eyebrow,
        desc: home.capability.optimize.desc,
      },
    ] as const,
    works: [
      {
        year: "2024",
        visual: "light",
        align: "left",
        title: home.work.matrix.title,
        type: home.work.matrix.type,
      },
      {
        year: "2023",
        visual: "dark",
        align: "right",
        title: home.work.grid.title,
        type: home.work.grid.type,
      },
    ] as const,
    gears: [
      {
        category: "COMPUTE",
        name: "MacBook Pro 16",
        spec: "M3 Max / 64GB / 2TB",
        desc: home.gear.compute.desc,
      },
      {
        category: "DISPLAY",
        name: "Apple Studio Display",
        spec: "5K Retina / Nano-texture",
        desc: home.gear.display.desc,
      },
      {
        category: "INPUT",
        name: "HHKB Pro HYBRID",
        spec: "Topre Switches / Type-S",
        desc: home.gear.input.desc,
      },
      {
        category: "SUPPORT",
        name: "Herman Miller Aeron",
        spec: "Size B / PostureFit SL",
        desc: home.gear.support.desc,
      },
    ] as const,
    books: [
      {
        id: "B-01",
        title: "Grid Systems in Graphic Design",
        author: "Josef Müller-Brockmann",
        year: "1981",
      },
      { id: "B-02", title: "The Design of Everyday Things", author: "Don Norman", year: "1988" },
      { id: "B-03", title: "Clean Architecture", author: "Robert C. Martin", year: "2017" },
      { id: "B-04", title: "Refactoring UI", author: "Adam Wathan & Steve Schoger", year: "2018" },
    ] as const,
    experiences: [
      {
        period: home.experience.lead.period,
        title: home.experience.lead.title,
        company: home.experience.lead.company,
      },
      {
        period: home.experience.senior.period,
        title: home.experience.senior.title,
        company: home.experience.senior.company,
      },
      {
        period: home.experience.visual.period,
        title: home.experience.visual.title,
        company: home.experience.visual.company,
      },
    ] as const,
  },
  notFoundPage: {
    title: notFound.title,
    titleAccent: notFound.titleAccent,
    heroTopLeft: notFound.heroTopLeft,
    heroTopRight: notFound.heroTopRight,
    targetLabel: notFound.targetLabel,
    targetValue: notFound.targetValue,
    stateLabel: notFound.stateLabel,
    stateValue: notFound.stateValue,
    summary: notFound.summary,
    actionLabel: notFound.actionLabel,
  },
  comingSoonPage: {
    description: comingSoon.description,
    note: comingSoon.note,
  },
  themeToggle: {
    label: theme.label,
    ariaLabel: theme.aria,
    modeLabels: {
      auto: theme.mode.auto,
      light: theme.mode.light,
      dark: theme.mode.dark,
    },
  },
  languageToggle: {
    label: language.label,
    triggerAriaLabel: language.aria.trigger,
    menuAriaLabel: language.aria.menu,
    modeLabels: languageToggleModeLabels,
  },
};
