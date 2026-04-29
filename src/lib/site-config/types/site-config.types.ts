import type { MessageToken } from "@/lib/i18n-keys";
import type { LocaleMode, SiteLocale } from "@/lib/locale-registry";

export type { LocaleMode, SiteLocale };
export type { MessageToken };

export type AppRouteId =
  | "home"
  | "about"
  | "stack"
  | "curations"
  | "journey"
  | "blog"
  | "notes"
  | "projects"
  | "collections"
  | "travel";

export type AppSystemRouteId = "notFound";

export type AppRouteConfigId = AppRouteId | AppSystemRouteId;

export type SiteFooterDomainRule = {
  exact?: string[];
  suffix?: string[];
};

export type SiteFooterMetaItemConfig = {
  id: string;
  label?: MessageToken;
  text: MessageToken;
  href?: string;
  domains?: SiteFooterDomainRule;
};

export type SiteFooterLinkConfig = {
  href: string;
  label: MessageToken;
};

export type AppRouteLayoutConfig = {
  showNavigation: boolean;
  showFooter: boolean;
  fixedNavigation: boolean;
  closeNavigationOnScroll: boolean;
  activeNavigationKey?: string;
};

export type AppRouteConfig =
  | {
      id: AppRouteId;
      pathname: string;
      match: "exact" | "prefix";
      layout: AppRouteLayoutConfig;
    }
  | {
      id: AppSystemRouteId;
      layout: AppRouteLayoutConfig;
    };

export type SiteNavigationEntryConfig = {
  href: string;
  title: MessageToken;
  description?: MessageToken;
  target?: "_self" | "_blank" | "_parent" | "_top";
};

export type SiteNavigationGroupConfig = {
  label?: MessageToken;
  entries: SiteNavigationEntryConfig[];
};

export type SiteNavigationItemConfig = {
  key: string;
  label: MessageToken;
  href?: string;
  menu?:
    | {
        kind: "entries";
        entries: SiteNavigationEntryConfig[];
      }
    | {
        kind: "groups";
        groups: SiteNavigationGroupConfig[];
      }
    | {
        kind: "component";
        contentId: never;
      };
  mobileMenu?: SiteNavigationGroupConfig[];
};
