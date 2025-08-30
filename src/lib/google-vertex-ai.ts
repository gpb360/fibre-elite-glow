import { GoogleGenAI } from '@google/genai';

// Initialize Vertex with your Cloud project and location
const ai = new GoogleGenAI({
  vertexai: true,
  project: 's7s-n8n',
  location: 'global'
});

// Available models
export const MODELS = {
  GEMINI_2_FLASH_PREVIEW: 'gemini-2.0-flash-preview-image-generation',
  GEMINI_1_5_FLASH: 'gemini-1.5-flash',
  GEMINI_1_5_PRO: 'gemini-1.5-pro',
} as const;

// Default generation config
const defaultGenerationConfig = {
  maxOutputTokens: 8192,
  temperature: 1,
  topP: 0.95,
  responseModalities: ["TEXT", "IMAGE"],
  safetySettings: [
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'OFF',
    },
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'OFF',
    },
    {
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      threshold: 'OFF',
    },
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'OFF',
    },
    {
      category: 'HARM_CATEGORY_IMAGE_HATE',
      threshold: 'OFF',
    },
    {
      category: 'HARM_CATEGORY_IMAGE_DANGEROUS_CONTENT',
      threshold: 'OFF',
    },
    {
      category: 'HARM_CATEGORY_IMAGE_HARASSMENT',
      threshold: 'OFF',
    },
    {
      category: 'HARM_CATEGORY_IMAGE_SEXUALLY_EXPLICIT',
      threshold: 'OFF',
    }
  ],
};

export async function generateContent(
  prompt: string,
  model: string = MODELS.GEMINI_1_5_FLASH,
  config = defaultGenerationConfig
) {
  try {
    const req = {
      model: model,
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      config: config,
    };

    const result = await ai.models.generateContent(req);
    return result.text;
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
}

export async function generateContentStream(
  prompt: string,
  model: string = MODELS.GEMINI_1_5_FLASH,
  config = defaultGenerationConfig
) {
  try {
    const req = {
      model: model,
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      config: config,
    };

    const streamingResp = await ai.models.generateContentStream(req);
    return streamingResp;
  } catch (error) {
    console.error('Error generating content stream:', error);
    throw error;
  }
}

export async function generateContentWithImage(
  prompt: string,
  imageData: string | Buffer,
  mimeType: string = 'image/jpeg',
  model: string = MODELS.GEMINI_2_FLASH_PREVIEW,
  config = defaultGenerationConfig
) {
  try {
    const req = {
      model: model,
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: mimeType,
                data: imageData instanceof Buffer ? imageData.toString('base64') : imageData
              }
            }
          ]
        }
      ],
      config: config,
    };

    const result = await ai.models.generateContent(req);
    return result;
  } catch (error) {
    console.error('Error generating content with image:', error);
    throw error;
  }
}

export async function chatWithAI(
  messages: Array<{ role: string; parts: Array<{ text?: string; inlineData?: any }> }>,
  model: string = MODELS.GEMINI_1_5_FLASH,
  config = defaultGenerationConfig
) {
  try {
    const req = {
      model: model,
      contents: messages,
      config: config,
    };

    const result = await ai.models.generateContent(req);
    return result.text;
  } catch (error) {
    console.error('Error in chat:', error);
    throw error;
  }
}

export { ai };