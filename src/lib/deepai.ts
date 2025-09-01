import deepai from 'deepai';

// Initialize DeepAI with API key from environment variables
function initializeDeepAI() {
  const apiKey = process.env.DEEPAI_API_KEY;
  if (!apiKey) {
    throw new Error('DEEPAI_API_KEY is not set in environment variables');
  }
  deepai.setApiKey(apiKey);
}

// Available DeepAI models for image generation
export const DEEPAI_MODELS = {
  TEXT_TO_IMAGE: 'text2img',
  FANTASY_WORLD: 'fantasy-world-generator',
  CYBERPUNK: 'cyberpunk-generator',
  CUTE_CREATURE: 'cute-creature-generator',
  LOGO_GENERATOR: 'logo-generator',
  WATERCOLOR: 'watercolor-generator',
  PAINTING: 'painting-generator',
  PIXEL_ART: 'pixel-art-generator',
} as const;

export interface ImageGenerationOptions {
  text: string;
  model?: string;
  style?: string;
  width?: number;
  height?: number;
}

export interface ImageGenerationResult {
  output_url: string;
  id: string;
}

/**
 * Generate an image from text using DeepAI
 */
export async function generateImage(options: ImageGenerationOptions): Promise<ImageGenerationResult> {
  try {
    initializeDeepAI();
    
    const { text, model = DEEPAI_MODELS.TEXT_TO_IMAGE } = options;
    
    const response = await deepai.callStandardApi(model, {
      text: text,
    });

    return {
      output_url: response.output_url,
      id: response.id || Date.now().toString(),
    };
  } catch (error) {
    console.error('Error generating image with DeepAI:', error);
    throw error;
  }
}

/**
 * Generate a fantasy world image
 */
export async function generateFantasyWorld(prompt: string): Promise<ImageGenerationResult> {
  return generateImage({
    text: prompt,
    model: DEEPAI_MODELS.FANTASY_WORLD,
  });
}

/**
 * Generate a cyberpunk style image
 */
export async function generateCyberpunk(prompt: string): Promise<ImageGenerationResult> {
  return generateImage({
    text: prompt,
    model: DEEPAI_MODELS.CYBERPUNK,
  });
}

/**
 * Generate a watercolor style image
 */
export async function generateWatercolor(prompt: string): Promise<ImageGenerationResult> {
  return generateImage({
    text: prompt,
    model: DEEPAI_MODELS.WATERCOLOR,
  });
}

/**
 * Generate a logo
 */
export async function generateLogo(prompt: string): Promise<ImageGenerationResult> {
  return generateImage({
    text: prompt,
    model: DEEPAI_MODELS.LOGO_GENERATOR,
  });
}

/**
 * Generate pixel art
 */
export async function generatePixelArt(prompt: string): Promise<ImageGenerationResult> {
  return generateImage({
    text: prompt,
    model: DEEPAI_MODELS.PIXEL_ART,
  });
}

/**
 * Upscale an image using DeepAI Super Resolution
 */
export async function upscaleImage(imageUrl: string): Promise<ImageGenerationResult> {
  try {
    initializeDeepAI();
    
    const response = await deepai.callStandardApi('waifu2x', {
      image: imageUrl,
    });

    return {
      output_url: response.output_url,
      id: response.id || Date.now().toString(),
    };
  } catch (error) {
    console.error('Error upscaling image with DeepAI:', error);
    throw error;
  }
}

/**
 * Remove background from an image
 */
export async function removeBackground(imageUrl: string): Promise<ImageGenerationResult> {
  try {
    initializeDeepAI();
    
    const response = await deepai.callStandardApi('background-remover', {
      image: imageUrl,
    });

    return {
      output_url: response.output_url,
      id: response.id || Date.now().toString(),
    };
  } catch (error) {
    console.error('Error removing background with DeepAI:', error);
    throw error;
  }
}

/**
 * Colorize a black and white image
 */
export async function colorizeImage(imageUrl: string): Promise<ImageGenerationResult> {
  try {
    initializeDeepAI();
    
    const response = await deepai.callStandardApi('colorizer', {
      image: imageUrl,
    });

    return {
      output_url: response.output_url,
      id: response.id || Date.now().toString(),
    };
  } catch (error) {
    console.error('Error colorizing image with DeepAI:', error);
    throw error;
  }
}

export { deepai };