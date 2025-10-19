import Checkout from '@/components/pages/Checkout'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Secure Checkout | Premium Fiber Supplements | La Belle Vie',
  description: 'Complete your secure checkout for premium fiber supplements. Fast, safe payment processing with free shipping on qualifying orders.',
  robots: 'noindex, nofollow'
}

export default function CheckoutPage() {
  return <Checkout />
}
