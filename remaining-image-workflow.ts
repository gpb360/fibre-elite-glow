import { promises as fs } from 'fs';
import path from 'path';
import { TogetherAI } from './src/lib/together-ai';
import { REALISTIC_PROMPTS } from './src/lib/realistic-image-prompts';

// Image to component mapping for remaining images
interface ImageComponentMapping {
  filename: string;
  componentPath: string;
  oldImageName: string;
  priority: number;
}

const REMAINING_IMAGE_MAPPINGS: ImageComponentMapping[] = [
  // PRIORITY 2 (9 remaining images)
  {
    filename: 'strawberry-closeup.jpg',
    componentPath: 'src/components/pages/ingredients/Strawberry.tsx',
    oldImageName: 'strawberry-closeup',
    priority: 2
  },
  {
    filename: 'vitamin-c-diagram.jpg',
    componentPath: 'src/components/pages/ingredients/Strawberry.tsx',
    oldImageName: 'vitamin-c-diagram',
    priority: 2
  },
  {
    filename: 'urinary-tract-diagram.jpg',
    componentPath: 'src/components/pages/ingredients/Cranberry.tsx',
    oldImageName: 'urinary-tract-diagram',
    priority: 2
  },
  {
    filename: 'skin-health-illustration.jpg',
    componentPath: 'src/components/pages/ingredients/SoothingAloeVeraPowder.tsx',
    oldImageName: 'skin-health-illustration',
    priority: 2
  },
  {
    filename: 'aloe-vera-closeup.jpg',
    componentPath: 'src/components/pages/ingredients/SoothingAloeVeraPowder.tsx',
    oldImageName: 'aloe-vera-closeup',
    priority: 2
  },
  {
    filename: 'spinach-leaves.jpg',
    componentPath: 'src/components/pages/ingredients/FreshSpinachPowder.tsx',
    oldImageName: 'spinach-leaves',
    priority: 2
  },
  {
    filename: 'acai-closeup.jpg',
    componentPath: 'src/components/pages/ingredients/AcaiBerry.tsx',
    oldImageName: 'acai-closeup',
    priority: 2
  },
  {
    filename: 'antioxidant-diagram.jpg',
    componentPath: 'src/components/pages/ingredients/AcaiBerry.tsx',
    oldImageName: 'antioxidant-diagram',
    priority: 2
  },
  {
    filename: 'hydration-illustration.jpg',
    componentPath: 'src/components/pages/ingredients/HydratingCelery.tsx',
    oldImageName: 'hydration-illustration',
    priority: 2
  },
  
  // PRIORITY 3 (6 remaining images)
  {
    filename: 'corn-field.jpg',
    componentPath: 'src/components/pages/ingredients/SolubleCornFiber.tsx',
    oldImageName: 'corn-field',
    priority: 3
  },
  {
    filename: 'guar-beans.jpg',
    componentPath: 'src/components/pages/ingredients/DigestiveAidGuarGum.tsx',
    oldImageName: 'guar-beans',
    priority: 3
  },
  {
    filename: 'oil-palm-trunk.jpg',
    componentPath: 'src/components/pages/ingredients/SustainablePalmFiber.tsx',
    oldImageName: 'oil-palm-trunk',
    priority: 3
  },
  {
    filename: 'prebiotic-foods.jpg',
    componentPath: 'src/components/pages/ingredients/PrebioticPowerhouse.tsx',
    oldImageName: 'prebiotic-foods',
    priority: 3
  },
  {
    filename: 'apple-bg.jpg',
    componentPath: 'src/components/pages/ingredients/PremiumAppleFiber.tsx',
    oldImageName: 'apple-bg',
    priority: 3
  },
  {
    filename: 'apple-pomace.jpg',
    componentPath: 'src/components/pages/ingredients/PremiumAppleFiber.tsx',
    oldImageName: 'apple-pomace',
    priority: 3
  }
];

const WAIT_TIME = 120_000; // 120 seconds (2 minutes - safer for 0.6 queries/minute rate limit)

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function saveBase64Image(base64Data: string, filename: string): Promise<void> {
  try {
    // Remove data URL prefix if present
    const base64Clean = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');
    
    // Convert base64 to buffer
    const imageBuffer = Buffer.from(base64Clean, 'base64');
    
    // Ensure output directory exists
    const outputDir = path.join('public/lovable-uploads');
    await fs.mkdir(outputDir, { recursive: true });
    
    // Save file
    const filePath = path.join(outputDir, filename);
    await fs.writeFile(filePath, imageBuffer);
    
    console.log(`✅ Saved: ${filename}`);
  } catch (error) {
    console.error(`❌ Failed to save ${filename}:`, error);
    throw error;
  }
}

async function updateComponent(mapping: ImageComponentMapping): Promise<void> {
  try {
    const componentContent = await fs.readFile(mapping.componentPath, 'utf8');
    const updatedContent = componentContent.replace(
      new RegExp(`/lovable-uploads/${mapping.oldImageName}\\.jpg`, 'g'),
      `/lovable-uploads/${mapping.filename}`
    );
    
    await fs.writeFile(mapping.componentPath, updatedContent);
    console.log(`✅ Updated component: ${path.basename(mapping.componentPath)}`);
  } catch (error) {
    console.error(`❌ Failed to update component ${mapping.componentPath}:`, error);
    throw error;
  }
}

async function generateAndUpdateImage(
  togetherAI: TogetherAI,
  mapping: ImageComponentMapping,
  index: number,
  total: number
): Promise<void> {
  console.log(`\n🎨 [${index}/${total}] Starting: ${mapping.filename} (Priority ${mapping.priority})`);
  
  // Find the prompt for this image
  const promptData = REALISTIC_PROMPTS.find(p => p.filename === mapping.filename);
  if (!promptData) {
    throw new Error(`No prompt found for ${mapping.filename}`);
  }

  try {
    // Generate the image
    console.log(`📝 Prompt: ${promptData.prompt.substring(0, 100)}...`);
    const base64Image = await togetherAI.generateImage(promptData.prompt, {
      negative_prompt: promptData.negative_prompt
    });

    // Save the base64 image
    await saveBase64Image(base64Image, mapping.filename);

    // Update the component
    await updateComponent(mapping);

    console.log(`✅ [${index}/${total}] COMPLETE: ${mapping.filename}`);

    // Wait before next generation (except for the last image)
    if (index < total) {
      console.log(`⏳ Waiting ${WAIT_TIME/1000} seconds for rate limit...`);
      await delay(WAIT_TIME);
    }

  } catch (error) {
    console.error(`❌ [${index}/${total}] FAILED: ${mapping.filename}`, error);
    throw error;
  }
}

async function main(): Promise<void> {
  console.log('🚀 Starting Remaining Images Generate & Update Workflow');
  console.log(`📊 Found ${REMAINING_IMAGE_MAPPINGS.length} remaining images to generate`);
  
  // Sort by priority to generate most important images first
  const sortedMappings = [...REMAINING_IMAGE_MAPPINGS].sort((a, b) => a.priority - b.priority);
  
  const priority2Count = sortedMappings.filter(m => m.priority === 2).length;
  const priority3Count = sortedMappings.filter(m => m.priority === 3).length;
  
  console.log(`📋 Priority 2: ${priority2Count} images`);
  console.log(`📋 Priority 3: ${priority3Count} images`);
  console.log(`⏱️  Estimated time: ${Math.ceil(sortedMappings.length * WAIT_TIME / 1000 / 60)} minutes\n`);

  const togetherAI = new TogetherAI();

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < sortedMappings.length; i++) {
    try {
      await generateAndUpdateImage(togetherAI, sortedMappings[i], i + 1, sortedMappings.length);
      successCount++;
    } catch (error) {
      errorCount++;
      console.error(`\n💥 Stopping workflow due to error with ${sortedMappings[i].filename}`);
      break;
    }
  }

  console.log('\n📊 WORKFLOW SUMMARY:');
  console.log(`✅ Successful: ${successCount}/${sortedMappings.length}`);
  console.log(`❌ Errors: ${errorCount}`);
  
  if (successCount === sortedMappings.length) {
    console.log('🎉 ALL REMAINING IMAGES GENERATED AND DEPLOYED!');
  } else {
    console.log('⚠️  Workflow incomplete - check errors above');
  }
}

// Run the workflow
main().catch(console.error);