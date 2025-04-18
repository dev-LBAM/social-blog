import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'my-social-blog-bucket.s3.sa-east-1.amazonaws.com',
      'my-social-blog-bucket.s3.amazonaws.com',
      'www.gravatar.com',
    ],  
  },
};

export default nextConfig;
