import type { Metadata } from "next";

import { HomePage } from "@/components/home-page/HomePage";
import { createTranslator } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";

const t = createTranslator("en-US");

export const metadata: Metadata = {
  title: t(siteConfig.homePage.metadata.title),
  description: t(siteConfig.homePage.metadata.description),
};

// export default function EnglishPage() {
//   return <HomePage locale="en-US" />;
// }

export default function EnglishPage() {
  return (
    <>
      {/* <h1>{t(siteConfig.homePage.metadata.keywords)}</h1> */}
      <HomePage locale="en-US" />
    </>
  );
}
