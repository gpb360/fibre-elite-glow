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
    if (enableReporting) {
      // Report Core Web Vitals
      onCLS(console.log)
      onFCP(console.log)
      onINP(console.log)
      onLCP(console.log)
      onTTFB(console.log)
    }

    if (enablePrefetch) {
      // Prefetch critical routes
      const criticalRoutes = ['/products', '/cart', '/account']
      
      criticalRoutes.forEach(route => {
        const link = document.createElement('link')
        link.rel = 'prefetch'
        link.href = route
        document.head.appendChild(link)
      })
      
      // Preload critical WebP images
      const criticalImages = [
        '/lovable-uploads/webp/27ca3fa0-24aa-479b-b075-3f11006467c5.webp',
        '/lovable-uploads/webp/5f8f72e3-397f-47a4-8bce-f15924c32a34.webp'
      ]
      
      criticalImages.forEach(src => {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.href = src
        link.as = 'image'
        link.type = 'image/webp'
        document.head.appendChild(link)
      })
    }

    // Optimize images by adding intersection observer for lazy loading
    const images = document.querySelectorAll('img[data-src]')
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            img.src = img.dataset.src || ''
            img.classList.remove('lazy')
            imageObserver.unobserve(img)
          }
        })
      })

      images.forEach(img => imageObserver.observe(img))
    }

    // Preload critical fonts
    const fontLink = document.createElement('link')
    fontLink.rel = 'preload'
    fontLink.href = '/_next/static/fonts/inter-var.woff2'
    fontLink.as = 'font'
    fontLink.type = 'font/woff2'
    fontLink.crossOrigin = 'anonymous'
    document.head.appendChild(fontLink)
    
    // Optimize JavaScript execution
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        // Defer non-critical JavaScript
        const scripts = document.querySelectorAll('script[data-defer]')
        scripts.forEach(script => {
          const newScript = document.createElement('script')
          newScript.src = script.getAttribute('data-src') || ''
          document.head.appendChild(newScript)
        })
      })
    }
    
    // Enable service worker for caching
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch(console.error)
    }

  }, [enableReporting, enablePrefetch])

  return null
}