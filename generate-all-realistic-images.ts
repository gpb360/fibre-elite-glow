import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

import PiAPIFlux from './src/lib/piapi-flux';
import { REALISTIC_PROMPTS, RealisticImagePrompt } from './src/lib/realistic-image-prompts';

async function generateAllRealisticImages() {
  const flux = new PiAPIFlux();
  
  // Filter to priority 1 images first (most important)
  const priority1Images = REALISTIC_PROMPTS.filter(img => img.priority === 1);
  const priority2Images = REALISTIC_PROMPTS.filter(img => img.priority === 2);
  const priority3Images = REALISTIC_PROMPTS.filter(img => img.priority === 3);
  
  console.log('🚀 Starting ultra-realistic image generation...');
  console.log(`📊 Total images: ${REALISTIC_PROMPTS.length}`);
  console.log(`   Priority 1: ${priority1Images.length} (Medical/Core ingredients)`);
  console.log(`   Priority 2: ${priority2Images.length} (Supporting ingredients)`);
  console.log(`   Priority 3: ${priority3Images.length} (Backgrounds/Misc)`);
  console.log('');
  
  let currentBatch = priority1Images; // Start with priority 1
  let batchName = 'Priority 1';
  
  console.log(`🎯 Starting ${batchName} batch (${currentBatch.length} images)...\n`);
  
  for (let i = 0; i < currentBatch.length; i++) {
    const image = currentBatch[i];
    
    try {
      console.log(`📸 Generating ${i + 1}/${currentBatch.length}: ${image.filename}`);
      console.log(`📝 Category: ${image.category}`);
      console.log(`💡 Prompt: ${image.prompt.substring(0, 120)}...`);
      
      const imageUrl = await flux.generateImage(image.prompt, {
        width: 1024,
        height: 576, // 16:9 aspect ratio
        negative_prompt: image.negative_prompt,
        guidance_scale: 4.0, // Higher guidance for photorealism
        model: 'Qubico/flux1-dev' // Best quality model
      });
      
      const savedPath = await flux.downloadAndSaveImage(imageUrl, image.filename);
      console.log(`✅ SUCCESS: ${image.filename}`);
      console.log(`📁 Saved to: ${savedPath}`);
      
      // Wait between generations to be respectful to API
      if (i < currentBatch.length - 1) {
        console.log('⏳ Waiting 5 seconds before next generation...\n');
        await new Promise(resolve => setTimeout(resolve, 5000));
      } else {
        console.log(''); // Extra line after last item
      }
      
    } catch (error) {
      console.error(`❌ ERROR generating ${image.filename}:`, error);
      console.log('⏭️ Continuing with next image...\n');
    }
  }
  
  console.log(`🎉 Completed ${batchName} batch!`);
  console.log(`📂 Check /public/lovable-uploads/ for all generated images`);
  console.log('');
  console.log('💡 To generate Priority 2 & 3 images, run this script again and modify the currentBatch variable.');
  console.log('   Or modify this script to generate all priorities in one run.');
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n⏹️ Stopping image generation...');
  console.log('🔄 You can resume later - generated images are saved');
  process.exit(0);
});

generateAllRealisticImages().catch(console.error);