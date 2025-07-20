import { Metadata } from 'next'
import SignUpPage from '@/components/pages/SignUpPage'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Create Account | Join the Wellness Journey | Fibre Elite Glow',
  description: 'Create your Fibre Elite Glow account to track orders, manage your profile, and get personalized wellness recommendations.',
  keywords: 'sign up, register, create account, new customer, join',
  url: '/signup'
})

export default function SignUp() {
  return <SignUpPage />
}