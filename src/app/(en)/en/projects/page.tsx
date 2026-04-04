import type { Metadata } from "next";

import { buildRouteMetadata } from "@/lib/seo/metadata";
import { RoutePlaceholderPage } from "@/components/route-placeholder/RoutePlaceholderPage";

export const metadata: Metadata = buildRouteMetadata("en-US", "projects");

export default function EnglishProjectsPage() {
  return <RoutePlaceholderPage locale="en-US" routeId="projects" />;
}
