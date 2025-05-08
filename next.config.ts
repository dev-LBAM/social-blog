import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'my-social-blog-bucket.s3.sa-east-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'my-social-blog-bucket.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'www.gravatar.com',
      },
    ],
  },
};

export default nextConfig;
