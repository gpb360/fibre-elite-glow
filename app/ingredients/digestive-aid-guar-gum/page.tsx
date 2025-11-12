import DigestiveAidGuarGum from '@/components/pages/ingredients/DigestiveAidGuarGum'
import { generateMetadata } from '@/lib/seo'

export const metadata = generateMetadata({
  title: 'Digestive-Aid Guar Gum | Natural Soluble Fiber for Gut Health',
  description: 'Premium guar gum for digestive regularity, gut health support, and natural soluble fiber. Promotes healthy digestion and nutrient absorption.',
  keywords: 'guar gum, soluble fiber, digestive regularity, gut health, natural thickener, prebiotic fiber, digestive wellness, Canadian supplement',
  image: '/assets/webp/16x9_A_close_up_shot_of_guar_gum.webp',
  url: '/ingredients/digestive-aid-guar-gum'
})

export default function DigestiveAidGuarGumPage() {
  return <DigestiveAidGuarGum />
}