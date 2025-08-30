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
      '@radix-ui/react-avatar',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-collapsible',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-label',
      '@radix-ui/react-popover',
      '@radix-ui/react-progress',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-select',
      '@radix-ui/react-separator',
      '@radix-ui/react-slot',
      '@radix-ui/react-switch',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toast',
      '@radix-ui/react-toggle',
      '@radix-ui/react-tooltip',
      'framer-motion',
      'zod',
      'react-hook-form'
    ],
    optimizeCss: true,
    webpackBuildWorker: true,
    esmExternals: 'loose',
    serverComponentsExternalPackages: ['sharp', 'onnxruntime-node'],
    turbotrace: {
      logLevel: 'error'
    }
  },
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
  swcMinify: true,
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  generateEtags: true,
  
  // Connection optimization
  httpAgentOptions: {
    keepAlive: true,
    maxSockets: 100,
    maxFreeSockets: 10,
    timeout: 60000,
    freeSocketTimeout: 30000
  },
  eslint: {
    ignoreDuringBuilds: true, // Temporarily disable for optimization work
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Combined webpack config with CSS debugging and bundle optimization
  webpack: (config, { dev, isServer }) => {
    // Add polyfill for self in server-side rendering
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'self': false,
      };
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

    // Production optimizations
    if (!dev && !isServer) {
      // Improve tree shaking
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
      
      // Enhanced minification for text compression
      config.optimization.minimize = true;
      if (config.optimization.minimizer) {
        config.optimization.minimizer.forEach(minimizer => {
          if (minimizer.constructor.name === 'TerserPlugin') {
            minimizer.options.terserOptions = {
              ...minimizer.options.terserOptions,
              compress: {
                ...minimizer.options.terserOptions?.compress,
                drop_console: true,
                drop_debugger: true,
                pure_funcs: ['console.log', 'console.info'],
              },
              mangle: true,
              format: {
                comments: false,
              },
            };
          }
        });
      }

      // Enhanced code splitting
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        enforceSizeThreshold: 50000,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true
          },
          radix: {
            test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
            name: 'radix',
            chunks: 'all',
            priority: 20,
            reuseExistingChunk: true,
            enforce: true
          },
          framer: {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: 'framer-motion',
            chunks: 'all',
            priority: 20,
            reuseExistingChunk: true,
            enforce: true
          },
          zod: {
            test: /[\\/]node_modules[\\/]zod[\\/]/,
            name: 'zod',
            chunks: 'all',
            priority: 15,
            reuseExistingChunk: true
          },
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            chunks: 'all',
            priority: 30,
            reuseExistingChunk: true,
            enforce: true
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
            reuseExistingChunk: true,
            enforce: false
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
        },
      };
      
      // Add module concatenation for better tree shaking
      config.optimization.concatenateModules = true;
      
      // Improve runtime chunk generation
      config.optimization.runtimeChunk = {
        name: entrypoint => `runtime-${entrypoint.name}`
      };
    }

    return config;
  }
}

module.exports = nextConfig
