import type { Metadata } from "next";

import { RoutePlaceholderPage } from "@/components/route-placeholder/RoutePlaceholderPage";
import { createTranslator } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";

const t = createTranslator("en-US");

export const metadata: Metadata = {
  title: `${t(siteConfig.routeMeta.notes.title)} | ${siteConfig.identity.brandLatin}`,
  description: t(siteConfig.routeMeta.notes.description),
};

export default function EnglishNotesPage() {
  return <RoutePlaceholderPage locale="en-US" routeId="notes" />;
}
