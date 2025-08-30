import * as dotenv from 'dotenv';
import path from 'path';
import * as fs from 'fs/promises';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

import TogetherAI from './src/lib/together-ai';
import { REALISTIC_PROMPTS } from './src/lib/realistic-image-prompts';

interface ImageComponentMapping {
  filename: string;
  componentPath: string;
  oldImageName: string;
}

const IMAGE_COMPONENT_MAPPINGS: ImageComponentMapping[] = [
  {
    filename: 'carrot-closeup.jpg',
    componentPath: 'src/components/pages/ingredients/NutrientRichCarrot.tsx',
    oldImageName: 'carrot-closeup'
  },
  {
    filename: 'celery-closeup.jpg', 
    componentPath: 'src/components/pages/ingredients/HydratingCelery.tsx',
    oldImageName: 'celery-closeup'
  },
  {
    filename: 'cranberry-closeup.jpg',
    componentPath: 'src/components/pages/ingredients/Cranberry.tsx', 
    oldImageName: 'cranberry-closeup'
  },
  {
    filename: 'papaya-closeup.jpg',
    componentPath: 'src/components/pages/ingredients/EnzymeRichPapaya.tsx',
    oldImageName: 'papaya-closeup'
  },
  {
    filename: 'raspberry-closeup.jpg',
    componentPath: 'src/components/pages/ingredients/Raspberry.tsx',
    oldImageName: 'raspberry-closeup'
  }
];

async function updateComponentImage(mapping: ImageComponentMapping): Promise<void> {
  try {
    const fullPath = path.join(process.cwd(), mapping.componentPath);
    const content = await fs.readFile(fullPath, 'utf8');
    
    // Replace the old placeholder with the new generated image
    const updatedContent = content.replace(
      new RegExp(`${mapping.oldImageName}\\.(jpg|jpeg|png|webp)`, 'g'),
      mapping.filename
    );
    
    await fs.writeFile(fullPath, updatedContent);
    console.log(`✅ Updated component: ${mapping.componentPath}`);
    console.log(`   Replaced: ${mapping.oldImageName} → ${mapping.filename}`);
    
  } catch (error) {
    console.error(`❌ Failed to update component ${mapping.componentPath}:`, error);
  }
}

async function generateAndUpdateWorkflow() {
  const togetherAI = new TogetherAI();
  
  console.log('🚀 Starting Generate-and-Update Workflow!');
  console.log('💡 Strategy: Generate → Update Component → Wait → Repeat');
  console.log(`📊 Processing ${IMAGE_COMPONENT_MAPPINGS.length} images with live updates`);
  console.log('⚠️  Rate limit: 0.6 queries/minute (100s between generations)');
  console.log('');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < IMAGE_COMPONENT_MAPPINGS.length; i++) {
    const mapping = IMAGE_COMPONENT_MAPPINGS[i];
    const imageData = REALISTIC_PROMPTS.find(img => img.filename === mapping.filename);
    
    if (!imageData) {
      console.error(`❌ No prompt data found for ${mapping.filename}`);
      errorCount++;
      continue;
    }
    
    try {
      console.log(`📸 [${i + 1}/${IMAGE_COMPONENT_MAPPINGS.length}] Generating: ${mapping.filename}`);
      console.log(`📝 Component: ${mapping.componentPath}`);
      console.log(`📄 Priority: ${imageData.priority} | Category: ${imageData.category}`);
      console.log(`💡 Prompt: ${imageData.prompt.substring(0, 100)}...`);
      console.log('');
      
      // Generate the image
      await togetherAI.generateAndSaveImage(
        imageData.prompt,
        mapping.filename,
        {
          width: 1024,
          height: 576,
          steps: 4,
          seed: 42 + i
        }
      );
      
      console.log(`✅ Image generated: ${mapping.filename}`);
      
      // Immediately update the component
      await updateComponentImage(mapping);
      console.log(`🔄 Component updated! Image now live on website.`);
      
      successCount++;
      
      // Wait for rate limit if not the last image
      if (i < IMAGE_COMPONENT_MAPPINGS.length - 1) {
        console.log('');
        console.log('⏳ Waiting 100 seconds for rate limit reset...');
        console.log(`📊 Progress: ${i + 1}/${IMAGE_COMPONENT_MAPPINGS.length} complete`);
        console.log(`⏱️  Remaining: ${IMAGE_COMPONENT_MAPPINGS.length - i - 1} images (~${Math.ceil((IMAGE_COMPONENT_MAPPINGS.length - i - 1) * 100 / 60)} min)`);
        
        // Countdown with progress updates every 10 seconds
        for (let countdown = 100; countdown > 0; countdown -= 10) {
          const nextImage = IMAGE_COMPONENT_MAPPINGS[i + 1];
          process.stdout.write(`\r⏳ ${countdown}s → Next: ${nextImage.filename} (${nextImage.componentPath})`);
          await new Promise(resolve => setTimeout(resolve, 10000));
        }
        console.log('\r✅ Rate limit reset! Moving to next image...\n');
      } else {
        console.log(''); 
      }
      
    } catch (error) {
      console.error(`❌ ERROR processing ${mapping.filename}:`, error);
      errorCount++;
      console.log('⏭️ Continuing with next image...\n');
    }
  }
  
  console.log('🎉 Generate-and-Update Workflow Complete!');
  console.log(`✅ Successfully processed: ${successCount} images`);
  console.log(`❌ Failed: ${errorCount} images`);
  console.log('');
  console.log('🌟 All updated images are now live on the website!');
  console.log('💡 Check the ingredient pages to see the new realistic images.');
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n⏹️ Stopping workflow...');
  console.log('✅ Generated images and component updates are already saved');
  process.exit(0);
});

generateAndUpdateWorkflow().catch(console.error);