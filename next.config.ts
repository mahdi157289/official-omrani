import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  output: 'standalone',
  outputFileTracingIncludes: {
    '/*': ['./messages/**/*'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Enable gzip/brotli compression (Cloudflare will also compress at edge)
  compress: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    // Allow Cloudflare Image Resizing to handle optimization at edge
    unoptimized: false,
    // Use WebP/AVIF for significant size savings
    formats: ['image/avif', 'image/webp'],
    // Increase cache TTL so Cloudflare stores images longer
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // HTTP headers for Cloudflare CDN caching
  async headers() {
    return [
      {
        // Cache static assets (JS, CSS, images, fonts) for 1 year at the edge
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache public media (your product images) for 30 days
        source: '/media/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, stale-while-revalidate=86400',
          },
        ],
      },
      {
        // Keep API routes fresh — no CDN caching for dynamic data
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
