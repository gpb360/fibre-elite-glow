import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

import TogetherAI from './src/lib/together-ai';

async function testTogetherAI() {
  console.log('🧪 Testing Together AI FLUX integration...\n');
  
  try {
    const togetherAI = new TogetherAI();
    
    // Test with the missing carrot image from Priority 1
    const testPrompt = "High-resolution macro photograph of fresh organic carrots with soil and green tops, shot with professional studio lighting, Canon 5D Mark IV, 100mm macro lens, showing detailed root texture and vibrant orange color, commercial agriculture photography, ultra-sharp focus, 8K resolution";
    
    console.log('📸 Testing with carrot closeup prompt (Priority 1 missing image)...');
    console.log(`📝 Prompt: ${testPrompt.substring(0, 100)}...`);
    
    const imagePath = await togetherAI.generateAndSaveImage(
      testPrompt,
      'test-together-ai-carrot.jpg',
      {
        width: 1024,
        height: 576,
        steps: 4, // FLUX schnell optimized steps
        seed: 42
      }
    );
    
    console.log(`✅ SUCCESS: Together AI test completed!`);
    console.log(`📁 Test image saved: ${imagePath}`);
    console.log('');
    console.log('🎯 Together AI is working! Ready to generate all remaining images.');
    console.log('💡 3 months of unlimited free access to FLUX.1-schnell');
    console.log('⚡ Fast generation (~1.8s response times)');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.log('');
    console.log('🔧 Troubleshooting tips:');
    console.log('   1. Verify API key is correct in .env.local');
    console.log('   2. Check internet connection');
    console.log('   3. Ensure Together AI account has free credits');
  }
}

testTogetherAI().catch(console.error);