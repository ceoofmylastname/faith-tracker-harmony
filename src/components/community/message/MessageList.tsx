import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock } from "lucide-react";

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender: { email: string; name: string };
  recipient?: { email: string; name: string };
  is_community_message: boolean;
}

interface MessageListProps {
  messages: Message[];
  currentUserEmail?: string;
}

export function MessageList({ messages, currentUserEmail }: MessageListProps) {
  return (
    <ScrollArea className="flex-1 rounded-lg border bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="space-y-4 p-4">
        {messages.map((msg) => (
          <Card 
            key={msg.id} 
            className={`p-4 transition-all hover:shadow-md ${
              msg.sender?.email === currentUserEmail 
                ? 'ml-12 bg-blue-50/80' 
                : 'mr-12 bg-white/80'
            }`}
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 bg-blue-600 text-white">
                  <div className="flex h-full w-full items-center justify-center text-sm font-semibold">
                    {msg.sender?.name?.[0]?.toUpperCase() || msg.sender?.email?.[0]?.toUpperCase() || '?'}
                  </div>
                </Avatar>
                <div>
                  <div className="font-semibold text-gray-900">
                    {msg.sender?.name || 'Anonymous'}
                    {msg.is_community_message ? 
                      " (to Everyone)" : 
                      msg.recipient?.name ? ` to ${msg.recipient.name}` : ""
                    }
                  </div>
                  <div className="flex items-center text-xs text-gray-500 gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(msg.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">{msg.content}</p>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}