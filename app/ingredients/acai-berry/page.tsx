import AcaiBerry from '@/components/pages/ingredients/AcaiBerry'
import { generateMetadata } from '@/lib/seo'

export const metadata = generateMetadata({
  title: 'Acai Berry | Antioxidant-Rich Superfruit for Energy & Recovery',
  description: 'Premium acai berry powder loaded with antioxidants, anthocyanins, and Vitamin C. Supports energy levels, cellular health, and natural vitality.',
  keywords: 'acai berry, antioxidants, anthocyanins, vitamin C, energy boost, cellular health, superfruit, natural energy, Canadian supplement',
  image: '/lovable-uploads/acai-closeup.jpg',
  url: '/ingredients/acai-berry'
})

export default function AcaiBerryPage() {
  return <AcaiBerry />
}
