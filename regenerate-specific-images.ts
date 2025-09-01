import { promises as fs } from 'fs';
import path from 'path';
import { TogetherAI } from './src/lib/together-ai';

// Specific images to regenerate with updated prompts
interface RegenerateImage {
  filename: string;
  componentPath: string;
  oldImageName: string;
  newPrompt: string;
  negativePrompt: string;
  reason: string;
}

const IMAGES_TO_REGENERATE: RegenerateImage[] = [
  {
    filename: 'hydration-illustration.jpg',
    componentPath: 'src/components/pages/ingredients/HydratingCelery.tsx',
    oldImageName: 'hydration-illustration',
    newPrompt: 'Professional lifestyle photograph of smiling middle-aged woman in her 40s drinking a vibrant green smoothie, shot with Canon 85mm lens, natural window lighting, clean modern kitchen background, healthy lifestyle concept, woman wearing casual white shirt, glass of green drink in hand, satisfied expression, high-quality stock photography style, ultra-realistic',
    negativePrompt: 'cartoon, illustration, drawing, animated, fake, artificial, low quality, blurry, pixelated, medical diagram, microscope, scientific equipment',
    reason: 'User requested middle-aged woman drinking green drink instead of medical illustration'
  },
  {
    filename: 'papaya-closeup.jpg',
    componentPath: 'src/components/pages/ingredients/ExoticPapayaPowder.tsx',
    oldImageName: 'papaya-closeup',
    newPrompt: 'Professional macro photograph of fresh ripe papaya sliced in half showing bright orange flesh with glossy black seeds in center cavity, shot with Canon 100mm macro lens, studio lighting, white background, ultra-sharp detail, food photography style, seeds must be black not white, vibrant orange interior, smooth glossy flesh texture',
    negativePrompt: 'white seeds, light colored seeds, pale seeds, cartoon, illustration, drawing, low quality, blurry, artificial colors',
    reason: 'User requested black seeds instead of current seed color'
  },
  {
    filename: 'gut-health-illustration.jpg',
    componentPath: 'src/components/pages/ingredients/DigestiveAidGuarGum.tsx', 
    oldImageName: 'gut-health-illustration',
    newPrompt: 'Professional lifestyle photograph of smiling middle-aged man in his 40s holding his stomach with both hands, satisfied and happy expression on face, shot with Canon 85mm lens, natural lighting, casual blue shirt, comfortable home setting, digestive comfort and satisfaction concept, wellness photography style, genuine smile, ultra-realistic',
    negativePrompt: 'pain, discomfort, medical diagram, cartoon, illustration, drawing, animated, scientific equipment, microscope, anatomy chart',
    reason: 'User requested middle-aged man holding stomach with satisfied smile instead of medical illustration'
  },
  {
    filename: 'fiber-diagram.jpg',
    componentPath: 'src/components/pages/ingredients/AppleFiber.tsx',
    oldImageName: 'fiber-diagram',
    newPrompt: 'Professional close-up photograph of dietary fiber structure in apple cross-section, shot with macro lens, natural lighting, clean white background, showing cellular fiber structure without any scientific equipment visible, ultra-detailed food photography, no microscope in frame, pure fiber detail',
    negativePrompt: 'microscope, scientific equipment, laboratory tools, medical instruments, cartoon, illustration, drawing, low quality, blurry',
    reason: 'User requested removal of microscope from fiber diagram'
  },
  {
    filename: 'antioxidant-diagram.jpg',
    componentPath: 'src/components/pages/ingredients/AcaiBerry.tsx',
    oldImageName: 'antioxidant-diagram',
    newPrompt: 'Professional food photography of colorful antioxidant-rich foods arranged beautifully, blueberries, blackberries, dark cherries, pomegranate seeds, dark chocolate, green tea leaves, red wine grapes, goji berries, shot with Canon 50mm lens, natural lighting, rustic wooden background, vibrant natural colors, food styling, ultra-realistic',
    negativePrompt: 'microscope, scientific equipment, medical diagram, laboratory, cartoon, illustration, drawing, artificial, processed foods',
    reason: 'User requested antioxidant foods instead of scientific diagram'
  },
  {
    filename: 'acai-closeup.jpg',
    componentPath: 'src/components/pages/ingredients/AcaiBerry.tsx',
    oldImageName: 'acai-closeup',
    newPrompt: 'Professional macro photograph of fresh acai berries, small round solid berries similar to blueberries but darker purple-black color, shot with Canon 100mm macro lens, studio lighting, white background, berries should be solid round spheres like blueberries not elongated like raspberries, ultra-sharp detail, food photography',
    negativePrompt: 'raspberry shape, elongated berries, cartoon, illustration, drawing, low quality, blurry, artificial colors',
    reason: 'User requested acai berries to be solid and round like blueberries, not raspberry-shaped'
  }
];

const WAIT_TIME = 120_000; // 2 minutes between requests

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

async function updateComponent(image: RegenerateImage): Promise<void> {
  try {
    const componentContent = await fs.readFile(image.componentPath, 'utf8');
    const updatedContent = componentContent.replace(
      new RegExp(`/lovable-uploads/${image.oldImageName}\\.jpg`, 'g'),
      `/lovable-uploads/${image.filename}`
    );
    
    await fs.writeFile(image.componentPath, updatedContent);
    console.log(`✅ Updated component: ${path.basename(image.componentPath)}`);
  } catch (error) {
    console.error(`❌ Failed to update component ${image.componentPath}:`, error);
    throw error;
  }
}

async function regenerateImage(
  togetherAI: TogetherAI,
  image: RegenerateImage,
  index: number,
  total: number
): Promise<void> {
  console.log(`\n🎨 [${index}/${total}] Regenerating: ${image.filename}`);
  console.log(`📝 Reason: ${image.reason}`);
  console.log(`📝 Prompt: ${image.newPrompt.substring(0, 100)}...`);

  try {
    // Generate the image with new prompt
    const base64Image = await togetherAI.generateImage(image.newPrompt, {});

    // Save the base64 image
    await saveBase64Image(base64Image, image.filename);

    // Update the component
    await updateComponent(image);

    console.log(`✅ [${index}/${total}] REGENERATED: ${image.filename}`);

    // Wait before next generation (except for the last image)
    if (index < total) {
      console.log(`⏳ Waiting ${WAIT_TIME/1000} seconds for rate limit...`);
      await delay(WAIT_TIME);
    }

  } catch (error) {
    console.error(`❌ [${index}/${total}] FAILED: ${image.filename}`, error);
    throw error;
  }
}

async function main(): Promise<void> {
  console.log('🚀 Starting Specific Images Regeneration');
  console.log(`📊 Found ${IMAGES_TO_REGENERATE.length} images to regenerate`);
  
  IMAGES_TO_REGENERATE.forEach((img, i) => {
    console.log(`${i + 1}. ${img.filename} - ${img.reason}`);
  });
  
  console.log(`⏱️  Estimated time: ${Math.ceil(IMAGES_TO_REGENERATE.length * WAIT_TIME / 1000 / 60)} minutes\n`);

  const togetherAI = new TogetherAI();

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < IMAGES_TO_REGENERATE.length; i++) {
    try {
      await regenerateImage(togetherAI, IMAGES_TO_REGENERATE[i], i + 1, IMAGES_TO_REGENERATE.length);
      successCount++;
    } catch (error) {
      errorCount++;
      console.error(`\n💥 Stopping regeneration due to error with ${IMAGES_TO_REGENERATE[i].filename}`);
      break;
    }
  }

  console.log('\n📊 REGENERATION SUMMARY:');
  console.log(`✅ Successful: ${successCount}/${IMAGES_TO_REGENERATE.length}`);
  console.log(`❌ Errors: ${errorCount}`);
  
  if (successCount === IMAGES_TO_REGENERATE.length) {
    console.log('🎉 ALL SPECIFIC IMAGES REGENERATED SUCCESSFULLY!');
  } else {
    console.log('⚠️  Regeneration incomplete - check errors above');
  }
}

// Run the regeneration
main().catch(console.error);