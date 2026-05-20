import Index from '@/components/pages/Index'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'La Belle Vie - Premium Gut Health & Fiber Supplements | Natural Digestive Wellness',
  description: 'Transform your gut health with La Belle Vie premium fiber supplements. Clinically-formulated with 20+ natural ingredients for better digestion, increased energy, and total wellness. Shop Total Essential and Total Essential Plus.',
  keywords: 'fiber supplements, gut health, digestive wellness, Total Essential, natural supplements, prebiotics, La Belle Vie, Canadian health supplements',
  openGraph: {
    title: 'La Belle Vie - Premium Gut Health & Fiber Supplements',
    description: 'Transform your gut health with our premium fiber supplements. Experience better digestion, increased energy, and overall wellness.',
    type: 'website',
    siteName: 'La Belle Vie',
    locale: 'en_CA',
    images: [
      {
        url: '/lovable-uploads/webp/fruit-veg-bottle.webp',
        width: 1200,
        height: 630,
        alt: 'La Belle Vie Premium Fiber Supplements'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'La Belle Vie - Premium Gut Health & Fiber Supplements',
    description: 'Transform your gut health with our premium fiber supplements.',
    images: ['/lovable-uploads/webp/fruit-veg-bottle.webp']
  },
  alternates: {
    canonical: 'https://lbve.ca'
  }
}

export default function HomePage() {
  return <Index />
}
