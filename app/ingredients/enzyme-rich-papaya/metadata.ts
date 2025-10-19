import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Enzyme-Rich Papaya | Natural Digestive Aid | La Belle Vie',
  description: 'Harness the power of papain from Enzyme-Rich Papaya to support protein digestion, reduce bloating, and enhance nutrient absorption for optimal gut health.',
  keywords: 'enzyme-rich papaya, papain, digestive enzymes, protein digestion, reduce bloating, anti-inflammatory, natural supplements, papaya benefits, gut health, nutrient absorption',
  openGraph: {
    title: 'Enzyme-Rich Papaya | Your Natural Digestive Enzyme Boost',
    description: 'Harness the power of natural digestive enzymes to break down proteins, reduce bloating, and enhance nutrient absorption.',
    images: [
      {
        url: '/lovable-uploads/papaya-extract.jpg',
        width: 1200,
        height: 630,
        alt: 'Enzyme-Rich Papaya',
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Enzyme-Rich Papaya | Your Natural Digestive Enzyme Boost',
    description: 'Harness the power of natural digestive enzymes to break down proteins, reduce bloating, and enhance nutrient absorption.',
    images: ['/lovable-uploads/papaya-extract.jpg'],
  }
}