import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Payment Error | Checkout Issue | La Belle Vie',
  description: 'There was an issue processing your payment. Please review the error details and try again or contact our support team for assistance.',
  robots: 'noindex, nofollow'
}

export default function CheckoutErrorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}