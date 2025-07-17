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
        <CriticalCSS />
        <link rel="preload" href="/_next/static/css/app/layout.css" as="style" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://api.stripe.com" />
        <link rel="dns-prefetch" href="https://js.stripe.com" />
        <GoogleAnalytics />
        {/* Preload critical hero images */}
        <link rel="preload" href="/lovable-uploads/webp/fruit-veg-bottle.webp" as="image" type="image/webp" />
        <link rel="preload" href="/lovable-uploads/webp/27ca3fa0-24aa-479b-b075-3f11006467c5.webp" as="image" type="image/webp" />
        <link rel="preload" href="/lovable-uploads/webp/5f8f72e3-397f-47a4-8bce-f15924c32a34.webp" as="image" type="image/webp" />
      </head>
      <body suppressHydrationWarning className={inter.variable}>
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
