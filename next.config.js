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
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-popover', '@radix-ui/react-tooltip'],
    optimizeCss: true,
    webpackBuildWorker: true
  },
  images: {
    domains: ['venomappdevelopment.com'],
    formats: ['image/webp', 'image/avif'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    reactRemoveProperties: process.env.NODE_ENV === 'production'
  },
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  // Improve CSS debugging in development and optimize for production
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev) {
      // Enable webpack optimizations
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        chunkIds: 'deterministic',
        sideEffects: false,
        usedExports: true,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true
            },
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: -10,
              chunks: 'all',
              maxSize: 244000
            },
            radix: {
              test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
              name: 'radix',
              priority: 20,
              chunks: 'all'
            },
            lucide: {
              test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
              name: 'lucide',
              priority: 20,
              chunks: 'all'
            }
          }
        }
      }
    }

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
