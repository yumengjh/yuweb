import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/page-placeholder/PagePlaceholder";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: `Curations | ${siteConfig.name}`,
  description: siteConfig.description,
};

export default function CurationsPage() {
  return <PagePlaceholder activeKey="curations" title="Curations" />;
}
