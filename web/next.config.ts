import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // Enable standalone output for Docker deployment
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        // Local development (MinIO default port)
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/incidents/**',
      },
      {
        // Docker deployment (MinIO mapped port)
        protocol: 'http',
        hostname: 'localhost',
        port: '8002',
        pathname: '/incidents/**',
      },
      {
        // Production MinIO - allow any host on port 8002
        protocol: 'http',
        hostname: '*',
        port: '8002',
        pathname: '/incidents/**',
      },
      {
        // For production MinIO or S3
        protocol: 'https',
        hostname: '*.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dweazuk8v/**',
      },
    ],
  },
};

export default nextConfig;
