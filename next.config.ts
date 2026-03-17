import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  experimental: {
    staleTimes: {
      dynamic: 300, // cache navigations for 5 minutes
    },
  },
};

export default nextConfig;
