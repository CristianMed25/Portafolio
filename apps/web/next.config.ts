import type { NextConfig } from 'next';

const localPattern = {
  protocol: 'http' as const,
  hostname: 'localhost',
  port: '1337',
  pathname: '/**',
};

const dynamicPatterns: Array<{
  protocol: 'http' | 'https';
  hostname: string;
  port?: string;
  pathname: string;
}> = [];

const cloudPatterns = [
  {
    protocol: 'https' as const,
    hostname: '**.media.strapiapp.com',
    pathname: '/**',
  },
  {
    protocol: 'https' as const,
    hostname: '**.strapiapp.com',
    pathname: '/**',
  },
];
const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

if (strapiUrl) {
  try {
    const url = new URL(strapiUrl);
    dynamicPatterns.push({
      protocol: url.protocol.replace(':', '') as 'http' | 'https',
      hostname: url.hostname,
      port: url.port,
      pathname: '/**',
    });
  } catch {
    // Ignore invalid URL values and keep local fallback config.
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [localPattern, ...cloudPatterns, ...dynamicPatterns],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
