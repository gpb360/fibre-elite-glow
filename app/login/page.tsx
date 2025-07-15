import { Metadata } from 'next'
import LoginPage from '@/components/pages/LoginPage'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Login - Fibre Elite Glow',
  description: 'Sign in to your Fibre Elite Glow account to view your orders, manage your profile, and track your wellness journey.',
  keywords: 'login, sign in, account, user account, customer portal',
  url: '/login'
})

export default function Login() {
  return <LoginPage />
}