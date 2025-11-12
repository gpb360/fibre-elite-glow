import NutrientRichCarrot from '@/components/pages/ingredients/NutrientRichCarrot'
import { generateMetadata } from '@/lib/seo'

export const metadata = generateMetadata({
  title: 'Nutrient-Rich Carrot | Beta-Carotene & Fiber for Digestive Health',
  description: 'Premium Canadian carrot fiber rich in beta-carotene, Vitamin A, and dietary fiber for eye health, immune support, and digestive wellness.',
  keywords: 'carrot fiber, beta-carotene, vitamin A, eye health, immune support, digestive wellness, natural fiber supplement, Canadian carrots',
  image: '/assets/webp/16x9_a_plump_organic_carrot_with_inte.webp',
  url: '/ingredients/nutrient-rich-carrot'
})

export default function NutrientRichCarrotPage() {
  return <NutrientRichCarrot />
}