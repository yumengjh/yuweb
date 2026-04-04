import type { Metadata } from "next";

import { buildRouteMetadata } from "@/lib/seo/metadata";
import { RoutePlaceholderPage } from "@/components/route-placeholder/RoutePlaceholderPage";

export const metadata: Metadata = buildRouteMetadata("en-US", "stack");

export default function EnglishStackPage() {
  return <RoutePlaceholderPage locale="en-US" routeId="stack" />;
}
