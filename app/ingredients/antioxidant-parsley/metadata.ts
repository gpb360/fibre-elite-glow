import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Antioxidant Parsley | Detox & Cellular Protection | Fibre Elite Glow',
  description: 'Discover the power of Antioxidant Parsley, a vibrant herb packed with flavonoids and vitamins to support detoxification, kidney health, and cellular protection.',
  keywords: 'antioxidant parsley, detoxification, kidney support, cellular protection, flavonoids, myricetin, apigenin, natural diuretic, vitamin k, vitamin c, natural supplements, parsley benefits',
  openGraph: {
    title: 'Antioxidant Parsley | Natural Detox & Cell Protector',
    description: 'A potent source of antioxidants and vitamins to protect your cells, support detoxification, and promote overall vitality.',
    images: [
      {
        url: '/lovable-uploads/parsley-extract.jpg',
        width: 1200,
        height: 630,
        alt: 'Antioxidant Parsley',
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Antioxidant Parsley | Natural Detox & Cell Protector',
    description: 'A potent source of antioxidants and vitamins to protect your cells, support detoxification, and promote overall vitality.',
    images: ['/lovable-uploads/parsley-extract.jpg'],
  }
}