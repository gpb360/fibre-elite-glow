'use client'

import { memo } from 'react'

// Critical CSS for above-the-fold content to improve FCP and LCP
const CriticalCSS = memo(() => (
  <style jsx>{`
    /* Critical styles for header and hero section */
    .header-critical {
      position: sticky;
      top: 0;
      z-index: 50;
      width: 100%;
      border-bottom: 1px solid #e5e7eb;
      background-color: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
    }
    
    .hero-critical {
      min-height: 100vh;
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .hero-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    
    .hero-title {
      font-size: clamp(2rem, 5vw, 4rem);
      font-weight: 700;
      line-height: 1.1;
      color: #1f2937;
      margin-bottom: 1.5rem;
    }
    
    .hero-subtitle {
      font-size: clamp(1.125rem, 2.5vw, 1.5rem);
      color: #6b7280;
      margin-bottom: 2rem;
      line-height: 1.6;
    }
    
    .cta-button {
      display: inline-flex;
      align-items: center;
      padding: 0.875rem 2rem;
      font-size: 1.125rem;
      font-weight: 600;
      color: white;
      background-color: #059669;
      border-radius: 0.5rem;
      text-decoration: none;
      transition: background-color 0.2s ease;
    }
    
    .cta-button:hover {
      background-color: #047857;
    }
    
    /* Loading states to prevent CLS */
    .skeleton {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
    }
    
    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    
    /* Preload critical images */
    .hero-image {
      width: 100%;
      height: auto;
      object-fit: cover;
      border-radius: 0.75rem;
    }
    
    /* Font display optimization */
    @font-face {
      font-family: 'Inter var';
      font-style: normal;
      font-weight: 100 900;
      font-display: swap;
      src: url('/_next/static/fonts/inter-var.woff2') format('woff2');
    }
    
    /* Reduce layout shift for navigation */
    .nav-item {
      display: inline-block;
      min-width: 80px;
      text-align: center;
    }
    
    /* Optimize for mobile-first */
    @media (max-width: 768px) {
      .hero-critical {
        min-height: 80vh;
      }
      
      .hero-content {
        padding: 0 1rem;
        text-align: center;
      }
    }
  `}</style>
))

CriticalCSS.displayName = 'CriticalCSS'

export default CriticalCSS