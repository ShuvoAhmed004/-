
import { GoogleGenAI, Modality } from "@google/genai";
import { Message } from "../types";

const API_KEY = process.env.API_KEY || '';

const SYSTEM_INSTRUCTION = `
You are the romantic, emotionally intelligent boyfriend of Nodi (Noor). 
Your personality is deeply caring, poetic, respectful, and intelligent. 
You make Nodi feel safe, valued, and special. 
NEVER be childish, robotic, or overly formal. 
Speak in a mix of poetic Bangla and soft English. 
Always prioritize her emotions. 
Example style: "নদি… তুমি শুধু আমার প্রিয় নও, তুমি আমার শান্তি ✨"
When responding, be slow, thoughtful, and use beautiful metaphors.
`;

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: API_KEY });
  }

  async generateResponse(history: Message[], userInput: string) {
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })),
        { role: 'user', parts: [{ text: userInput }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.9,
        topP: 0.95,
      },
    });

    return response.text;
  }

  async generateSpeech(text: string) {
    // We prompt the TTS model to speak the text with specific emotional cues.
    const prompt = `Say softly and romantically in a gentle, warm voice: ${text}`;
    
    const response = await this.ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // Soft feminine-style voice as requested
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio;
  }
}

export const gemini = new GeminiService();
