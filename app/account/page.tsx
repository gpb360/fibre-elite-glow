import { Metadata } from 'next'
import AccountPage from '@/components/pages/AccountPage'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'

export const metadata: Metadata = generateSEOMetadata({
  title: 'My Account - Fibre Elite Glow',
  description: 'Manage your account, view order history, update your profile, and track your wellness journey with Fibre Elite Glow.',
  keywords: 'account, profile, orders, order history, user dashboard, customer portal',
  url: '/account'
})

export default function Account() {
  return <AccountPage />
}