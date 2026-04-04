import type { Metadata } from "next";

import { NotFoundPage } from "@/components/not-found-page/NotFoundPage";
import { buildNotFoundMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildNotFoundMetadata("zh-CN");

export default function NotFound() {
  return <NotFoundPage locale="zh-CN" />;
}
