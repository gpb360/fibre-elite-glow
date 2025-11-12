import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Providers } from './providers'
import { CartProvider } from '@/contexts/CartContext'
import { ClientBodyWrapper } from './components/ClientBodyWrapper'
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'
import PerformanceOptimizer from '@/components/performance/PerformanceOptimizer'
import CriticalCSS from '@/components/performance/CriticalCSS'
import { generateOrganizationSchema } from '@/lib/seo'
import StructuredData from '@/components/seo/StructuredData'
import './globals.css'

// Optimized font loading with display: swap and proper subsets
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
  // Optimize font loading for performance
  adjustFontFallbacks: true,
  fallback: ['system-ui', 'arial', 'sans-serif']
})

export const metadata: Metadata = {
  metadataBase: new URL('https://lbve.ca'),
  title: 'La Belle Vie - Premium Gut Health Supplements',
  description: 'Transform your gut health with our premium fiber supplements. Experience better digestion, increased energy, and overall wellness.',
  openGraph: {
    title: 'La Belle Vie - Premium Gut Health Supplements',
    description: 'Transform your gut health with our premium fiber supplements. Experience better digestion, increased energy, and overall wellness.',
    type: 'website',
    siteName: 'La Belle Vie',
    locale: 'en_CA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'La Belle Vie - Premium Gut Health Supplements',
    description: 'Transform your gut health with our premium fiber supplements.',
  },
  // Performance optimizations
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

// Generate organization schema for global use
const organizationSchema = generateOrganizationSchema('La Belle Vie')

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Critical viewport meta tag */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />

        {/* Performance critical CSS */}
        <CriticalCSS />

        {/* Resource hints to reduce critical request chains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://api.stripe.com" crossOrigin="" />
        <link rel="preconnect" href="https://checkout.stripe.com" crossOrigin="" />
        <link rel="preconnect" href="https://supabase.co" crossOrigin="" />
        <link rel="dns-prefetch" href="https://resend.com" />

        {/* Preload critical resources */}
        <link rel="preload" href="/_next/static/chunks/main-app.js" as="script" />
        <link rel="preload" href="/_next/static/chunks/webpack.js" as="script" />

        {/* Analytics and structured data */}
        <GoogleAnalytics />
        <StructuredData data={organizationSchema} />

        {/* Canonical URL */}
        <link rel="canonical" href={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://lbve.ca'}`} />

        {/* Security and performance headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />

        {/* Theme color for better UX */}
        <meta name="theme-color" content="#9ED458" />
        <meta name="msapplication-TileColor" content="#9ED458" />
      </head>
      <body
        suppressHydrationWarning
        className={inter.variable}
        // Performance optimizations
        style={{
          fontFamily: 'var(--font-inter), system-ui, sans-serif',
        }}
      >
        {/* Skip link for accessibility */}
        <a
          href="#main-content"
          className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-green-500 text-white px-4 py-2 rounded-md z-50"
        >
          Skip to main content
        </a>

        {/* Performance optimizer with minimal reporting */}
        <PerformanceOptimizer enableReporting={false} enablePrefetch={true} />

        <ClientBodyWrapper fontClassName={inter.className}>
          <Providers>
            <CartProvider>
              <TooltipProvider>
                {children}
                <Toaster />
                <Sonner />
              </TooltipProvider>
            </CartProvider>
          </Providers>
        </ClientBodyWrapper>
      </body>
    </html>
  )
}