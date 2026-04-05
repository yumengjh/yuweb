import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "export",
  experimental: {
    globalNotFound: true,
  },
  generateBuildId: () => `鱼梦出品${Date.now()}`,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  assetPrefix: process.env.NEXT_PUBLIC_CDN_URL || undefined,
};

export default nextConfig;
