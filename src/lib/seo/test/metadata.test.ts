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
    expect(getLanguageAlternates("/about")).toEqual({
      "zh-CN": "/about/",
      "en-US": "/en/about/",
      "x-default": "/about/",
    });
  });

  it("adds canonical and large-image social metadata for home and route pages", () => {
    const homeMetadata = buildHomeMetadata("zh-CN");
    const routeMetadata = buildRouteMetadata("en-US", "projects");
    const enOgImage = getOgImage("en-US");

    expect(homeMetadata.alternates?.canonical).toBe("/");
    expect(routeMetadata.alternates?.canonical).toBe("/en/projects/");
    expect(routeMetadata.openGraph?.url).toBe("/en/projects/");
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
