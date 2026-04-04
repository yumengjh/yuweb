import type { Metadata } from "next";

import { buildRouteMetadata } from "@/lib/seo/metadata";
import { RoutePlaceholderPage } from "@/components/route-placeholder/RoutePlaceholderPage";

export const metadata: Metadata = buildRouteMetadata("zh-CN", "projects");

export default function ProjectsPage() {
  return <RoutePlaceholderPage locale="zh-CN" routeId="projects" />;
}
