import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-static';
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.fibre-elite-glow.com';

  // Static pages
  const staticRoutes = [
    '',
    '/products/total-essential',
    '/products/total-essential-plus',
    '/ingredients',
    '/benefits',
    '/testimonials',
    '/faq',
    '/cart',
    '/checkout',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  // Dynamic ingredient pages
  const ingredientsDir = path.join(process.cwd(), 'app/ingredients');
  const ingredientSubDirs = fs.readdirSync(ingredientsDir).filter(
    (file) => fs.statSync(path.join(ingredientsDir, file)).isDirectory()
  );

  const ingredientRoutes = ingredientSubDirs.map((dir) => ({
    url: `${baseUrl}/ingredients/${dir}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...ingredientRoutes];
}