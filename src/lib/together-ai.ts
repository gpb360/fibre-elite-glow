import fetch from 'node-fetch';
import * as fs from 'fs/promises';
import * as path from 'path';

export interface TogetherAIOptions {
  width?: number;
  height?: number;
  steps?: number;
  seed?: number;
  model?: string;
}

export class TogetherAI {
  private apiKey: string;
  private baseUrl = 'https://api.together.xyz/v1';

  constructor() {
    this.apiKey = process.env.TOGETHER_AI_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('TOGETHER_AI_API_KEY is not set in environment variables');
    }
  }

  async generateImage(
    prompt: string, 
    options: TogetherAIOptions = {}
  ): Promise<string> {
    const {
      width = 1024,
      height = 576, // 16:9 aspect ratio
      steps = 4, // FLUX schnell is optimized for 4 steps
      seed = Math.floor(Math.random() * 1000000),
      model = 'black-forest-labs/FLUX.1-schnell-Free' // Free tier model
    } = options;

    console.log('🎨 Generating image with Together AI...');
    console.log(`📝 Prompt: ${prompt.substring(0, 100)}...`);
    console.log(`📐 Size: ${width}x${height}`);
    console.log(`🔧 Steps: ${steps}, Model: ${model}`);

    try {
      const response = await fetch(`${this.baseUrl}/images/generations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          prompt,
          width,
          height,
          steps,
          n: 1, // Generate 1 image
          seed,
          response_format: 'b64_json' // Get base64 encoded image
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Together AI API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json() as any;
      
      if (!result.data || result.data.length === 0) {
        throw new Error('No image data returned from Together AI');
      }

      // The API returns base64 encoded image
      const base64Image = result.data[0].b64_json;
      
      console.log('✅ Image generated successfully');
      return base64Image;
      
    } catch (error) {
      console.error('❌ Together AI generation failed:', error);
      throw error;
    }
  }

  async saveBase64Image(base64Data: string, filename: string): Promise<string> {
    try {
      // Remove data URL prefix if present
      const base64Clean = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');
      
      // Convert base64 to buffer
      const imageBuffer = Buffer.from(base64Clean, 'base64');
      
      // Ensure output directory exists
      const outputDir = path.join(process.cwd(), 'public/lovable-uploads');
      await fs.mkdir(outputDir, { recursive: true });
      
      // Save file
      const filePath = path.join(outputDir, filename);
      await fs.writeFile(filePath, imageBuffer);
      
      console.log(`💾 Image saved: ${filePath}`);
      return filePath;
      
    } catch (error) {
      throw new Error(`Failed to save image: ${error}`);
    }
  }

  async generateAndSaveImage(
    prompt: string, 
    filename: string,
    options: TogetherAIOptions = {}
  ): Promise<string> {
    const base64Image = await this.generateImage(prompt, options);
    return await this.saveBase64Image(base64Image, filename);
  }
}

export default TogetherAI;