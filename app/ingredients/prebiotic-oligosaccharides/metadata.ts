import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Prebiotic Oligosaccharides | Natural Gut Health | Fibre Elite Glow',
  description: 'Discover the science behind prebiotic oligosaccharides, specialized plant fibers that nourish beneficial gut bacteria and support digestive health naturally without introducing foreign bacteria.',
  keywords: 'prebiotic oligosaccharides, gut health, beneficial bacteria, digestive health, natural prebiotics, microbiome support, dietary fiber, gut flora, short-chain fatty acids, natural fiber supplements',
  openGraph: {
    title: 'Prebiotic Oligosaccharides | Natural Gut Health Support',
    description: 'Specialized plant fibers that feed beneficial bacteria already living in your gut, supporting a naturally healthy digestive ecosystem.',
    images: [
      {
        url: '/lovable-uploads/prebiotics.jpg',
        width: 1200,
        height: 630,
        alt: 'Prebiotic Oligosaccharides',
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prebiotic Oligosaccharides | Natural Gut Health Support',
    description: 'Specialized plant fibers that feed beneficial bacteria already living in your gut, supporting a naturally healthy digestive ecosystem.',
    images: ['/lovable-uploads/prebiotics.jpg'],
  }
}
