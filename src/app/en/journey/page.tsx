import type { Metadata } from "next";

import { RoutePlaceholderPage } from "@/components/route-placeholder/RoutePlaceholderPage";
import { createTranslator } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";

const t = createTranslator("en-US");

export const metadata: Metadata = {
  title: `${t(siteConfig.routeMeta.journey.title)} | ${siteConfig.identity.brandLatin}`,
  description: t(siteConfig.routeMeta.journey.description),
};

export default function EnglishJourneyPage() {
  return <RoutePlaceholderPage locale="en-US" routeId="journey" />;
}
