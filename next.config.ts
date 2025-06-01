import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable static HTML export
  output: "standalone",
  
  // Configure headers for API routes
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: "/(.*)",
        headers: [
          // Allow requests from any origin
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          // Allow specific HTTP methods
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          // Allow specific headers
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
  
  // Disable image optimization since this is an API-only project
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
