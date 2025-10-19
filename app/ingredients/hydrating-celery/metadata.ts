import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hydrating Celery - Electrolytes & Anti-Inflammatory - La Belle Vie',
  description: 'Restore optimal hydration and reduce inflammation with electrolyte-rich celery extract. This natural formula provides potassium, sodium, and phthalides that regulate fluid balance, support healthy blood pressure, and deliver anti-inflammatory flavonoids like apigenin that soothe tissues and enhance cellular recovery throughout the body.',
  keywords: 'hydrating celery, electrolytes, hydration, anti-inflammatory, apigenin, luteolin, natural diuretic, low calorie, natural supplements, celery benefits',
  openGraph: {
    title: 'Hydrating Celery | Natural Hydration & Inflammation Support',
    description: 'A refreshing source of hydration, electrolytes, and antioxidants to reduce inflammation and support overall wellness.',
    images: [
      {
        url: '/lovable-uploads/celery-extract.jpg',
        width: 1200,
        height: 630,
        alt: 'Hydrating Celery',
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hydrating Celery | Natural Hydration & Inflammation Support',
    description: 'A refreshing source of hydration, electrolytes, and antioxidants to reduce inflammation and support overall wellness.',
    images: ['/lovable-uploads/celery-extract.jpg'],
  }
}