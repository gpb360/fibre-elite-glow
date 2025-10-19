import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Acai Berry - Antioxidant Powerhouse - La Belle Vie',
  description: 'Experience the exceptional antioxidant benefits of freeze-dried Acai Berry. Rich in anthocyanins and polyphenols, this superfood supports cellular regeneration, enhances energy metabolism, and provides superior protection against oxidative stress for overall wellness.',
  keywords: 'acai berry, antioxidant, superfood, cellular health, energy boost, skin health, acai benefits, natural antioxidant, premium acai, dietary supplement',
  openGraph: {
    title: 'Acai Berry - Premium Antioxidant Superfood for Health & Vitality',
    description: 'A potent superfood packed with antioxidants to support cellular health, boost energy, and promote radiant skin. Our premium Acai Berry is sustainably sourced and carefully processed to preserve maximum nutritional benefits.',
    images: [
      {
        url: '/lovable-uploads/acai-closeup.jpg',
        width: 1200,
        height: 630,
        alt: 'Acai Berry - Premium antioxidant superfood for health and wellness',
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Acai Berry - Antioxidant-Rich Superfood for Optimal Wellness',
    description: 'A powerful superfood that supports cellular health, boosts energy, and promotes vibrant skin. Our premium Acai Berry is freeze-dried to preserve maximum nutritional benefits.',
    images: ['/lovable-uploads/acai-closeup.jpg'],
  }
}