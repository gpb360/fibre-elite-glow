import Benefits from '@/components/pages/Benefits'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fiber Supplement Benefits | Better Digestion & Wellness',
  description: 'Discover the scientifically-proven health benefits of premium fiber supplements. Improve digestive health, boost immunity, support weight management, and enhance overall wellness.',
  keywords: 'fiber benefits, digestive health, gut health, immunity, weight management, cholesterol, blood sugar, fiber supplements, wellness benefits',
  openGraph: {
    title: 'Health Benefits of Fiber Supplements | Digestive Wellness',
    description: 'Discover the scientifically-proven health benefits of premium fiber supplements for optimal digestive health and overall wellness.',
    type: 'website',
    images: [
      {
        url: '/assets/benefits-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Health Benefits of Fiber Supplements'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Health Benefits of Fiber Supplements | Digestive Wellness',
    description: 'Discover the scientifically-proven health benefits of premium fiber supplements.',
    images: ['/assets/benefits-hero.jpg']
  }
}

export default function BenefitsPage() {
  return <Benefits />
}
