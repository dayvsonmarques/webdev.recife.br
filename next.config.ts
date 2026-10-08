import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";
// Panel origin for local dev (it runs as a separate app on :3310 under /paineldosite).
const PANEL_DEV_ORIGIN = process.env.PANEL_DEV_ORIGIN ?? "http://localhost:3310";

const nextConfig: NextConfig = {
  sassOptions: {
    silenceDeprecations: ['import'],
  },
  // In production the Coolify proxy routes /paineldosite to the panel before it
  // reaches this app. Locally there is no proxy, so mimic it in dev only.
  async rewrites() {
    if (!isDev) return [];
    return [
      { source: "/paineldosite", destination: `${PANEL_DEV_ORIGIN}/paineldosite` },
      { source: "/paineldosite/:path*", destination: `${PANEL_DEV_ORIGIN}/paineldosite/:path*` },
    ];
  },
};

export default nextConfig;
