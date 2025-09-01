import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

import PiAPIFlux from './src/lib/piapi-flux';
import { REALISTIC_PROMPTS } from './src/lib/realistic-image-prompts';

async function testFinalPrompt() {
  const flux = new PiAPIFlux();
  
  // Test the digestive system diagram (most important medical image)
  const testImage = REALISTIC_PROMPTS.find(img => img.filename === 'digestive-system-diagram.jpg')!;
  
  console.log('🧪 Testing final ultra-realistic prompt...\n');
  console.log(`📸 Testing: ${testImage.filename}`);
  console.log(`📝 Category: ${testImage.category}`);
  console.log(`💡 Prompt: ${testImage.prompt}`);
  console.log(`🚫 Negative: ${testImage.negative_prompt}`);
  console.log('');
  
  try {
    const imageUrl = await flux.generateImage(testImage.prompt, {
      width: 1024,
      height: 576,
      negative_prompt: testImage.negative_prompt,
      guidance_scale: 4.0,
      model: 'Qubico/flux1-dev'
    });
    
    const savedPath = await flux.downloadAndSaveImage(imageUrl, `test-${testImage.filename}`);
    console.log(`✅ SUCCESS: test-${testImage.filename}`);
    console.log(`📁 Saved to: ${savedPath}`);
    console.log('');
    console.log('🎯 If this looks good, run generate-all-realistic-images.ts for full batch!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testFinalPrompt().catch(console.error);