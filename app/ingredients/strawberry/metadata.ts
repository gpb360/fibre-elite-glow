import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Strawberry - Vitamin C & Antioxidant Boost - La Belle Vie',
  description: 'Explore the delicious and nutritious benefits of Strawberry, a fruit rich in Vitamin C, antioxidants, and fiber that supports immune health, skin vitality, and overall wellness. Our premium strawberry powder provides natural immune support and antioxidant protection.',
  keywords: 'strawberry, vitamin c, antioxidant, immune support, skin health, strawberry benefits, natural vitamin c, premium strawberry, dietary supplement, fruit fiber',
  openGraph: {
    title: 'Strawberry - Premium Vitamin C & Antioxidant Support for Health',
    description: 'Packed with Vitamin C and antioxidants, our premium Strawberry powder supports immune function, promotes radiant skin, and offers a delicious way to stay healthy and boost your natural defenses.',
    images: [
      {
        url: '/lovable-uploads/webp/digestive-health-benefits-fiber-supplement.webp',
        width: 1200,
        height: 630,
        alt: 'Strawberry - Vitamin C rich fruit for immune health and antioxidant protection',
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Strawberry - Delicious Vitamin C Boost for Immune System',
    description: 'Rich in Vitamin C and antioxidants, our premium Strawberry powder is a tasty and effective way to support your immune system and promote vibrant skin naturally.',
    images: ['/lovable-uploads/webp/digestive-health-benefits-fiber-supplement.webp'],
  }
}