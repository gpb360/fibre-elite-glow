import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nutrient-Rich Carrot - Beta-Carotene for Vision & Skin - La Belle Vie',
  description: 'Support vision health and skin radiance with beta-carotene-rich carrot extract. This concentrated formula provides provitamin A that converts to retinol for optimal eye function, while dietary fiber promotes digestive regularity and antioxidants protect cellular membranes for vibrant skin and enhanced visual acuity.',
  keywords: 'nutrient-rich carrot, beta-carotene, vitamin a, vision support, skin health, digestive wellness, antioxidant, natural supplements, carrot benefits, root vegetables',
  openGraph: {
    title: 'Nutrient-Rich Carrot | Support for Vision, Skin & Digestion',
    description: 'Packed with beta-carotene and fiber, our nutrient-rich carrot extract supports vibrant vision, radiant skin, and optimal digestive health.',
    images: [
      {
        url: '/lovable-uploads/carrot-extract.jpg',
        width: 1200,
        height: 630,
        alt: 'Nutrient-Rich Carrot',
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nutrient-Rich Carrot | Support for Vision, Skin & Digestion',
    description: 'Packed with beta-carotene and fiber, our nutrient-rich carrot extract supports vibrant vision, radiant skin, and optimal digestive health.',
    images: ['/lovable-uploads/carrot-extract.jpg'],
  }
}