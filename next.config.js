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
  ...(process.env.STATIC_EXPORT === 'true' ? { output: 'export' } : {}),
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react']
  },
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif']
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
  poweredByHeader: false,
  reactStrictMode: true,
  // Improve CSS debugging in development
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Find CSS loader and enable source maps (without changing devtool)
      config.module.rules.forEach((rule) => {
        if (rule.oneOf) {
          rule.oneOf.forEach((oneOfRule) => {
            if (oneOfRule.use && Array.isArray(oneOfRule.use)) {
              oneOfRule.use.forEach((use) => {
                if (use.loader && use.loader.includes('css-loader')) {
                  use.options = {
                    ...use.options,
                    sourceMap: true,
                  }
                }
              })
            }
          })
        }
      })
    }
    return config
  }
}

module.exports = nextConfig
