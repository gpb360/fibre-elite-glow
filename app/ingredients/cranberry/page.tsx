import Cranberry from '@/components/pages/ingredients/Cranberry'
import { generateMetadata } from '@/lib/seo'

export const metadata = generateMetadata({
  title: 'Cranberry | Natural Antioxidants for Urinary & Digestive Health',
  description: 'Premium Canadian cranberry extract rich in proanthocyanidins, Vitamin C, and antioxidants for urinary tract health, digestive wellness, and immune support.',
  keywords: 'cranberry extract, proanthocyanidins, urinary tract health, antioxidants, vitamin C, digestive wellness, Canadian cranberries, natural supplement',
  image: '/assets/webp/16x9_a_close_up_shot_cranberry_.webp',
  url: '/ingredients/cranberry'
})

export default function CranberryPage() {
  return <Cranberry />
}