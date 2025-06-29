import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Acai Berry | Antioxidant Powerhouse | Fibre Elite Glow',
  description: 'Discover the exceptional health benefits of Acai Berry, a powerful antioxidant that supports cellular health, boosts energy levels, and promotes vibrant skin.',
  keywords: 'acai berry, antioxidant, superfood, cellular health, energy boost, skin health, acai benefits, natural antioxidant, premium acai, dietary supplement',
  openGraph: {
    title: 'Acai Berry | The Ultimate Superfood for Health & Vitality',
    description: 'A potent superfood packed with antioxidants to support cellular health, boost energy, and promote radiant skin. Our premium Acai Berry is sustainably sourced and carefully processed.',
    images: [
      {
        url: '/lovable-uploads/acai-berry.jpg',
        width: 1200,
        height: 630,
        alt: 'Acai Berry',
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Acai Berry | Antioxidant-Rich Superfood for Optimal Wellness',
    description: 'A powerful superfood that supports cellular health, boosts energy, and promotes vibrant skin. Our premium Acai Berry is freeze-dried to preserve maximum nutritional benefits.',
    images: ['/lovable-uploads/acai-berry-hero.jpg'],
  }
}