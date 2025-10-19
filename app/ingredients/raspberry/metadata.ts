import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Raspberry | Fiber & Antioxidant-Rich | La Belle Vie',
  description: 'Discover the vibrant health benefits of Raspberry, a delicious fruit packed with fiber, vitamins, and antioxidants to support digestive health, weight management, and more.',
  keywords: 'raspberry, raspberry ketones, dietary fiber, antioxidant, weight management, raspberry benefits, natural fiber, premium raspberry, dietary supplement, ellagic acid',
  openGraph: {
    title: 'Raspberry | A Delicious Boost for Digestive Health & Wellness',
    description: 'Rich in fiber and antioxidants, our premium Raspberry powder supports digestive health, aids in weight management, and provides a wealth of essential nutrients.',
    images: [
      {
        url: '/lovable-uploads/raspberry.jpg',
        width: 1200,
        height: 630,
        alt: 'Raspberry',
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Raspberry | The Tasty Way to Support Your Digestive System',
    description: 'Our premium Raspberry powder is a delicious and effective way to boost your fiber intake, support digestive health, and protect your body with powerful antioxidants.',
    images: ['/lovable-uploads/raspberry-hero.jpg'],
  }
}