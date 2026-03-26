import type { Metadata } from "next";

import { RoutePlaceholderPage } from "@/components/route-placeholder/RoutePlaceholderPage";
import { createTranslator } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";

const t = createTranslator("zh-CN");

export const metadata: Metadata = {
  title: `${t(siteConfig.routeMeta.collections.title)} | ${t(siteConfig.identity.name)}`,
  description: t(siteConfig.routeMeta.collections.description),
};

export default function CollectionsPage() {
  return <RoutePlaceholderPage locale="zh-CN" routeId="collections" />;
}
