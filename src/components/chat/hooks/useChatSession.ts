import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { chatApi } from '../api/chatApi';
import { getApiKey } from '../api/apiKeyManager';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function useChatSession() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const initializeSession = async () => {
    if (isLoading || sessionId) return;
    setIsLoading(true);

    try {
      const apiKey = await getApiKey();
      if (!apiKey) {
        setIsLoading(false);
        return;
      }

      const data = await chatApi.initializeSession(apiKey);
      console.log('Chat session initialized successfully:', data);
      
      setSessionId(data.session_id);
      setMessages([{
        role: 'assistant',
        content: 'Hello! How can I help you today?'
      }]);
    } catch (error: any) {
      console.error('Error initializing chat session:', error);
      let errorMessage = "Failed to initialize chat session. Please try again later.";
      
      if (error.message.includes('Failed to fetch')) {
        errorMessage = "Unable to connect to chat service. Please check your internet connection.";
      } else if (error.message.includes('No session ID received')) {
        errorMessage = "Invalid response from chat service. Please try again.";
      }

      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
      setSessionId(null);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (message: string) => {
    if (!sessionId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Chat session not initialized. Please try again.",
      });
      return;
    }

    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: message }]);

    try {
      const apiKey = await getApiKey();
      if (!apiKey) {
        setIsLoading(false);
        return;
      }

      const response = await chatApi.sendMessage(apiKey, sessionId, message);
      
      if (response.messages && response.messages.length > 0) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: response.messages[response.messages.length - 1].content 
        }]);
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      const errorMessage = error.message.includes('Failed to fetch')
        ? "Unable to connect to chat service. Please check your internet connection."
        : "Failed to send message. Please try again later.";
        
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    sessionId,
    initializeSession,
    sendMessage
  };
}