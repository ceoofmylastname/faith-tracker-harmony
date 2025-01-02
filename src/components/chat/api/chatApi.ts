import { toast } from "@/hooks/use-toast";

const BASE_URL = 'https://agentivehub.com/api';

export interface ChatSession {
  session_id: string;
}

export interface ChatResponse {
  messages: Array<{ role: 'assistant' | 'user'; content: string }>;
}

export const chatApi = {
  async initializeSession(apiKey: string): Promise<ChatSession> {
    try {
      const response = await fetch(`${BASE_URL}/chat/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': window.location.origin,
        },
        body: JSON.stringify({
          api_key: apiKey,
          assistant_id: "5adba391-71e1-4eec-9453-359e115b5688",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.session_id) {
        throw new Error('No session ID received');
      }

      return data;
    } catch (error) {
      console.error('Chat session initialization failed:', error);
      throw error;
    }
  },

  async sendMessage(apiKey: string, sessionId: string, message: string): Promise<ChatResponse> {
    try {
      const response = await fetch(`${BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': window.location.origin,
        },
        body: JSON.stringify({
          api_key: apiKey,
          session_id: sessionId,
          type: "custom_code",
          assistant_id: "5adba391-71e1-4eec-9453-359e115b5688",
          messages: [{ role: 'user', content: message }],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }
};