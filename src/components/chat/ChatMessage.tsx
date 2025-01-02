import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  return (
    <div className={cn("flex", role === 'user' ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          "max-w-[80%] rounded-lg p-2",
          role === 'user' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800'
        )}
      >
        {content}
      </div>
    </div>
  );
}