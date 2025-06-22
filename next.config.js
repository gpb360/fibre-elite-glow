/** @type {import('next').NextConfig} */
const nextConfig = {
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
