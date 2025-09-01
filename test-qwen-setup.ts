import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

import QwenImage from './src/lib/qwen-image';

async function testQwenSetup() {
  const qwen = QwenImage.getInstance();
  
  console.log('🧪 Testing Qwen-Image setup...\n');
  
  // Simple test prompt
  const testPrompt = "Professional macro photograph of fresh red apple slices on white marble countertop, shot with Canon 5D Mark IV, 100mm macro lens, f/8, natural window lighting, showing detailed cellular fiber structure and juice droplets, ultra-sharp focus, commercial food photography style, 8K resolution";
  
  console.log('📸 Testing with apple fiber prompt...');
  console.log(`📝 Prompt: ${testPrompt.substring(0, 100)}...`);
  
  try {
    const imagePath = await qwen.generateImage(testPrompt, {
      width: 1024,
      height: 576,
      num_inference_steps: 30, // Reduced for faster test
      cfg_scale: 4.0,
      seed: 42
    });
    
    console.log(`✅ SUCCESS: Qwen-Image generation completed!`);
    console.log(`📁 Test image saved: ${imagePath}`);
    console.log('');
    console.log('🎯 If the test image looks good, Qwen-Image is ready for batch generation!');
    console.log('💡 You can now use this as an alternative to PiAPI for generating missing images.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.log('');
    console.log('🔧 Troubleshooting tips:');
    console.log('   1. Ensure Python dependencies are installed: pip3 install diffusers torch transformers');
    console.log('   2. Check if you have enough disk space for the model (~4GB)');
    console.log('   3. On first run, the model will be downloaded from Hugging Face');
    console.log('   4. If using CPU, expect slower generation times');
  }
}

testQwenSetup().catch(console.error);