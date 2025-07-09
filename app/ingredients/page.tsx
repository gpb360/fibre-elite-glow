import Ingredients from '@/components/pages/Ingredients';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-static';

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
        let name = dir.replace(/-/g, ' ');
        let image = '/placeholder.svg'; // Default placeholder

        try {
          const metadataModule = await import(`./${dir}/metadata`);
          name = metadataModule.metadata.title || name;
        } catch {
          // It's okay if metadata doesn't exist, we'll use the directory name.
        }

        const imageExtensions = ['jpg', 'jpeg', 'png', 'webp'];
        const imageNames = ['hero', 'thumbnail', 'image'];

        for (const imgName of imageNames) {
          for (const ext of imageExtensions) {
            const imgPath = path.join(process.cwd(), 'public', 'lovable-uploads', `${dir}-${imgName}.${ext}`);
            try {
              await fs.access(imgPath);
              image = `/lovable-uploads/${dir}-${imgName}.${ext}`;
              break;
            } catch {
              // File doesn't exist, continue checking
            }
          }
          if (image !== '/placeholder.svg') break;
        }

        return {
          name: name,
          path: `/ingredients/${dir}`,
          image: image,
        };
      })
  );

  return ingredients.filter(Boolean);
}

export default async function IngredientsPage() {
  const ingredients = await getIngredients();
  return <Ingredients ingredients={ingredients} />;
}