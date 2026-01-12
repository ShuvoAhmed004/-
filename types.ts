
export interface Message {
  role: 'user' | 'model';
  text: string;
  audio?: string; // base64
}

export interface VoiceConfig {
  name: string;
  voiceName: string;
}

export enum AppState {
  INTRO = 'INTRO',
  GALLERY = 'GALLERY',
  READY = 'READY',
  CHATTING = 'CHATTING'
}
