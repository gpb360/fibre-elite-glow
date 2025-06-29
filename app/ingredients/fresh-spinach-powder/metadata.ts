import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nutrient-Dense Spinach Powder | Vitality & Gut Health | Fibre Elite Glow',
  description: 'Elevate your health with our Nutrient-Dense Spinach Powder. This superfood powerhouse is packed with vitamins, minerals, and antioxidants to boost vitality and support gut health.',
  keywords: 'nutrient-dense spinach, spinach powder, boost vitality, gut health support, superfood powder, natural vitamins, iron-rich, antioxidant support, energy boost, green superfood',
  openGraph: {
    title: 'Nutrient-Dense Spinach Powder | A Superfood for Vitality',
    description: 'Boost your vitality and support your gut health with our premium spinach powder, a superfood packed with essential vitamins, minerals, and antioxidants.',
    images: [
      {
        url: '/lovable-uploads/spinach-powder-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Fresh Spinach Powder',
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nutrient-Dense Spinach Powder | A Superfood for Vitality',
    description: 'Boost your vitality and support your gut health with our premium spinach powder, a superfood packed with essential vitamins, minerals, and antioxidants.',
    images: ['/lovable-uploads/spinach-powder-hero.jpg'],
  }
}
