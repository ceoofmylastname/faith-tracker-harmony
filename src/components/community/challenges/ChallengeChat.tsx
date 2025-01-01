import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { MessageInput } from "../message/MessageInput";
import { MessageList } from "../message/MessageList";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

interface ChallengeChatProps {
  challengeId: string;
  challengeName: string;
}

export function ChallengeChat({ challengeId, challengeName }: ChallengeChatProps) {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadMessages();
      subscribeToMessages();
    }
  }, [user, challengeId]);

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(email, name),
          recipient:profiles!messages_recipient_id_fkey(email, name)
        `)
        .eq('challenge_id', challengeId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error: any) {
      console.error("Error loading challenge messages:", error);
    }
  };

  const subscribeToMessages = () => {
    const subscription = supabase
      .channel('challenge_messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `challenge_id=eq.${challengeId}`
        },
        () => {
          loadMessages();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      const newMessage = {
        sender_id: user?.id,
        content: message,
        challenge_id: challengeId,
        is_challenge_message: true
      };

      const { error } = await supabase.from("messages").insert([newMessage]);

      if (error) throw error;
      setMessage("");
    } catch (error: any) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="text-sm font-medium text-muted-foreground">
        {challengeName} Chat
      </div>
      <ScrollArea className="h-[300px] rounded-md border">
        <MessageList 
          messages={messages}
          currentUserEmail={user?.email}
        />
      </ScrollArea>
      <MessageInput 
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
      />
    </Card>
  );
}