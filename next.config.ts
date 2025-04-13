import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'my-social-blog-bucket.s3.amazonaws.com',
      'www.gravatar.com',
      'via.placeholder.com'
    ],  // Adicione o domínio do seu S3 aqui
  },
};

export default nextConfig;
