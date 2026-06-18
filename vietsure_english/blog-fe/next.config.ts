import type { NextConfig } from "next";

if (typeof Promise.withResolvers === 'undefined') {
  (Promise as any).withResolvers = function() {
    let resolve;
    let reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname:
          "0d99-2402-800-61cd-b013-ec47-be6b-e1dd-f176.ngrok-free.app",
      },
      {
        protocol: "https",
        hostname:
          "https://7d62-171-226-8-70.ngrok-free.app",
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      {
        protocol: 'http',
        hostname: '27.71.24.102',
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
