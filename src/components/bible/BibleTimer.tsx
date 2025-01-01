import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useBibleReading } from "@/hooks/useBibleReading";

interface BibleTimerProps {
  selectedBook: string;
  selectedChapter: string;
  onProgressUpdate: (minutes: number) => void;
}

export default function BibleTimer({ selectedBook, selectedChapter, onProgressUpdate }: BibleTimerProps) {
  const { toast } = useToast();
  const { startReadingSession, endReadingSession } = useBibleReading();
  
  const [isReading, setIsReading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  const handleStartTimer = async () => {
    if (!selectedBook || !selectedChapter) {
      toast({
        title: "Selection Required",
        description: "Please select a book and chapter before starting the timer",
        variant: "destructive",
      });
      return;
    }

    try {
      const session = await startReadingSession(selectedBook, parseInt(selectedChapter));
      if (session) {
        setSessionId(session.id);
        setIsReading(true);
        const interval = setInterval(() => {
          setTimer(prev => {
            const newValue = prev + 1;
            onProgressUpdate(Math.floor(newValue / 60));
            return newValue;
          });
        }, 1000);
        setTimerInterval(interval);
      }
    } catch (error) {
      console.error("Error starting session:", error);
      toast({
        title: "Error",
        description: "Failed to start reading session",
        variant: "destructive",
      });
    }
  };

  const handleStopTimer = async () => {
    if (sessionId && timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
      await endReadingSession(sessionId, timer);
      setIsReading(false);
      setTimer(0);
      setSessionId(null);
      
      toast({
        title: "Success",
        description: "Reading session recorded successfully!",
      });
    }
  };

  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Button
      variant={isReading ? "destructive" : "outline"}
      className="w-full sm:w-auto gap-2 text-sm"
      onClick={isReading ? handleStopTimer : handleStartTimer}
    >
      <Clock className="h-4 w-4" />
      {isReading ? `Stop (${formatTime(timer)})` : "Start Timer"}
    </Button>
  );
}