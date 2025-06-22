import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fresh Spinach Powder | Natural Gut Health | Fibre Elite Glow',
  description: 'Discover the benefits of Fresh Spinach Powder, a nutrient-dense superfood packed with essential vitamins, minerals, and fiber that supports digestive health and overall wellness naturally.',
  keywords: 'fresh spinach powder, gut health, digestive health, natural fiber, spinach nutrients, antioxidants, detoxification, nutrient-dense, vitamins, minerals, dietary fiber, natural supplements',
  openGraph: {
    title: 'Fresh Spinach Powder | Natural Digestive Health Support',
    description: 'Packed with essential vitamins, minerals, and fiber, spinach powder supports digestive health while providing nutritional benefits for overall wellness.',
    images: [
      {
        url: '/lovable-uploads/spinach-powder-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Fresh Spinach Powder',
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fresh Spinach Powder | Natural Digestive Health Support',
    description: 'Packed with essential vitamins, minerals, and fiber, spinach powder supports digestive health while providing nutritional benefits for overall wellness.',
    images: ['/lovable-uploads/spinach-powder-hero.jpg'],
  }
}
