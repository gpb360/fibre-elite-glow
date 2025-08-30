import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

import TogetherAI from './src/lib/together-ai';
import { REALISTIC_PROMPTS } from './src/lib/realistic-image-prompts';

async function generateWithRateLimits() {
  const togetherAI = new TogetherAI();
  
  // Get remaining carrot image (Priority 1) + a few Priority 2 images for now
  const imagesToGenerate = REALISTIC_PROMPTS.filter(img => 
    ['carrot-closeup.jpg', 'celery-closeup.jpg', 'cranberry-closeup.jpg', 'papaya-closeup.jpg'].includes(img.filename)
  );
  
  console.log('🚀 Starting rate-limited Together AI generation...');
  console.log(`📊 Generating ${imagesToGenerate.length} images with 100-second delays`);
  console.log('⚠️  Rate limit: 0.6 queries/minute (1 every 100 seconds)');
  console.log(`⏱️  Total estimated time: ${Math.ceil(imagesToGenerate.length * 100 / 60)} minutes`);
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
          height: 576,
          steps: 4,
          seed: 42 + i
        }
      );
      
      console.log(`✅ SUCCESS: ${image.filename}`);
      successCount++;
      
      // Wait 100 seconds between requests to respect rate limit
      if (i < imagesToGenerate.length - 1) {
        console.log('⏳ Waiting 100 seconds for rate limit reset...');
        console.log(`⏱️  Time remaining: ${Math.ceil((imagesToGenerate.length - i - 1) * 100 / 60)} minutes`);
        
        // Countdown timer
        for (let countdown = 100; countdown > 0; countdown -= 10) {
          process.stdout.write(`\r⏳ ${countdown}s remaining...`);
          await new Promise(resolve => setTimeout(resolve, 10000));
        }
        console.log('\r⏳ Rate limit window reset! ✅\n');
      } else {
        console.log('');
      }
      
    } catch (error) {
      console.error(`❌ ERROR generating ${image.filename}:`, error);
      errorCount++;
      console.log('⏭️ Continuing with next image...\n');
    }
  }
  
  console.log('🎉 Rate-limited generation completed!');
  console.log(`✅ Successfully generated: ${successCount} images`);
  console.log(`❌ Failed: ${errorCount} images`);
  console.log('');
  console.log('💡 To generate more images:');
  console.log('   1. Wait for rate limits to fully reset');
  console.log('   2. Run script again with different image selection');
  console.log('   3. Consider alternative approaches for bulk generation');
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n⏹️ Stopping generation...');
  console.log('🔄 Generated images are already saved');
  process.exit(0);
});

generateWithRateLimits().catch(console.error);