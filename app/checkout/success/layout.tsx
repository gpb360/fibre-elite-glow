import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Order Confirmation | Payment Successful | Fibre Elite Glow',
  description: 'Your order has been successfully processed. Thank you for choosing our premium fiber supplements for your digestive wellness journey.',
  robots: 'noindex, nofollow'
}

export default function CheckoutSuccessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}