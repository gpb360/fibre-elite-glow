import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Organic Broccoli Extract | Natural Detoxification | Fibre Elite Glow',
  description: 'Discover the benefits of Organic Broccoli Extract, rich in sulforaphane and fiber that supports natural detoxification pathways and provides essential nutrients for digestive and overall health.',
  keywords: 'organic broccoli extract, sulforaphane, detoxification, digestive health, antioxidants, anti-inflammatory, fiber, natural supplements, gut health, cellular health, immune support, broccoli sprouts',
  openGraph: {
    title: 'Organic Broccoli Extract | Natural Detoxification Support',
    description: 'Rich in sulforaphane and fiber, our broccoli extract supports detoxification pathways and provides essential nutrients for digestive and overall health.',
    images: [
      {
        url: '/lovable-uploads/broccoli-extract-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Organic Broccoli Extract',
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Organic Broccoli Extract | Natural Detoxification Support',
    description: 'Rich in sulforaphane and fiber, our broccoli extract supports detoxification pathways and provides essential nutrients for digestive and overall health.',
    images: ['/lovable-uploads/broccoli-extract-hero.jpg'],
  }
}
