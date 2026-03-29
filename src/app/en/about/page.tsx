import type { Metadata } from "next";

import { buildRouteMetadata } from "@/lib/seo/metadata";
import { RoutePlaceholderPage } from "@/components/route-placeholder/RoutePlaceholderPage";

export const metadata: Metadata = buildRouteMetadata("en-US", "about");

export default function EnglishAboutPage() {
  return <RoutePlaceholderPage locale="en-US" routeId="about" />;
}
