import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve images as-is instead of through Vercel's Image Optimization
    // pipeline (avoids its usage limits/cost on this deploy).
    unoptimized: true,
  },
};

export default nextConfig;
