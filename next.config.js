/** @type {import('next').NextConfig} */
/**
 * Performance-optimized Next.js configuration with aggressive optimizations
 * for critical 24-hour production deadline
 */
const nextConfig = {
  // Static export configuration (simplified)
  output: process.env.STATIC_EXPORT === 'true' ? 'export' : undefined,

  experimental: {
    optimizeCss: true,
    // Enable optimizePackageImports for better tree-shaking
    optimizePackageImports: ['lucide-react', 'framer-motion']
  },

  // Move serverComponentsExternalPackages to top level
  serverExternalPackages: ['sharp', 'onnxruntime-node'],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'venomappdevelopment.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
    loader: 'default',
    path: '/_next/image',
    unoptimized: false,
  },

  // Enhanced caching headers
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/assets/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000' // 30 days
          }
        ]
      },
      {
        source: '/(.*).webp',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000'
          },
          {
            key: 'Vary',
            value: 'Accept'
          }
        ]
      },
      {
        source: '/(.*).woff2',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'payment=(self "https://js.stripe.com"), camera=(), microphone=(), geolocation=(), usb=(), magnetometer=(), accelerometer=(), gyroscope=()'
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          }
          // CSP is managed in middleware.ts — single source of truth
        ]
      }
    ];
  },

  // Core compiler settings with performance focus
  compiler: {
    // Keep error/warn in production for debugging; strip console.log/info/debug
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
    reactRemoveProperties: process.env.NODE_ENV === 'production',
    // styledComponents removed — project uses Tailwind CSS
  },

  // Performance optimizations
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  generateEtags: true,
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },

  // Preserve the server fallback and project alias without overriding Next.js'
  // production chunking strategy.
  webpack: (config, { isServer }) => {
    // Add polyfill for self in server-side rendering
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'self': false,
      };
    }

    // Ensure proper path alias resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
    };

    // Optimize module resolution
    config.resolve.extensions = ['.tsx', '.ts', '.jsx', '.js', '.json'];

    return config;
  },

  // Optimize output
  trailingSlash: false,

  // Configure redirects if needed
  async redirects() {
    return [];
  },

  // Performance monitoring
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
}

module.exports = nextConfig
