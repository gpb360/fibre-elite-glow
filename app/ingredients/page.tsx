import Ingredients from '@/components/pages/Ingredients';
import { promises as fs } from 'fs';
import path from 'path';
import { generateMetadata } from '@/lib/seo';
import { getIngredientDescription, getIngredientImage, ingredientData } from '@/lib/ingredient-utils';
import { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = generateMetadata({
  title: 'Premium Ingredients - La Belle Vie Fiber Supplements',
  description: 'Discover the premium natural ingredients in our fiber supplements. From superfruits to prebiotic fibers, learn about the science behind our wellness formulas.',
  keywords: 'natural ingredients, fiber supplement ingredients, prebiotic fiber, superfruits, acai berry, cranberry, digestive health, wellness supplements',
  image: '/lovable-uploads/webp/digestive-health-benefits-fiber-supplement.webp',
  url: '/ingredients'
});

async function getIngredients() {
  const ingredientsDir = path.join(process.cwd(), 'app/ingredients');
  const ingredientSubDirs = await fs.readdir(ingredientsDir);

  const ingredients = await Promise.all(
    ingredientSubDirs
      .filter(async (file) => {
        try {
          const stats = await fs.stat(path.join(ingredientsDir, file));
          return stats.isDirectory();
        } catch (error) {
          console.error(`Error checking file stats for ${file}:`, error);
          return false;
        }
      })
      .map(async (dir) => {
        // Skip metadata directories and system files
        if (dir === 'prebiotic-powerhouse' || dir.startsWith('.') || !dir.includes('-')) {
          return null;
        }

        let name = dir.replace(/-/g, ' ');

        // Use ingredient data for consistent naming
        if (ingredientData[dir]) {
          name = ingredientData[dir].name;
        } else {
          // Fallback to metadata if available
          try {
            const metadataModule = await import(`./${dir}/metadata`);
            name = metadataModule.metadata.title.split(' - ')[0] || name;
          } catch {
            // Use directory name as fallback
          }
        }

        // Use mapped image for consistency
        const image = getIngredientImage(dir);

        // Use proper description
        const description = getIngredientDescription(dir);

        return {
          name: name,
          path: `/ingredients/${dir}`,
          image: image,
          description: description,
        };
      })
  );

  return ingredients.filter(Boolean);
}

export default async function IngredientsPage() {
  const ingredients = await getIngredients();
  return <Ingredients ingredients={ingredients} />;
}