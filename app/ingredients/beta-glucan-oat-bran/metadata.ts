import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Beta-Glucan Oat Bran - Cholesterol & Heart Health - La Belle Vie',
  description: 'Support cardiovascular wellness with scientifically-backed beta-glucan oat bran. This premium soluble fiber forms a gel in the digestive tract that binds to cholesterol, removing it from the body while regulating blood glucose levels and providing sustained energy for optimal heart function.',
  keywords: 'beta-glucan oat bran, soluble fiber, lower cholesterol, heart health, blood sugar regulation, oat fiber benefits, natural cholesterol reduction, cardiovascular health, dietary fiber, premium oat bran',
  openGraph: {
    title: 'Beta-Glucan Oat Bran | Natural Cholesterol & Heart Health Support',
    description: 'A powerful soluble fiber that helps lower cholesterol levels, regulate blood sugar, and promote heart health with scientifically proven benefits.',
    images: [
      {
        url: '/lovable-uploads/oat-bran.jpg',
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
