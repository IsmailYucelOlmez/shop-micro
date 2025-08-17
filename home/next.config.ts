import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['shared'],
  experimental: {
    esmExternals: 'loose'
  }
};

export default nextConfig;
