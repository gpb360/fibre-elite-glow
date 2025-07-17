import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Providers } from './providers'
import { CartProvider } from '@/contexts/CartContext'
import { ClientBodyWrapper } from './components/ClientBodyWrapper'
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

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
        <GoogleAnalytics />
        {/* Preload critical hero images */}
        <link rel="preload" href="/lovable-uploads/webp/fruit-veg-bottle.webp" as="image" type="image/webp" />
        <link rel="preload" href="/lovable-uploads/webp/27ca3fa0-24aa-479b-b075-3f11006467c5.webp" as="image" type="image/webp" />
        <link rel="preload" href="/lovable-uploads/webp/5f8f72e3-397f-47a4-8bce-f15924c32a34.webp" as="image" type="image/webp" />
        {/* Fonts are handled by Next.js font optimization */}
      </head>
      <body suppressHydrationWarning>
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
