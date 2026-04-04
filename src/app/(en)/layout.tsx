import type { Metadata } from "next";

import { SiteDocument } from "@/components/site-document/SiteDocument";
import { buildRootMetadata } from "@/lib/seo/root-metadata";

import "@fontsource/geist/latin.css";
import "@fontsource/geist-mono/latin.css";
import "../globals.scss";

export const metadata: Metadata = buildRootMetadata("en-US");

export default function EnRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-US" data-locale="en-US" suppressHydrationWarning>
      <SiteDocument locale="en-US">{children}</SiteDocument>
    </html>
  );
}
