import { describe, expect, it } from "vitest";

import {
  buildHomeMetadata,
  buildRouteMetadata,
  getLanguageAlternates,
  getLocalizedMetadataPath,
  getOgImage,
  ogImageSize,
  siteUrl,
} from "@/lib/seo/metadata";

describe("seo metadata helpers", () => {
  it("builds localized canonical paths with trailing slashes", () => {
    expect(getLocalizedMetadataPath("/", "zh-CN")).toBe("/");
    expect(getLocalizedMetadataPath("/", "en-US")).toBe("/en/");
    expect(getLocalizedMetadataPath("/about", "zh-CN")).toBe("/about/");
    expect(getLocalizedMetadataPath("/about", "en-US")).toBe("/en/about/");
  });

  it("builds language alternates for both locales", () => {
    expect(getLanguageAlternates("/journey")).toEqual({
      "zh-CN": "/journey/",
      "en-US": "/en/journey/",
      "x-default": "/journey/",
    });
  });

  it("adds canonical and large-image social metadata for home and route pages", () => {
    const homeMetadata = buildHomeMetadata("zh-CN");
    const routeMetadata = buildRouteMetadata("en-US", "blog");
    const enOgImage = getOgImage("en-US");

    expect(homeMetadata.alternates?.canonical).toBe("/");
    expect(routeMetadata.alternates?.canonical).toBe("/en/blog/");
    expect(routeMetadata.openGraph?.url).toBe("/en/blog/");
    expect(homeMetadata.openGraph?.locale).toBe("zh_CN");
    expect(routeMetadata.openGraph?.images).toEqual([enOgImage]);
    expect(routeMetadata.twitter).toMatchObject({
      card: "summary_large_image",
      images: [enOgImage.url],
    });
    expect(enOgImage).toMatchObject(ogImageSize);
    expect(siteUrl.toString()).toBe("https://www.yumgjs.com/");
  });
});
