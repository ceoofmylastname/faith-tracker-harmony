import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface MessageInputProps {
  message: string;
  setMessage: (message: string) => void;
  sendMessage: () => void;
}

export function MessageInput({ message, setMessage, sendMessage }: MessageInputProps) {
  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Write something..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="min-h-[100px] resize-none bg-white/80 backdrop-blur-sm border-gray-200"
      />
      <Button 
        onClick={sendMessage}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
      >
        <Send className="h-4 w-4" />
        Post
      </Button>
    </div>
  );
}