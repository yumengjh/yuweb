import type { Metadata } from "next";

import { buildRouteMetadata } from "@/lib/seo/metadata";
import { RoutePlaceholderPage } from "@/components/route-placeholder/RoutePlaceholderPage";

export const metadata: Metadata = buildRouteMetadata("en-US", "blog");

export default function EnglishBlogPage() {
  return <RoutePlaceholderPage locale="en-US" routeId="blog" />;
}
