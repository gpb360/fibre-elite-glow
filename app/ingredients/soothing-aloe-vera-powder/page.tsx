import SoothingAloeVeraPowder from '@/components/pages/ingredients/SoothingAloeVeraPowder'
import { generateMetadata } from '@/lib/seo'

export const metadata = generateMetadata({
  title: 'Soothing Aloe Vera Powder | Natural Digestive Comfort & Gut Health',
  description: 'Premium aloe vera powder for digestive wellness, gut lining support, and natural soothing relief. Rich in enzymes and anti-inflammatory compounds.',
  keywords: 'aloe vera powder, digestive comfort, gut health, anti-inflammatory, enzymes, natural healing, digestive wellness, Canadian supplement',
  image: '/assets/webp/16x9_a_close_up_shot_of_aleo.webp',
  url: '/ingredients/soothing-aloe-vera-powder'
})

export default function SoothingAloeVeraPowderPage() {
  return <SoothingAloeVeraPowder />
}