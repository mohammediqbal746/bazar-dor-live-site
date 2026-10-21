import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // Apnar idea onujayi sob domain allow kore deya holo
 images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com', // গুগলের সব ছবির জন্য
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com', // গিটহাবের জন্য
      },
    ],
  },
};

export default nextConfig;