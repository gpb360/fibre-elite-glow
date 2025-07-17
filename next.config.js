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
    optimizePackageImports: [
      '@radix-ui/react-icons', 
      'lucide-react',
      '@radix-ui/react-accordion',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-aspect-ratio',
      '@radix-ui/react-avatar',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-collapsible',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-hover-card',
      '@radix-ui/react-label',
      '@radix-ui/react-menubar',
      '@radix-ui/react-navigation-menu',
      '@radix-ui/react-popover',
      '@radix-ui/react-progress',
      '@radix-ui/react-radio-group',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-select',
      '@radix-ui/react-separator',
      '@radix-ui/react-sheet',
      '@radix-ui/react-slider',
      '@radix-ui/react-switch',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toast',
      '@radix-ui/react-toggle',
      '@radix-ui/react-toggle-group',
      '@radix-ui/react-tooltip',
      'framer-motion'
    ]
  },
  images: {
    domains: ['venomappdevelopment.com'],
    formats: ['image/webp', 'image/avif']
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
  poweredByHeader: false,
  reactStrictMode: true,
  // Improve CSS debugging in development and bundle optimization
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

    // Production optimizations
    if (!dev && !isServer) {
      // Note: framer-motion alias removed due to module export issues

      // Improve tree shaking
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;

      // Enhanced code splitting
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
          },
          radix: {
            test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
            name: 'radix',
            chunks: 'all',
            priority: 20,
            reuseExistingChunk: true,
          },
          framer: {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: 'framer-motion',
            chunks: 'all',
            priority: 20,
            reuseExistingChunk: true,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      };
    }

    return config
  }
}

module.exports = nextConfig
