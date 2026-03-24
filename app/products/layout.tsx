import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Premium Fiber Supplements | Total Essential & Plus | La Belle Vie',
  description: 'Shop our premium fiber supplement collection — Total Essential and Total Essential Plus. Natural, plant-based formulas for optimal gut health.',
  keywords: 'fiber supplements, Total Essential, Total Essential Plus, gut health, natural supplements',
}

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
