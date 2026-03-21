import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/page-placeholder/PagePlaceholder";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: `Journey | ${siteConfig.name}`,
  description: siteConfig.description,
};

export default function JourneyPage() {
  return <PagePlaceholder activeKey="journey" title="Journey" />;
}
