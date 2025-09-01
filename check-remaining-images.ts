import * as dotenv from 'dotenv';
import path from 'path';
import * as fs from 'fs/promises';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

import { REALISTIC_PROMPTS } from './src/lib/realistic-image-prompts';

async function checkRemainingImages() {
  console.log('🔍 Checking remaining images to generate...\n');
  
  // Get list of already generated images
  const uploadsDir = path.join(process.cwd(), 'public/lovable-uploads');
  const existingFiles = await fs.readdir(uploadsDir);
  const existingImages = existingFiles.filter(file => file.endsWith('.jpg'));
  
  console.log('✅ Already Generated Images:');
  existingImages.forEach(img => console.log(`   ${img}`));
  console.log('');
  
  // Find missing images
  const missingImages = REALISTIC_PROMPTS.filter(prompt => 
    !existingImages.includes(prompt.filename)
  );
  
  // Group by priority
  const priority2Missing = missingImages.filter(img => img.priority === 2);
  const priority3Missing = missingImages.filter(img => img.priority === 3);
  
  console.log('📊 REMAINING IMAGES TO GENERATE:');
  console.log(`   Total: ${missingImages.length} images`);
  console.log(`   Priority 2: ${priority2Missing.length} images`);
  console.log(`   Priority 3: ${priority3Missing.length} images`);
  console.log('');
  
  if (priority2Missing.length > 0) {
    console.log('🔥 PRIORITY 2 - Missing Images:');
    priority2Missing.forEach((img, i) => {
      console.log(`   ${i + 1}. ${img.filename} (${img.category})`);
      console.log(`      Component: Find component using "${img.filename.replace('.jpg', '')}"`);
    });
    console.log('');
  }
  
  if (priority3Missing.length > 0) {
    console.log('📦 PRIORITY 3 - Missing Images:');
    priority3Missing.forEach((img, i) => {
      console.log(`   ${i + 1}. ${img.filename} (${img.category})`);
      console.log(`      Component: Find component using "${img.filename.replace('.jpg', '')}"`);
    });
    console.log('');
  }
  
  // Component mapping search
  console.log('🔍 COMPONENT SEARCH COMMANDS:');
  console.log('Run these commands to find which components need these images:');
  missingImages.forEach(img => {
    const searchTerm = img.filename.replace('.jpg', '').replace('.jpeg', '').replace('.png', '');
    console.log(`   grep -r "${searchTerm}" src/components/pages/ingredients/`);
  });
  
  console.log('');
  console.log('🚀 NEXT STEPS:');
  console.log('   1. Create component mappings for missing images');
  console.log('   2. Run generate-and-update workflow for Priority 2');
  console.log('   3. Run generate-and-update workflow for Priority 3');
  console.log(`   4. Total time estimate: ${missingImages.length * 100 / 60} minutes`);
}

checkRemainingImages().catch(console.error);