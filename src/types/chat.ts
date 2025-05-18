
export type MessageSender = 'user' | 'assistant';

export type MediaType = 'text' | 'image' | 'code' | 'audio' | 'video' | 'document' | 'spreadsheet';

export interface Annotation {
  id: string;
  text: string;
  position: { x: number; y: number };
  mediaId: string;
}

export interface MediaContent {
  id: string;
  type: MediaType;
  content: string;
  metadata?: Record<string, any>;
  annotations?: Annotation[];
}

export interface Message {
  id: string;
  sender: MessageSender;
  timestamp: number;
  content: MediaContent[];
  isTyping?: boolean;
}

export interface ChatState {
  messages: Message[];
  annotations: Record<string, Annotation[]>;
  selectedMessageId: string | null;
  isAnnotating: boolean;
}
