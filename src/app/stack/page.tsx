import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/page-placeholder/PagePlaceholder";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: `Stack | ${siteConfig.name}`,
  description: siteConfig.description,
};

export default function StackPage() {
  return <PagePlaceholder activeKey="stack" title="Stack" />;
}
