import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow any hostname for Phase 1 MVP, can be restricted later for S3/R2
      },
    ],
  },
};

export default nextConfig;
