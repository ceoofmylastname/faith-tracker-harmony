import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function useChatSession() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const getApiKey = async (): Promise<string | null> => {
    try {
      console.log('Fetching API key from secrets table...');
      const { data: secretData, error } = await supabase
        .from('secrets')
        .select('value')
        .eq('name', 'AGENTIVE_HUB_API_KEY')
        .maybeSingle();
      
      console.log('Secret data response:', secretData);

      if (error) throw error;
      if (!secretData?.value) {
        console.error('API key not found in secrets table');
        toast({
          variant: "destructive",
          title: "Configuration Error",
          description: "AGENTIVE_HUB_API_KEY not found in secrets table. Please ensure it has been added.",
        });
        return null;
      }

      console.log('API key found successfully');
      return secretData.value;
    } catch (error) {
      console.error('Error fetching API key:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to retrieve API key. Please check the configuration.",
      });
      return null;
    }
  };

  const initializeSession = async () => {
    try {
      const apiKey = await getApiKey();
      if (!apiKey) return;

      console.log('Initializing chat session...');
      const response = await fetch('https://agentivehub.com/api/chat/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: apiKey,
          assistant_id: "5adba391-71e1-4eec-9453-359e115b5688",
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to initialize session: ${response.statusText}`);
      }

      const { session_id } = await response.json();
      console.log('Chat session initialized successfully');
      setSessionId(session_id);
    } catch (error) {
      console.error('Error initializing chat session:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to initialize chat session. Please try again later.",
      });
    }
  };

  const sendMessage = async (message: string) => {
    if (!sessionId) return;
    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: message }]);

    try {
      const apiKey = await getApiKey();
      if (!apiKey) {
        setIsLoading(false);
        return;
      }

      console.log('Sending message to chat API...');
      const response = await fetch('https://agentivehub.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: apiKey,
          session_id: sessionId,
          type: "custom_code",
          assistant_id: "5adba391-71e1-4eec-9453-359e115b5688",
          messages: [{ role: 'user', content: message }],
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Received response from chat API:', data);
      
      if (data.messages && data.messages.length > 0) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.messages[data.messages.length - 1].content 
        }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again later.",
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