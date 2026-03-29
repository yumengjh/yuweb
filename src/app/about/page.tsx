import type { Metadata } from "next";

import { AboutPage } from "@/components/about-page/AboutPage";
import { buildRouteMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildRouteMetadata("zh-CN", "about");

export default function AboutRoutePage() {
  return <AboutPage />;
}
