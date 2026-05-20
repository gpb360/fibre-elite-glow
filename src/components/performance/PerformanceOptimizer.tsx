'use client'

import { useEffect } from 'react'
import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals'

interface PerformanceOptimizer {
  enableReporting?: boolean
  enablePrefetch?: boolean
}

export default function PerformanceOptimizer({
  enableReporting = process.env.NODE_ENV === 'production',
  enablePrefetch = true
}: PerformanceOptimizer) {

  useEffect(() => {
    // Enable performance optimizations only on client side
    if (typeof window === 'undefined') return;

    // Measure and report Core Web Vitals
    if (enableReporting) {
      const sendToAnalytics = (metric: any) => {
        // Only log in development for debugging
        if (process.env.NODE_ENV === 'development') {
          console.log(`[Performance] ${metric.name}:`, metric.value, metric)
        }

        // In production, send to analytics service
        if (process.env.NODE_ENV === 'production' && gtag) {
          gtag('event', metric.name, {
            value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
            event_category: 'Web Vitals',
            event_label: metric.id,
            non_interaction: true,
          })
        }
      }

      onCLS(sendToAnalytics)
      onFCP(sendToAnalytics)
      onINP(sendToAnalytics)
      onLCP(sendToAnalytics)
      onTTFB(sendToAnalytics)
    }

    // Aggressive resource prefetching for critical routes
    if (enablePrefetch) {
      const criticalRoutes = ['/products', '/cart', '/account', '/products/total-essential']

      // Use requestIdleCallback for non-critical prefetching
      const schedulePrefetch = () => {
        criticalRoutes.forEach(route => {
          const link = document.createElement('link')
          link.rel = 'prefetch'
          link.href = route
          document.head.appendChild(link)
        })
      }

      if ('requestIdleCallback' in window) {
        requestIdleCallback(schedulePrefetch, { timeout: 2000 })
      } else {
        setTimeout(schedulePrefetch, 1000)
      }

      // Product image preloading removed — Next.js Image with priority={true}
      // handles preloading for above-fold images automatically
    }

    // Enhanced lazy loading with intersection observer
    const setupLazyLoading = () => {
      // Images with data-src attribute
      const images = document.querySelectorAll('img[data-src]')

      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement
              const src = img.dataset.src

              if (src) {
                img.src = src
                img.classList.remove('lazy')
                img.removeAttribute('data-src')
                imageObserver.unobserve(img)
              }
            }
          })
        }, {
          rootMargin: '50px 0px',
          threshold: 0.01
        })

        images.forEach(img => imageObserver.observe(img))

        // Also observe iframes for better performance
        const iframes = document.querySelectorAll('iframe[data-src]')
        iframes.forEach(iframe => imageObserver.observe(iframe))
      }
    }

    setupLazyLoading()

    // Optimize JavaScript execution with better scheduling
    const optimizeJavaScript = () => {
      // Defer non-critical JavaScript
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          // Load non-critical scripts
          const scripts = document.querySelectorAll('script[data-defer]')
          scripts.forEach(script => {
            const src = script.getAttribute('data-src')
            if (src) {
              const newScript = document.createElement('script')
              newScript.src = src
              newScript.async = true
              document.head.appendChild(newScript)
            }
          })
        }, { timeout: 3000 })
      }

      // Remove console.log in production for smaller bundle
      if (process.env.NODE_ENV === 'production') {
        // This will be handled by webpack configuration
        console.log = () => {}
        console.info = () => {}
        console.debug = () => {}
      }
    }

    optimizeJavaScript()

    // Enable service worker for production caching
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js')
          console.log('ServiceWorker registration successful with scope: ', registration.scope)
        } catch (error) {
          console.log('ServiceWorker registration failed: ', error)
        }
      }
    }

    registerServiceWorker()

    // Font loading is handled by next/font — no manual preloading needed

    // Monitor and optimize layout shifts
    const optimizeLayoutShifts = () => {
      // Add dimension attributes to images that don't have them
      const imagesWithoutDimensions = document.querySelectorAll('img:not([width]):not([height])')
      imagesWithoutDimensions.forEach(img => {
        // Add placeholder dimensions to prevent layout shift
        img.setAttribute('width', '300')
        img.setAttribute('height', '200')
        img.style.aspectRatio = '3/2'
      })
    }

    // Run after DOM is loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', optimizeLayoutShifts)
    } else {
      optimizeLayoutShifts()
    }

    // Critical CSS is inlined by CriticalCSS component — no external preload needed

  }, [enableReporting, enablePrefetch])

  return null
}