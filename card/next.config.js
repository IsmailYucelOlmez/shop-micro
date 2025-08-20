/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@shop-micro/shared'],
  experimental: {
    esmExternals: 'loose',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fakestoreapi.com',
        port: '',
        pathname: '/img/**',
      },
    ],
  },
};

module.exports = nextConfig;
