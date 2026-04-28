import type { Metadata } from "next";
import { TravelPage } from "@/components/travel-page/TravelPage";
import { buildRouteMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildRouteMetadata("en-US", "travel");

export default function Page() {
  return <TravelPage locale="en-US" />;
}
