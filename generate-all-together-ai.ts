import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

import TogetherAI from './src/lib/together-ai';
import { REALISTIC_PROMPTS } from './src/lib/realistic-image-prompts';

async function generateAllWithTogetherAI() {
  const togetherAI = new TogetherAI();
  
  // Get remaining images to generate
  const missingImages = [
    'carrot-closeup.jpg', // Priority 1 - failed with PiAPI
    ...REALISTIC_PROMPTS.filter(img => img.priority === 2).map(img => img.filename),
    ...REALISTIC_PROMPTS.filter(img => img.priority === 3).map(img => img.filename)
  ];
  
  // Get the full prompt data for all images
  const imagesToGenerate = REALISTIC_PROMPTS.filter(img => 
    missingImages.includes(img.filename)
  );
  
  console.log('🚀 Starting Together AI image generation...');
  console.log(`📊 Total images to generate: ${imagesToGenerate.length}`);
  console.log(`   Priority 1 (missing): 1 (carrot-closeup.jpg)`);
  console.log(`   Priority 2: ${REALISTIC_PROMPTS.filter(img => img.priority === 2).length}`);
  console.log(`   Priority 3: ${REALISTIC_PROMPTS.filter(img => img.priority === 3).length}`);
  console.log(`💡 Using Together AI free FLUX.1-schnell (unlimited 3 months)`);
  console.log('');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < imagesToGenerate.length; i++) {
    const image = imagesToGenerate[i];
    
    try {
      console.log(`📸 Generating ${i + 1}/${imagesToGenerate.length}: ${image.filename}`);
      console.log(`📝 Category: ${image.category} | Priority: ${image.priority}`);
      console.log(`💡 Prompt: ${image.prompt.substring(0, 120)}...`);
      
      await togetherAI.generateAndSaveImage(
        image.prompt,
        image.filename,
        {
          width: 1024,
          height: 576, // 16:9 aspect ratio
          steps: 4, // FLUX schnell optimized
          seed: 42 + i // Vary seed for diversity
        }
      );
      
      console.log(`✅ SUCCESS: ${image.filename}`);
      successCount++;
      
      // Small delay to be respectful to the API
      if (i < imagesToGenerate.length - 1) {
        console.log('⏳ Waiting 2 seconds before next generation...\n');
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        console.log(''); // Extra line after last item
      }
      
    } catch (error) {
      console.error(`❌ ERROR generating ${image.filename}:`, error);
      errorCount++;
      console.log('⏭️ Continuing with next image...\n');
    }
  }
  
  console.log('🎉 Batch generation completed!');
  console.log(`✅ Successfully generated: ${successCount} images`);
  console.log(`❌ Failed: ${errorCount} images`);
  console.log(`📂 All images saved to: /public/lovable-uploads/`);
  
  if (successCount > 0) {
    console.log('');
    console.log('🎯 Next steps:');
    console.log('   1. Review generated images for quality');
    console.log('   2. Update component image paths to use new images');
    console.log('   3. Replace any images that need improvement');
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n⏹️ Stopping image generation...');
  console.log('🔄 You can resume later - generated images are saved');
  process.exit(0);
});

generateAllWithTogetherAI().catch(console.error);