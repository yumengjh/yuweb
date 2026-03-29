import type { Metadata } from "next";

import { HomePage } from "@/components/home-page/HomePage";
import { buildHomeMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildHomeMetadata("en-US");

export default function EnglishPage() {
  return (
    <>
      <HomePage locale="en-US" />
    </>
  );
}
