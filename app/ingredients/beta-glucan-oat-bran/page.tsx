import BetaGlucanOatBran from '@/components/pages/ingredients/BetaGlucanOatBran'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Beta-Glucan Oat Bran - Heart-Healthy Fiber',
  description: 'Explore the benefits of beta-glucan oat bran in our fiber supplements. Clinically proven to lower cholesterol, support heart health, and improve digestive regularity naturally.',
  keywords: 'beta glucan, oat bran, heart health, cholesterol, soluble fiber, digestive health, prebiotic fiber',
  url: '/ingredients/beta-glucan-oat-bran',
})

export default function BetaGlucanOatBranPage() {
  return <BetaGlucanOatBran />
}
