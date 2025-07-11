import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fresh Cabbage Extract | Gut Healing & Anti-Inflammatory | Fibre Elite Glow',
  description: 'Discover the benefits of Fresh Cabbage Extract, rich in L-glutamine and Vitamin K to support a healthy gut lining, reduce inflammation, and aid digestion.',
  keywords: 'fresh cabbage extract, l-glutamine, gut health, digestive support, anti-inflammatory, vitamin k, leaky gut, natural supplements, cabbage benefits, cruciferous vegetables',
  openGraph: {
    title: 'Fresh Cabbage Extract | Natural Support for a Healthy Gut',
    description: 'A powerhouse of gut-healing nutrients, supporting a healthy digestive lining and reducing inflammation.',
    images: [
      {
        url: '/lovable-uploads/cabbage-extract.jpg',
        width: 1200,
        height: 630,
        alt: 'Fresh Cabbage Extract',
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fresh Cabbage Extract | Natural Support for a Healthy Gut',
    description: 'A powerhouse of gut-healing nutrients, supporting a healthy digestive lining and reducing inflammation.',
    images: ['/lovable-uploads/cabbage-extract.jpg'],
  }
}