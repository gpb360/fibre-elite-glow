import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI: GoogleGenerativeAI | null = null;

function getGenAI() {
  if (!genAI) {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_AI_API_KEY is not set in environment variables');
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export async function generateContent(prompt: string, model: string = 'gemini-1.5-flash') {
  try {
    const ai = getGenAI();
    const modelInstance = ai.getGenerativeModel({ model });
    const result = await modelInstance.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
}

export async function generateContentStream(prompt: string, model: string = 'gemini-1.5-flash') {
  try {
    const ai = getGenAI();
    const modelInstance = ai.getGenerativeModel({ model });
    const result = await modelInstance.generateContentStream(prompt);
    return result.stream;
  } catch (error) {
    console.error('Error generating content stream:', error);
    throw error;
  }
}

export async function chatWithAI(messages: Array<{ role: string; parts: Array<{ text: string }> }>, model: string = 'gemini-1.5-flash') {
  try {
    const ai = getGenAI();
    const modelInstance = ai.getGenerativeModel({ model });
    const chat = modelInstance.startChat({
      history: messages.slice(0, -1),
    });
    const result = await chat.sendMessage(messages[messages.length - 1].parts[0].text);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error in chat:', error);
    throw error;
  }
}

export { getGenAI };