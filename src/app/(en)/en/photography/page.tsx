import type { Metadata } from "next";
import { RoutePlaceholderPage } from "@/components/route-placeholder/RoutePlaceholderPage";
import { buildRouteMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildRouteMetadata("en-US", "photography");

export default function Page() {
  return <RoutePlaceholderPage locale="en-US" routeId="photography" />;
}
