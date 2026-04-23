import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // LAN IP 접근 시 HMR WebSocket 허용 (모바일/다른 기기 테스트용)
  allowedDevOrigins: ['192.168.219.108'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
