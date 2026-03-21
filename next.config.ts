import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "export",
  generateBuildId: () => `鱼梦出品${Date.now()}`,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
