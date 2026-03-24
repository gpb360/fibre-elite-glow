import FreshSpinachPowder from '@/components/pages/ingredients/FreshSpinachPowder'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Fresh Spinach Powder - Iron & Nutrient Rich',
  description: 'Discover the nutritional power of fresh spinach powder. Loaded with iron, folate, vitamins A and K, spinach supports energy production, immune function, and cellular health.',
  keywords: 'spinach powder, iron, folate, vitamin K, vitamin A, energy, immune support, natural supplement ingredient',
  url: '/ingredients/fresh-spinach-powder',
})

export default function FreshSpinachPowderPage() {
  return <FreshSpinachPowder />
}
