import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/page-placeholder/PagePlaceholder";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: `About | ${siteConfig.name}`,
  description: siteConfig.description,
};

export default function AboutPage() {
  return <PagePlaceholder activeKey="about" title="About" />;
}
