import type { Metadata } from "next";

import { buildRouteMetadata } from "@/lib/seo/metadata";
import { RoutePlaceholderPage } from "@/components/route-placeholder/RoutePlaceholderPage";

export const metadata: Metadata = buildRouteMetadata("zh-CN", "notes");

export default function NotesPage() {
  return <RoutePlaceholderPage locale="zh-CN" routeId="notes" />;
}
