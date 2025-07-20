import { Metadata } from 'next'
import ResetPasswordPage from '@/components/pages/ResetPasswordPage'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Reset Your Password | Account Recovery | Fibre Elite Glow',
  description: 'Reset your password to regain access to your Fibre Elite Glow account.',
  keywords: 'reset password, forgot password, account recovery, password change',
  url: '/reset-password'
})

export default function ResetPassword() {
  return <ResetPasswordPage />
}