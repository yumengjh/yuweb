import type { Metadata } from "next";

import { HomePage } from "@/components/home-page/HomePage";
import { createTranslator } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";

const t = createTranslator("zh-CN");

export const metadata: Metadata = {
  title: t(siteConfig.homePage.metadata.title),
  description: t(siteConfig.homePage.metadata.description),
};

export default function Page() {
  return <HomePage locale="zh-CN" />;
}
