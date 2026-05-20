import Cart from '@/components/pages/Cart'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shopping Cart | La Belle Vie',
  description: 'Review your selected premium fiber supplements before checkout.',
  robots: 'noindex, nofollow',
}

export default function CartPage() {
  return <Cart />
}
