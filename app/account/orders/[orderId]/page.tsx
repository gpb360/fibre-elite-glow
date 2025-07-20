import { Metadata } from 'next'
import OrderDetailsPage from '@/components/pages/OrderDetailsPage'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Order Details | Tracking & Information | Fibre Elite Glow',
  description: 'View detailed information about your order including items, shipping, and tracking.',
  keywords: 'order details, order tracking, order status, shipping information',
  url: '/account/orders'
})

interface OrderDetailsProps {
  params: Promise<{
    orderId: string
  }>
}

export default async function OrderDetails({ params }: OrderDetailsProps) {
  const { orderId } = await params
  return <OrderDetailsPage orderId={orderId} />
}