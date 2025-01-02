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

  const initializeSession = async () => {
    try {
      const { data: secretData, error: secretError } = await supabase
        .from('secrets')
        .select('value')
        .eq('name', 'AGENTIVE_HUB_API_KEY')
        .single();

      if (secretError) throw secretError;
      if (!secretData?.value) throw new Error('API key not found');

      const { data: { session_id } } = await fetch('https://agentivehub.com/api/chat/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: secretData.value,
          assistant_id: "5adba391-71e1-4eec-9453-359e115b5688",
        }),
      }).then(res => res.json());
      
      setSessionId(session_id);
    } catch (error) {
      console.error('Error initializing chat session:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to initialize chat session",
      });
    }
  };

  const sendMessage = async (message: string) => {
    if (!sessionId) return;
    setIsLoading(true);

    setMessages(prev => [...prev, { role: 'user', content: message }]);

    try {
      const { data: secretData, error: secretError } = await supabase
        .from('secrets')
        .select('value')
        .eq('name', 'AGENTIVE_HUB_API_KEY')
        .single();

      if (secretError) throw secretError;
      if (!secretData?.value) throw new Error('API key not found');

      const response = await fetch('https://agentivehub.com/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: secretData.value,
          session_id: sessionId,
          type: "custom_code",
          assistant_id: "5adba391-71e1-4eec-9453-359e115b5688",
          messages: [{ role: 'user', content: message }],
        }),
      });

      const data = await response.json();
      
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
        description: "Failed to send message",
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