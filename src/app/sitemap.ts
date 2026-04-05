import type { MetadataRoute } from "next";

import { supportedLocales } from "@/lib/locale-registry";
import { getLocalizedMetadataPath, siteUrl } from "@/lib/seo/metadata";
import { appRoutes } from "@/lib/site-config/data/app-routes.data";

export const dynamic = "force-static";

function toAbsoluteUrl(pathname: string) {
  return new URL(pathname, siteUrl).toString();
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const routePaths = [
    ...new Set(appRoutes.filter((route) => "pathname" in route).map((route) => route.pathname)),
  ];

  return routePaths.flatMap((pathname) =>
    supportedLocales.map((locale) => ({
      url: toAbsoluteUrl(getLocalizedMetadataPath(pathname, locale)),
      lastModified,
      changeFrequency: pathname === "/" ? "weekly" : "monthly",
      priority: pathname === "/" ? 1 : 0.7,
    })),
  );
}
