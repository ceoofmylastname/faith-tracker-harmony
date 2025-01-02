import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ChatHeaderProps {
  onClose: () => void;
}

export function ChatHeader({ onClose }: ChatHeaderProps) {
  return (
    <div className="p-3 bg-primary text-white flex justify-between items-center">
      <span className="font-semibold">Chat Assistant</span>
      <Button 
        variant="ghost" 
        size="icon"
        className="text-white hover:text-white/80"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}