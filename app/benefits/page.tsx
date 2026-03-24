import Benefits from '@/components/pages/Benefits'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Fiber Supplement Benefits | Better Digestion & Wellness',
  description: 'Discover the scientifically-proven health benefits of premium fiber supplements. Improve digestive health, boost immunity, support weight management, and enhance overall wellness.',
  keywords: 'fiber benefits, digestive health, gut health, immunity, weight management, cholesterol, blood sugar, fiber supplements, wellness benefits',
  image: '/assets/dual-total-essential-and-plus-together.png',
  url: '/benefits',
})

export default function BenefitsPage() {
  return <Benefits />
}
