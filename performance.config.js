/**
 * Performance optimization configuration for Fibre Elite Glow
 * This file contains configurations for improving Core Web Vitals
 */

// Critical request chains optimization
const criticalResourcePaths = [
  '/_next/static/css/',
  '/_next/static/chunks/main',
  '/_next/static/chunks/webpack',
  '/_next/static/chunks/framework'
];

// Bundle size limits (in KB)
const bundleSizeLimits = {
  maxChunkSize: 244, // 244KB max per chunk
  maxAssetSize: 500, // 500KB max per asset
  maxEntrypointSize: 244 // 244KB max per entrypoint
};

// Image optimization settings
const imageOptimization = {
  formats: ['image/webp', 'image/avif'],
  quality: 80,
  sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority: true, // For LCP images
  placeholder: 'blur'
};

// Font optimization
const fontOptimization = {
  preload: [
    'inter-var.woff2'
  ],
  display: 'swap',
  fallback: 'system-ui, -apple-system, sans-serif'
};

// Lazy loading configuration
const lazyLoadConfig = {
  threshold: 0.1,
  rootMargin: '50px',
  enabled: true
};

// Performance monitoring thresholds
const performanceThresholds = {
  fcp: 1800, // First Contentful Paint
  lcp: 2500, // Largest Contentful Paint
  fid: 100,  // First Input Delay
  cls: 0.1,  // Cumulative Layout Shift
  ttfb: 600  // Time to First Byte
};

module.exports = {
  criticalResourcePaths,
  bundleSizeLimits,
  imageOptimization,
  fontOptimization,
  lazyLoadConfig,
  performanceThresholds
};