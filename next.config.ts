import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The "N" badge only shows during `npm run dev`. Keep it out of the sidebar.
  devIndicators: { position: "bottom-right" },
};

export default nextConfig;
