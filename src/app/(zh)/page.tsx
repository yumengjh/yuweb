import type { Metadata } from "next";

import { HomePage } from "@/components/home-page/HomePage";
import { buildHomeMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildHomeMetadata("zh-CN");

export default function Page() {
  return <HomePage locale="zh-CN" />;
}
