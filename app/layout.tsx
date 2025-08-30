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
import { ErrorBoundary } from '@/components/error'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'Fibre Elite Glow - Premium Gut Health Supplements',
  description: 'Transform your gut health with our premium fiber supplements. Experience better digestion, increased energy, and overall wellness.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <CriticalCSS />
        {/* Keep only essential preloads */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Only preload the hero image - LCP candidate */}
        <link rel="preload" href="/lovable-uploads/webp/27ca3fa0-24aa-479b-b075-3f11006467c5.webp" as="image" type="image/webp" fetchPriority="high" />
        
        {/* DNS prefetch only for critical domains */}
        <link rel="dns-prefetch" href="https://api.stripe.com" />
        <link rel="dns-prefetch" href="https://js.stripe.com" />
        
        <GoogleAnalytics />
      </head>
      <body suppressHydrationWarning className={inter.variable}>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <PerformanceOptimizer />
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
