import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Users } from "lucide-react";

export default function MessagingSection() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState<string>("community");
  const [users, setUsers] = useState<Array<{ id: string; email: string }>>([]);
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
        .select("id, email")
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
          sender:profiles!messages_sender_id_fkey(email),
          recipient:profiles!messages_recipient_id_fkey(email)
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
    <div className="space-y-4">
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex gap-4">
            <Select value={recipient} onValueChange={setRecipient}>
              <SelectTrigger>
                <SelectValue placeholder="Select recipient" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="community">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Everyone
                  </div>
                </SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={sendMessage}>Send</Button>
          </div>
          <Textarea
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
      </Card>

      <div className="space-y-4">
        {messages.map((msg) => (
          <Card key={msg.id} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="font-semibold">
                {msg.sender?.email === user?.email ? "You" : msg.sender?.email}
                {msg.is_community_message ? " (to Everyone)" : msg.recipient?.email ? ` to ${msg.recipient.email}` : ""}
              </div>
              <div className="text-sm text-gray-500">
                {new Date(msg.created_at).toLocaleString()}
              </div>
            </div>
            <p className="whitespace-pre-wrap">{msg.content}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}