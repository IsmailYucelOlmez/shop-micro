import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['shared'],
  experimental: {
    esmExternals: 'loose'
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fakestoreapi.com',
      },
    ],
  }
};

export default nextConfig;
