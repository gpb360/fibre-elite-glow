import Raspberry from '@/components/pages/ingredients/Raspberry'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Raspberry - Antioxidant-Rich Superfruit',
  description: 'Discover the antioxidant power of raspberry in our fiber supplements. Packed with ellagic acid, vitamin C, and fiber, raspberries support cellular protection, immunity, and metabolic health.',
  keywords: 'raspberry, ellagic acid, antioxidant, vitamin C, superfruit, metabolic health, cellular protection, fiber supplement',
  url: '/ingredients/raspberry',
})

export default function RaspberryPage() {
  return <Raspberry />
}
