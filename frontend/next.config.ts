import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['picsum.photos', 'loremflickr.com', 'res.cloudinary.com'],
  },
  eslint: {
    ignoreDuringBuilds: true, 
  },
};

export default nextConfig;