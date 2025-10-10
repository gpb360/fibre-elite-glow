interface FluxTask {
  model: string;
  task_type: string;
  input: {
    prompt: string;
    negative_prompt?: string;
    width?: number;
    height?: number;
    guidance_scale?: number;
    denoise?: number;
    batch_size?: number;
  };
}

interface FluxResponse {
  code: number;
  message: string;
  data: {
    task_id: string;
    model: string;
    task_type: string;
    status: 'completed' | 'processing' | 'pending' | 'failed' | 'staged';
    input: any;
    output: {
      image_url?: string;
      image_urls?: string[];
    };
    meta: {
      created_at: string;
      started_at?: string;
      ended_at?: string;
      usage: {
        type: string;
        frozen: number;
        consume: number;
      };
      is_using_private_pool: boolean;
    };
    error?: {
      code: number;
      message: string;
    };
  };
}

export class PiAPIFlux {
  private apiKey: string;
  private baseUrl = 'https://api.piapi.ai';

  constructor() {
    const apiKey = process.env.PIAPI_API_KEY;
    if (!apiKey) {
      throw new Error('PIAPI_API_KEY is not set in environment variables');
    }
    this.apiKey = apiKey;
  }

  async generateImage(prompt: string, options: {
    width?: number;
    height?: number;
    negative_prompt?: string;
    guidance_scale?: number;
    model?: string;
  } = {}): Promise<string> {
    const task: FluxTask = {
      model: options.model || 'Qubico/flux1-dev',
      task_type: 'txt2img',
      input: {
        prompt,
        width: options.width || 1024,
        height: options.height || 576, // 16:9 aspect ratio
        negative_prompt: options.negative_prompt || 'blurry, low quality, distorted, ugly, bad anatomy',
        guidance_scale: options.guidance_scale || 3.5,
        denoise: 0.7,
        batch_size: 1,
      },
    };

    console.log(`🎨 Generating image: ${prompt.substring(0, 60)}...`);
    
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey,
        },
        body: JSON.stringify(task),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: FluxResponse = await response.json();
      
      if (result.code !== 200) {
        throw new Error(`API error: ${result.message}`);
      }

      // Poll for completion
      const taskId = result.data.task_id;
      console.log(`📋 Task created: ${taskId}, status: ${result.data.status}`);
      
      return await this.pollTaskCompletion(taskId);
    } catch (error) {
      console.error('Error generating image:', error);
      throw error;
    }
  }

  private async pollTaskCompletion(taskId: string): Promise<string> {
    const maxAttempts = 60; // 5 minutes max
    let attempts = 0;

    while (attempts < maxAttempts) {
      try {
        const response = await fetch(`${this.baseUrl}/api/v1/task/${taskId}`, {
          headers: {
            'X-API-Key': this.apiKey,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: FluxResponse = await response.json();
        
        console.log(`🔄 Task ${taskId} status: ${result.data.status}`);

        if (result.data.status === 'completed') {
          const imageUrl = result.data.output.image_url || result.data.output.image_urls?.[0];
          if (!imageUrl) {
            console.log('Task completed but checking output structure:', JSON.stringify(result.data.output, null, 2));
            throw new Error('No image URL in completed task');
          }
          console.log(`✅ Image generated successfully: ${imageUrl}`);
          return imageUrl;
        }

        if (result.data.status === 'failed') {
          const errorMsg = result.data.error?.message || 'Unknown error';
          throw new Error(`Task failed: ${errorMsg}`);
        }

        // Wait 5 seconds before next poll
        await new Promise(resolve => setTimeout(resolve, 5000));
        attempts++;
      } catch (error) {
        console.error(`Error polling task ${taskId}:`, error);
        throw error;
      }
    }

    throw new Error('Task timed out waiting for completion');
  }

  async downloadAndSaveImage(imageUrl: string, filename: string, directory: string = 'public/lovable-uploads'): Promise<string> {
    try {
      console.log(`📥 Downloading image: ${imageUrl}`);
      
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Ensure directory exists
      const fs = await import('fs');
      const path = await import('path');
      const fullDirectory = path.resolve(directory);
      
      if (!fs.existsSync(fullDirectory)) {
        fs.mkdirSync(fullDirectory, { recursive: true });
      }

      const filePath = path.join(fullDirectory, filename);
      fs.writeFileSync(filePath, buffer);
      
      console.log(`💾 Image saved: ${filePath}`);
      return filePath;
    } catch (error) {
      console.error('Error downloading/saving image:', error);
      throw error;
    }
  }
}

export default PiAPIFlux;