import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Soothing Aloe Vera | Gut Health & Skin Hydration | La Belle Vie',
  description: 'Discover the benefits of Soothing Aloe Vera Powder, a gentle extract that calms the digestive tract, supports hydration, and promotes radiant skin health.',
  keywords: 'soothing aloe vera, aloe vera powder, digestive soothing, gut health, skin hydration, acemannan, anti-inflammatory, natural supplements, aloe vera benefits',
  openGraph: {
    title: 'Soothing Aloe Vera | For Gut Comfort & Radiant Skin',
    description: 'A gentle, powerful extract to soothe the digestive system, hydrate the body, and nourish the skin from within.',
    images: [
      {
        url: '/lovable-uploads/aloe-vera-extract.jpg',
        width: 1200,
        height: 630,
        alt: 'Soothing Aloe Vera Powder',
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Soothing Aloe Vera | For Gut Comfort & Radiant Skin',
    description: 'A gentle, powerful extract to soothe the digestive system, hydrate the body, and nourish the skin from within.',
    images: ['/lovable-uploads/aloe-vera-extract.jpg'],
  }
}