import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/posts/message', destination: '/community/message', permanent: true },
      { source: '/posts/voice', destination: '/community/voice', permanent: true },
      // 레거시 PHP 홈페이지 → 현재 홈으로 영구 이동 (Google 색인 정리용)
      { source: '/index.php', destination: '/', permanent: true },
      // 노회소식 → 클럽소식 개편(9718bdc)으로 삭제된 경로.
      // 삭제 후에도 검색 노출이 계속 발생해(GSC 3개월 38회) 404로 유실되던 것을 회수한다.
      { source: '/presbytery', destination: '/club-news/news', permanent: true },
      { source: '/presbytery/:path*', destination: '/club-news/news', permanent: true },
    ];
  },
  turbopack: {},
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

export default withPWA(nextConfig);
