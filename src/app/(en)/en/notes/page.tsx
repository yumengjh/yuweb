import type { Metadata } from "next";

import { buildRouteMetadata } from "@/lib/seo/metadata";
import { RoutePlaceholderPage } from "@/components/route-placeholder/RoutePlaceholderPage";

export const metadata: Metadata = buildRouteMetadata("en-US", "notes");

export default function EnglishNotesPage() {
  return <RoutePlaceholderPage locale="en-US" routeId="notes" />;
}
