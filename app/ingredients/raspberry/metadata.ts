import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Raspberry - Fiber & Antioxidant-Rich - La Belle Vie',
  description: 'Support digestive wellness and cellular protection with antioxidant-rich raspberry powder. This concentrated formula provides ellagic acid and anthocyanins that neutralize free radicals, while natural dietary fiber promotes satiety and regularity, making it an ideal addition for weight management and overall metabolic health.',
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