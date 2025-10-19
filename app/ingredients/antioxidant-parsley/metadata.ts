import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Antioxidant Parsley - Detox & Cellular Protection - La Belle Vie',
  description: 'Harness the natural detoxification power of antioxidant-rich parsley. This concentrated extract provides myricetin and apigenin flavonoids that enhance kidney function, neutralize environmental toxins, and protect cellular membranes from oxidative damage for optimal organ health.',
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