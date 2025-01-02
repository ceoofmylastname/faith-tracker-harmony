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
      console.log('Initializing chat session with Agentive Hub...');
      
      const response = await fetch(`${BASE_URL}/chat/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          assistant_id: "5adba391-71e1-4eec-9453-359e115b5688",
          model: "gpt-4",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Chat session initialization failed:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Chat session initialized successfully:', data);
      
      if (!data.session_id) {
        throw new Error('Invalid response: No session ID received');
      }

      return data;
    } catch (error: any) {
      console.error('Chat session initialization error:', error);
      
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Unable to reach Agentive Hub. Please check if the API key is correct.');
      }
      
      throw error;
    }
  },

  async sendMessage(apiKey: string, sessionId: string, message: string): Promise<ChatResponse> {
    try {
      console.log('Sending message to chat service...');
      
      const response = await fetch(`${BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          session_id: sessionId,
          type: "custom_code",
          assistant_id: "5adba391-71e1-4eec-9453-359e115b5688",
          model: "gpt-4",
          messages: [{ role: 'user', content: message }],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Message sending failed:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Message sent successfully:', data);
      return data;
    } catch (error: any) {
      console.error('Failed to send message:', error);
      throw new Error('Failed to send message. Please try again.');
    }
  }
};