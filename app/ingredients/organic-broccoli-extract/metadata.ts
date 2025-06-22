import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Organic Broccoli Extract | Sulforaphane Benefits | Fibre Elite Glow',
  description: 'Discover the power of Organic Broccoli Extract, rich in sulforaphane and fiber, supporting detoxification pathways and providing essential nutrients for digestive and overall health.',
  keywords: 'organic broccoli extract, sulforaphane, detoxification, digestive health, antioxidant, anti-inflammatory, gut health, natural supplements, broccoli benefits, cruciferous vegetables',
  openGraph: {
    title: 'Organic Broccoli Extract | Natural Detoxification Support',
    description: 'Rich in sulforaphane and fiber, our organic broccoli extract supports detoxification pathways and provides essential nutrients for digestive and overall health.',
    images: [
      {
        url: '/lovable-uploads/broccoli-extract.jpg',
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
    description: 'Rich in sulforaphane and fiber, our organic broccoli extract supports detoxification pathways and provides essential nutrients for digestive health.',
    images: ['/lovable-uploads/broccoli-extract.jpg'],
  }
}
