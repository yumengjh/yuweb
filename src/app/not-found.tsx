import type { Metadata } from "next";

import { NotFoundRouteBoundary } from "@/components/not-found-page/NotFoundRouteBoundary";
import { buildNotFoundMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildNotFoundMetadata("zh-CN");

export default function NotFound() {
  return <NotFoundRouteBoundary />;
}
