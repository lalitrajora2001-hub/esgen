import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static-exportable so it can host for free on Netlify, Cloudflare Pages, or Vercel.
  output: "export",
  trailingSlash: true,
  images: {
    // Required for a static export. Real assets live in /public and are referenced locally.
    unoptimized: true,
  },
};

export default nextConfig;
