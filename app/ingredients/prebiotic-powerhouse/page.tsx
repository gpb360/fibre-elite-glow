import PrebioticPowerhouse from '@/components/pages/ingredients/PrebioticPowerhouse'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Prebiotic Oligosaccharides - Gut Microbiome Support',
  description: 'Explore how prebiotic oligosaccharides feed beneficial gut bacteria and support a healthy microbiome. Essential for immune function, nutrient absorption, and long-term digestive wellness.',
  keywords: 'prebiotics, oligosaccharides, gut microbiome, beneficial bacteria, immune support, digestive wellness, prebiotic fiber',
  url: '/ingredients/prebiotic-powerhouse',
})

export default function PrebioticPowerhousePage() {
  return <PrebioticPowerhouse />
}
