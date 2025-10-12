import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/partners/:path*',
        destination: 'http://43.205.26.213:7015/partners/:path*',
      },
      {
        source: '/api/files/:path*',
        destination: 'http://43.205.26.213:7015/files/:path*',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization, Xflow-Account' },
        ],
      },
    ];
  },
};
export default nextConfig;
