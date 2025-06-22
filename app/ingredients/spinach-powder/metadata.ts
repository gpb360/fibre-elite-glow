import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fresh Spinach Powder | Nutrient-Rich Digestive Support | Fibre Elite Glow',
  description: 'Discover the benefits of Fresh Spinach Powder, packed with essential vitamins, minerals, and fiber to support digestive health while providing comprehensive nutritional benefits for overall wellness.',
  keywords: 'fresh spinach powder, digestive health, gut health, fiber supplement, nutrient-dense, vitamins, minerals, prebiotic, anti-inflammatory, natural supplement, green superfood, alkalizing',
  openGraph: {
    title: 'Fresh Spinach Powder | Natural Digestive & Nutritional Support',
    description: 'Packed with essential vitamins, minerals, and fiber to support digestive health and overall wellness in a convenient, concentrated form.',
    images: [
      {
        url: '/lovable-uploads/spinach-powder.jpg',
        width: 1200,
        height: 630,
        alt: 'Fresh Spinach Powder',
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fresh Spinach Powder | Natural Digestive & Nutritional Support',
    description: 'Packed with essential vitamins, minerals, and fiber to support digestive health and overall wellness.',
    images: ['/lovable-uploads/spinach-powder.jpg'],
  }
}
