import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Prebiotic Powerhouse | Oligosaccharides for Gut Flora | La Belle Vie',
  description: 'Nourish your gut’s ecosystem with our Prebiotic Oligosaccharides. These specialized fibers feed your beneficial bacteria, promoting a balanced microbiome and superior digestive health.',
  keywords: 'prebiotic oligosaccharides, gut flora, microbiome support, feed good bacteria, digestive wellness, natural prebiotics, gut ecosystem, short-chain fatty acids, digestive balance',
  openGraph: {
    title: 'Prebiotic Powerhouse | Fuel Your Good Bacteria',
    description: 'Feed your beneficial gut bacteria and cultivate a thriving digestive ecosystem with our premium prebiotic oligosaccharides.',
    images: [
      {
        url: '/lovable-uploads/prebiotics.jpg',
        width: 1200,
        height: 630,
        alt: 'Prebiotic Powerhouse',
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prebiotic Powerhouse | Fuel Your Good Bacteria',
    description: 'Feed your beneficial gut bacteria and cultivate a thriving digestive ecosystem with our premium prebiotic oligosaccharides.',
    images: ['/lovable-uploads/prebiotics.jpg'],
  }
}
