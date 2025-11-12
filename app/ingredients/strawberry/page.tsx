import Strawberry from '@/components/pages/ingredients/Strawberry'
import { generateMetadata } from '@/lib/seo'

export const metadata = generateMetadata({
  title: 'Strawberry | Natural Vitamin C & Fiber for Gut Health',
  description: 'Premium strawberry fiber for digestive wellness. Rich in Vitamin C, antioxidants, and natural fiber to support immune health, skin vitality, and overall wellness.',
  keywords: 'strawberry fiber, vitamin C, antioxidants, immune support, skin health, digestive wellness, natural fiber supplement, Canadian strawberries',
  image: '/assets/webp/16x9_Three_ripe_strawberries_with_bri.webp',
  url: '/ingredients/strawberry'
})

export default function StrawberryPage() {
  return <Strawberry />
}