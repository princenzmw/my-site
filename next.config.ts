import type { NextConfig } from "next";

/**
 * nzamuwe.com — static export configuration for Cloudflare Pages.
 * `next build` emits a fully prerendered static site into ./out
 * (every page ships real HTML — this is what unlocks the SEO score).
 */
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
