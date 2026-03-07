import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel handles Next.js natively; static export is only needed for GitHub Pages
  output: process.env.VERCEL ? undefined : 'export',
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  reactCompiler: true,
};

export default nextConfig;
