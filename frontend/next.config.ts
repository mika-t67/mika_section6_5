import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // バックエンドAPIへのプロキシ設定（Issue 9で活用）
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;