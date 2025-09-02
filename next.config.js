/** @type {import('next').NextConfig} */
/**
 * NOTE:
 * Static exports (`output: "export"`) break dynamic routing and resulted in
 * hard 404s in production.  We now enable static export **only** when an
 * explicit environment flag is provided (e.g. deployments that truly require
 * it such as GitHub Pages).  For typical Vercel / Supabase Edge deployments
 * leave STATIC_EXPORT unset so dynamic routes work correctly.
 */
const nextConfig = {
  // Enable `"export"` mode only when STATIC_EXPORT=true is set at build time.
  
  // Temporarily disable static generation to isolate build issues
  output: process.env.STATIC_EXPORT === 'true' ? 'export' : undefined,

  experimental: {
    optimizeCss: true
  },
  
  // Move serverComponentsExternalPackages to top level
  serverExternalPackages: ['sharp', 'onnxruntime-node'],
  images: {
    domains: ['venomappdevelopment.com'],
    formats: ['image/webp', 'image/avif'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
    loader: 'default',
    path: '/_next/image',
    unoptimized: false
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
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300'
          }
        ]
      }
    ];
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    reactRemoveProperties: process.env.NODE_ENV === 'production',
    styledComponents: true
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
  webpack: (config, { isServer }) => {
    // Add polyfill for self in server-side rendering
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'self': false,
      };
    }

    return config;
  }
}

module.exports = nextConfig
