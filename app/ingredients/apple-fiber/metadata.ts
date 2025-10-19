import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Premium Apple Fiber - Digestive & Heart Health - La Belle Vie',
  description: 'Support your digestive system and cardiovascular health with our premium apple fiber. This natural source of soluble and insoluble fiber contains pectin that promotes regular bowel movements, feeds beneficial gut bacteria, and helps maintain healthy cholesterol levels for optimal wellness.',
  keywords: 'premium apple fiber, soluble fiber, insoluble fiber, digestive health, heart health, cholesterol management, natural fiber supplement, gut health, weight management, digestive regularity, apple pectin',
  openGraph: {
    title: 'Premium Apple Fiber | Natural Digestive & Heart Health Support',
    description: 'A gentle yet effective source of both soluble and insoluble fiber that supports digestive regularity and helps maintain healthy cholesterol levels.',
    images: [
      {
        url: '/lovable-uploads/apple-fiber.jpg',
        width: 1200,
        height: 630,
        alt: 'Premium Apple Fiber',
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Premium Apple Fiber | Natural Digestive & Heart Health Support',
    description: 'A gentle yet effective source of both soluble and insoluble fiber that supports digestive regularity and helps maintain healthy cholesterol levels.',
    images: ['/lovable-uploads/apple-fiber.jpg'],
  }
}
