import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cranberry | Urinary Tract Health & Antioxidant Support | La Belle Vie',
  description: 'Discover the powerful benefits of Cranberry, a superfood known for supporting urinary tract health, providing antioxidant protection, and boosting the immune system.',
  keywords: 'cranberry, urinary tract health, UTI prevention, antioxidant, immune support, cranberry benefits, natural urinary support, premium cranberry, dietary supplement, proanthocyanidins',
  openGraph: {
    title: 'Cranberry | Natural Support for Urinary Health & Wellness',
    description: 'Harness the power of cranberries to support urinary tract health, fight oxidative stress, and boost your immune system. Our premium cranberry extract is rich in proanthocyanidins.',
    images: [
      {
        url: '/lovable-uploads/cranberry.jpg',
        width: 1200,
        height: 630,
        alt: 'Cranberry',
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cranberry | Your Ally for Urinary Tract Health & Antioxidant Defense',
    description: 'Our premium cranberry extract provides powerful support for urinary tract health and delivers a potent dose of antioxidants to protect your body.',
    images: ['/lovable-uploads/cranberry-hero.jpg'],
  }
}