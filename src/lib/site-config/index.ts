export * from "./types/site-config.types";
export { siteConfig } from "./data/site-config.data";
export { appRoutes } from "./data/app-routes.data";
export {
  getRouteConfigById,
  getRouteConfigByPathname,
  matchesDomainRule,
  normalizeHostname,
} from "./helpers/site-config.helpers";
