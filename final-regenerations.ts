import { promises as fs } from 'fs';
import path from 'path';
import { TogetherAI } from './src/lib/together-ai';

// Final specific regenerations
interface RegenerateImage {
  filename: string;
  componentPath: string;
  oldImageName: string;
  newPrompt: string;
  negativePrompt: string;
  reason: string;
}

const FINAL_REGENERATIONS: RegenerateImage[] = [
  {
    filename: 'papaya-closeup.jpg',
    componentPath: 'src/components/pages/ingredients/EnzymeRichPapaya.tsx',
    oldImageName: 'papaya-closeup',
    newPrompt: 'Professional macro photograph of fresh ripe papaya cut in half showing bright orange flesh with multiple glossy black seeds clearly visible in the center cavity, shot with Canon 100mm macro lens, studio lighting, clean white background, ultra-sharp detail, food photography style, seeds must be distinctly black and shiny, vibrant orange interior flesh, smooth texture, restaurant quality presentation',
    negativePrompt: 'white seeds, light colored seeds, pale seeds, brown seeds, cartoon, illustration, drawing, low quality, blurry, artificial colors',
    reason: 'User requested black seeds instead of current seed color'
  },
  {
    filename: 'gut-health-illustration.jpg',
    componentPath: 'src/components/pages/ingredients/DigestiveAidGuarGum.tsx',
    oldImageName: 'gut-health-illustration',
    newPrompt: 'Ultra-realistic professional lifestyle photograph of a handsome middle-aged man in his 40s with natural smile, both hands gently placed on his stomach area showing comfort and satisfaction, wearing casual blue button-up shirt, genuine happy expression, natural skin texture, sitting in comfortable home environment, shot with Canon 85mm lens, natural window lighting, digestive wellness and satisfaction concept, authentic human emotion, photojournalistic style',
    negativePrompt: 'pain, discomfort, medical diagram, cartoon, illustration, drawing, animated, scientific equipment, microscope, anatomy chart, fake smile, artificial',
    reason: 'User requested middle-aged man holding stomach with satisfied smile'
  },
  {
    filename: 'antioxidant-diagram.jpg',
    componentPath: 'src/components/pages/ingredients/AcaiBerry.tsx',
    oldImageName: 'antioxidant-diagram',
    newPrompt: 'Professional food photography composition of antioxidant-rich foods beautifully arranged, fresh blueberries, blackberries, dark sweet cherries, pomegranate seeds, pieces of dark chocolate 70%, green tea leaves, red grapes, goji berries, acai berries, arranged on rustic dark wood surface, shot with Canon 50mm lens, natural lighting from side, vibrant natural colors, food styling magazine quality, ultra-realistic textures',
    negativePrompt: 'microscope, scientific equipment, medical diagram, laboratory, cartoon, illustration, drawing, artificial, processed foods, synthetic',
    reason: 'User requested antioxidant foods instead of scientific diagram'
  },
  {
    filename: 'acai-closeup.jpg',
    componentPath: 'src/components/pages/ingredients/AcaiBerry.tsx',
    oldImageName: 'acai-closeup',
    newPrompt: 'Professional macro photograph of fresh acai berries, small perfectly round solid berries similar in shape to blueberries but with deep purple-black color, shot with Canon 100mm macro lens, studio lighting, white background, berries should be completely spherical like blueberries not elongated, ultra-sharp detail showing smooth skin texture, food photography, realistic depth and dimension',
    negativePrompt: 'raspberry shape, elongated berries, oval berries, cartoon, illustration, drawing, low quality, blurry, artificial colors',
    reason: 'User requested acai berries to be solid and round like blueberries'
  }
];

const WAIT_TIME = 120_000; // 2 minutes between requests

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function saveBase64Image(base64Data: string, filename: string): Promise<void> {
  try {
    const base64Clean = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');
    const imageBuffer = Buffer.from(base64Clean, 'base64');
    const outputDir = path.join('public/lovable-uploads');
    await fs.mkdir(outputDir, { recursive: true });
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
    const base64Image = await togetherAI.generateImage(image.newPrompt, {
      negative_prompt: image.negativePrompt
    });

    await saveBase64Image(base64Image, image.filename);
    await updateComponent(image);

    console.log(`✅ [${index}/${total}] REGENERATED: ${image.filename}`);

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
  console.log('🚀 Starting Final Regenerations');
  console.log(`📊 Found ${FINAL_REGENERATIONS.length} images to regenerate`);
  
  FINAL_REGENERATIONS.forEach((img, i) => {
    console.log(`${i + 1}. ${img.filename} - ${img.reason}`);
  });
  
  console.log(`⏱️  Estimated time: ${Math.ceil(FINAL_REGENERATIONS.length * WAIT_TIME / 1000 / 60)} minutes\n`);

  const togetherAI = new TogetherAI();
  let successCount = 0;

  for (let i = 0; i < FINAL_REGENERATIONS.length; i++) {
    try {
      await regenerateImage(togetherAI, FINAL_REGENERATIONS[i], i + 1, FINAL_REGENERATIONS.length);
      successCount++;
    } catch (error) {
      console.error(`\n💥 Error with ${FINAL_REGENERATIONS[i].filename}, continuing...`);
      continue;
    }
  }

  console.log('\n📊 FINAL REGENERATION SUMMARY:');
  console.log(`✅ Successful: ${successCount}/${FINAL_REGENERATIONS.length}`);
  console.log('🎉 REGENERATION PROCESS COMPLETE!');
}

main().catch(console.error);