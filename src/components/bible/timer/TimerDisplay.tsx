import { formatTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface TimerDisplayProps {
  isReading: boolean;
  timer: number;
  onStart: () => void;
  onStop: () => void;
}

export function TimerDisplay({ isReading, timer, onStart, onStop }: TimerDisplayProps) {
  return (
    <Button
      variant={isReading ? "destructive" : "outline"}
      className="w-full sm:w-auto gap-2 text-sm"
      onClick={isReading ? onStop : onStart}
    >
      <Clock className="h-4 w-4" />
      {isReading ? `Stop (${formatTime(timer)})` : "Start Timer"}
    </Button>
  );
}