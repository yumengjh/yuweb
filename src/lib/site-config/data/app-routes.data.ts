import type { AppRouteConfig } from "../types/site-config.types";

export const appRoutes: AppRouteConfig[] = [
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

export const fallbackRoute = appRoutes[0];
