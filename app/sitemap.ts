import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-static';
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://lbve.ca';

  // Static pages
  const staticRoutes = [
    '',
    '/products/total-essential',
    '/products/total-essential-plus',
    '/ingredients',
    '/benefits',
    '/testimonials',
    '/faq',
    '/contact',
    '/about',
    '/terms',
    '/privacy',
    '/cart',
    '/checkout',
    '/login',
    '/signup',
    '/account',
    '/reset-password',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : route.startsWith('/products/') ? 0.9 : 0.8,
  }));

  // Dynamic ingredient pages
  const ingredientsDir = path.join(process.cwd(), 'app/ingredients');
  const ingredientSubDirs = fs.readdirSync(ingredientsDir).filter(
    (file) => fs.statSync(path.join(ingredientsDir, file)).isDirectory()
  );

  const ingredientRoutes = ingredientSubDirs.map((dir) => ({
    url: `${baseUrl}/ingredients/${dir}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...ingredientRoutes];
}