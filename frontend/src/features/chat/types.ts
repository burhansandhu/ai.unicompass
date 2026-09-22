export interface ChatMessageItem {
  role: 'user' | 'advisor' | 'model';
  text: string;
}

export interface ChatRequestPayload {
  messages: ChatMessageItem[];
  profile_context?: Record<string, any>;
}

export interface ChatResponsePayload {
  reply: string;
  model: string;
}
