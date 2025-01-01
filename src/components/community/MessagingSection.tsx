import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Users, User, Send, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";

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
    <div className="flex flex-col h-[calc(100vh-12rem)] space-y-4">
      <Card className="p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="space-y-4">
          <div className="flex gap-4">
            <Select value={recipient} onValueChange={setRecipient}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select recipient" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="community">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Everyone</span>
                  </div>
                </SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{user.name || 'Anonymous'}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={sendMessage}
              className="flex items-center gap-2 bg-primary hover:bg-primary-dark"
            >
              <Send className="h-4 w-4" />
              Send
            </Button>
          </div>
          <Textarea
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[100px] resize-none"
          />
        </div>
      </Card>

      <ScrollArea className="flex-1 rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="space-y-4 p-4">
          {messages.map((msg) => (
            <Card 
              key={msg.id} 
              className={`p-4 transition-all hover:shadow-md ${
                msg.sender?.email === user?.email 
                  ? 'ml-12 bg-primary/10' 
                  : 'mr-12'
              }`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <div className="bg-primary text-primary-foreground rounded-full h-full w-full flex items-center justify-center text-sm font-semibold">
                      {msg.sender?.name?.[0]?.toUpperCase() || msg.sender?.email?.[0]?.toUpperCase() || '?'}
                    </div>
                  </Avatar>
                  <div>
                    <div className="font-semibold">
                      {msg.sender?.name || 'Anonymous'}
                      {msg.is_community_message ? " (to Everyone)" : msg.recipient?.name ? ` to ${msg.recipient.name}` : ""}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(msg.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm">{msg.content}</p>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}