import type { Metadata } from "next";

import { RoutePlaceholderPage } from "@/components/route-placeholder/RoutePlaceholderPage";
import { buildRouteMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildRouteMetadata("en-US", "notes");
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ docId: "placeholder" }];
}

export default async function EnglishNoteDocPage({
  params,
}: {
  params: Promise<{
    docId: string;
  }>;
}) {
  const { docId } = await params;
  void docId;

  return <RoutePlaceholderPage locale="en-US" routeId="notes" />;
}
