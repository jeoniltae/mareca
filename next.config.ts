import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // LAN IP 접근 시 HMR WebSocket 허용 (모바일/다른 기기 테스트용)
  allowedDevOrigins: ['192.168.219.108'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: '**.christiandaily.co.kr',
      },
      {
        protocol: 'http',
        hostname: '**.christiandaily.co.kr',
      },
      {
        protocol: 'https',
        hostname: '**.christiantoday.co.kr',
      },
    ],
  },
};

export default nextConfig;
