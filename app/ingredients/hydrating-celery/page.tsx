import HydratingCelery from '@/components/pages/ingredients/HydratingCelery'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Hydrating Celery - Natural Electrolyte Support',
  description: 'Learn how celery provides natural hydration, electrolyte balance, and anti-inflammatory support. Rich in vitamins K and C, celery extract promotes kidney health and reduces bloating.',
  keywords: 'celery extract, hydration, electrolytes, anti-inflammatory, vitamin K, bloating relief, kidney health, natural supplement',
  url: '/ingredients/hydrating-celery',
})

export default function HydratingCeleryPage() {
  return <HydratingCelery />
}
