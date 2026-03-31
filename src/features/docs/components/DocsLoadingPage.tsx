import type { SiteLocale } from "@/lib/i18n";
import { getDocsCopy } from "@/features/docs/lib/docs-copy";

import { DocsLoading } from "./DocsLoading";

export function DocsLoadingPage({ locale }: { locale: SiteLocale }) {
  return <DocsLoading label={getDocsCopy(locale).loading} />;
}
