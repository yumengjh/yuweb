import type { Metadata } from "next";
import { RoutePlaceholderPage } from "@/components/route-placeholder/RoutePlaceholderPage";
import { buildRouteMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildRouteMetadata("zh-CN", "lab");

export default function Page() {
  return <RoutePlaceholderPage locale="zh-CN" routeId="lab" />;
}
