import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      {
        protocol: 'https',
        hostname: 'api.phamtuan.net',
      },
      {
        protocol: 'https',
        hostname: 'dev.api.phamtuan.net',
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
