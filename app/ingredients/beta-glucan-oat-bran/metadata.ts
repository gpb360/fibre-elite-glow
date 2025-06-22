import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Beta-Glucan Oat Bran | Heart Health | Fibre Elite Glow',
  description: 'Discover the benefits of Beta-Glucan Oat Bran, a powerful soluble fiber clinically proven to lower cholesterol, regulate blood sugar, and promote heart health with FDA-approved health claims.',
  keywords: 'beta-glucan oat bran, cholesterol reduction, heart health, blood sugar regulation, soluble fiber, oat fiber, FDA approved claims, digestive health, cardiovascular health, natural supplements',
  openGraph: {
    title: 'Beta-Glucan Oat Bran | Heart Health & Cholesterol Support',
    description: 'A powerful soluble fiber that helps lower cholesterol levels, regulate blood sugar, and promote heart health. Our premium oat bran is carefully processed to preserve maximum nutritional benefits.',
    images: [
      {
        url: '/lovable-uploads/oat-bran-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Beta-Glucan Oat Bran',
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Beta-Glucan Oat Bran | Heart Health & Cholesterol Support',
    description: 'A powerful soluble fiber that helps lower cholesterol levels, regulate blood sugar, and promote heart health. Our premium oat bran is carefully processed to preserve maximum nutritional benefits.',
    images: ['/lovable-uploads/oat-bran-hero.jpg'],
  }
}
