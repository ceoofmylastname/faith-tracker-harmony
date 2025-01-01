import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { MessageInput } from "./message/MessageInput";
import { RecipientSelector } from "./message/RecipientSelector";
import { MessageList } from "./message/MessageList";

export default function MessagingSection() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState<string>("community");
  const [users, setUsers] = useState<Array<{ id: string; name: string; email: string }>>([]);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadUsers();
      loadMessages();
      subscribeToMessages();
    }
  }, [user]);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, name")
        .neq("id", user?.id);

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      console.error("Error loading users:", error);
      toast({
        variant: "destructive",
        title: "Error loading users",
        description: error.message,
      });
    }
  };

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(email, name),
          recipient:profiles!messages_recipient_id_fkey(email, name)
        `)
        .or(`recipient_id.eq.${user?.id},sender_id.eq.${user?.id},is_community_message.eq.true`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error: any) {
      console.error("Error loading messages:", error);
      toast({
        variant: "destructive",
        title: "Error loading messages",
        description: error.message,
      });
    }
  };

  const subscribeToMessages = () => {
    const subscription = supabase
      .channel('messages_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
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
        is_community_message: recipient === "community",
        recipient_id: recipient === "community" ? null : recipient,
      };

      const { error } = await supabase.from("messages").insert([newMessage]);

      if (error) throw error;

      setMessage("");
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
      });
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        variant: "destructive",
        title: "Error sending message",
        description: error.message,
      });
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] space-y-4 max-w-5xl mx-auto">
      <div className="flex flex-col space-y-4 bg-white/60 backdrop-blur-sm p-6 rounded-lg border shadow-sm">
        <div className="flex items-center gap-4">
          <RecipientSelector 
            recipient={recipient}
            setRecipient={setRecipient}
            users={users}
          />
        </div>
        <MessageInput 
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
      <MessageList 
        messages={messages}
        currentUserEmail={user?.email}
      />
    </div>
  );
}