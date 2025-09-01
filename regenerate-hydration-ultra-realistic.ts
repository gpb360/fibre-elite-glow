import { promises as fs } from 'fs';
import path from 'path';
import { TogetherAI } from './src/lib/together-ai';

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

async function main(): Promise<void> {
  console.log('🚀 Regenerating Ultra-Realistic Hydration Image');

  const ultraRealisticPrompt = `Ultra-realistic professional portrait photograph of an attractive middle-aged woman, 45 years old, natural beauty, wearing a soft white cotton blouse, holding a tall glass of vibrant green smoothie, genuine warm smile, natural skin texture with subtle laugh lines, natural makeup, shoulder-length brown hair with natural highlights, sitting in a bright modern kitchen with white cabinets and natural window light, shot with Canon 5D Mark IV and 85mm f/1.4 lens, shallow depth of field, professional lifestyle photography, photojournalistic style, authentic human expression, ultra-high detail, 8K quality, natural lighting, real person not model`;

  const negativePrompt = 'cartoon, illustration, drawing, animated, fake, artificial, low quality, blurry, pixelated, medical diagram, microscope, scientific equipment, plastic, synthetic, overly perfect, airbrushed, unrealistic skin, doll-like, mannequin, CGI, 3D render';

  const togetherAI = new TogetherAI();

  try {
    console.log(`📝 Ultra-Realistic Prompt: ${ultraRealisticPrompt.substring(0, 100)}...`);
    
    // Generate the ultra-realistic image
    const base64Image = await togetherAI.generateImage(ultraRealisticPrompt, {});

    // Save the base64 image
    await saveBase64Image(base64Image, 'hydration-illustration.jpg');

    console.log(`✅ REGENERATED: hydration-illustration.jpg with ultra-realistic middle-aged woman`);
    console.log(`🎉 SUCCESS! Ultra-realistic hydration image generated and saved`);

  } catch (error) {
    console.error(`❌ FAILED to regenerate hydration image:`, error);
    throw error;
  }
}

// Run the regeneration
main().catch(console.error);