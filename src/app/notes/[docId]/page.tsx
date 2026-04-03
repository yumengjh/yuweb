import type { Metadata } from "next";

import { RoutePlaceholderPage } from "@/components/route-placeholder/RoutePlaceholderPage";
import { buildRouteMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildRouteMetadata("zh-CN", "notes");
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ docId: "placeholder" }];
}

export default async function NoteDocPage({
  params,
}: {
  params: Promise<{
    docId: string;
  }>;
}) {
  const { docId } = await params;
  void docId;

  return <RoutePlaceholderPage locale="zh-CN" routeId="notes" />;
}
