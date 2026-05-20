import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard | La Belle Vie',
  description: 'Manage orders, testimonials, and affiliates for La Belle Vie.',
  robots: 'noindex, nofollow',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
