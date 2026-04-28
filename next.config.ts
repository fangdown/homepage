import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 避免 /nestjs-reading/ 与 /nestjs-reading 在「本站 Next」与 vercel.json 反代子站之间
  // 反复 307/308（子站按 X-Forwarded-Host 写回 Location 时尤甚）。见 Vercel/Next 反代尾斜杠讨论。
  skipTrailingSlashRedirect: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/**" },
      { protocol: "https", hostname: "lh4.googleusercontent.com", pathname: "/**" },
      { protocol: "https", hostname: "lh5.googleusercontent.com", pathname: "/**" },
      { protocol: "https", hostname: "lh6.googleusercontent.com", pathname: "/**" },
      { protocol: "https", hostname: "www.gravatar.com", pathname: "/**" },
    ],
  },
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
