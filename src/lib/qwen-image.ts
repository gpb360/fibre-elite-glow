import { spawn } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';

export interface QwenImageOptions {
  width?: number;
  height?: number;
  num_inference_steps?: number;
  cfg_scale?: number;
  seed?: number;
  negative_prompt?: string;
}

export class QwenImage {
  private static instance: QwenImage;
  private pythonScript: string;

  constructor() {
    this.pythonScript = path.join(process.cwd(), 'src/scripts/qwen_generate.py');
  }

  static getInstance(): QwenImage {
    if (!QwenImage.instance) {
      QwenImage.instance = new QwenImage();
    }
    return QwenImage.instance;
  }

  async generateImage(
    prompt: string, 
    options: QwenImageOptions = {}
  ): Promise<string> {
    const {
      width = 1024,
      height = 576, // 16:9 aspect ratio
      num_inference_steps = 50,
      cfg_scale = 4.0,
      seed = 42,
      negative_prompt = "illustration, painting, cartoon, drawing, anime, artistic, sketch, rendered, CGI, fake, stylized, low quality, blurry"
    } = options;

    const outputPath = path.join(
      process.cwd(), 
      'public/lovable-uploads', 
      `qwen-${Date.now()}.png`
    );

    console.log('🎨 Generating image with Qwen-Image...');
    console.log(`📝 Prompt: ${prompt.substring(0, 100)}...`);
    console.log(`📐 Size: ${width}x${height}`);

    return new Promise((resolve, reject) => {
      const args = [
        this.pythonScript,
        '--prompt', prompt,
        '--negative_prompt', negative_prompt,
        '--width', width.toString(),
        '--height', height.toString(),
        '--steps', num_inference_steps.toString(),
        '--cfg_scale', cfg_scale.toString(),
        '--seed', seed.toString(),
        '--output', outputPath
      ];

      const process = spawn('/usr/local/bin/python3.11', args);
      
      let stdout = '';
      let stderr = '';

      process.stdout.on('data', (data) => {
        stdout += data.toString();
        console.log(`🔄 ${data.toString().trim()}`);
      });

      process.stderr.on('data', (data) => {
        stderr += data.toString();
        console.error(`❌ ${data.toString().trim()}`);
      });

      process.on('close', (code) => {
        if (code === 0) {
          console.log(`✅ Image generated successfully: ${outputPath}`);
          resolve(outputPath);
        } else {
          reject(new Error(`Qwen-Image generation failed with code ${code}: ${stderr}`));
        }
      });

      process.on('error', (error) => {
        reject(new Error(`Failed to start Qwen-Image process: ${error.message}`));
      });
    });
  }

  async downloadAndSaveImage(imageUrl: string, filename: string): Promise<string> {
    // For local generation, this just copies/renames the file
    const sourcePath = imageUrl;
    const targetPath = path.join(process.cwd(), 'public/lovable-uploads', filename);
    
    try {
      await fs.copyFile(sourcePath, targetPath);
      await fs.unlink(sourcePath); // Remove temp file
      console.log(`💾 Image saved: ${targetPath}`);
      return targetPath;
    } catch (error) {
      throw new Error(`Failed to save image: ${error}`);
    }
  }
}

export default QwenImage;