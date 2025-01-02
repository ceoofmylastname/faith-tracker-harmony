import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useBibleReading } from "@/hooks/useBibleReading";
import { TimerDisplay } from "./timer/TimerDisplay";

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
  const [lastSessionMinutes, setLastSessionMinutes] = useState<number | null>(null);

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
            // Update progress every minute
            if (newValue % 60 === 0) {
              const minutes = Math.ceil(newValue / 60);
              console.log("Timer updating progress:", minutes);
              onProgressUpdate(minutes);
            }
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
      
      // Calculate final minutes and update progress
      const finalMinutes = Math.ceil(timer / 60);
      setLastSessionMinutes(finalMinutes);
      console.log("Timer stopped, final minutes:", finalMinutes);
      onProgressUpdate(finalMinutes);
      
      await endReadingSession(sessionId, timer);
      setIsReading(false);
      setTimer(0);
      setSessionId(null);
      
      toast({
        title: "Success",
        description: `Reading session recorded: ${finalMinutes} minutes`,
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

  return (
    <div className="space-y-4">
      <TimerDisplay
        isReading={isReading}
        timer={timer}
        onStart={handleStartTimer}
        onStop={handleStopTimer}
      />
      {lastSessionMinutes !== null && (
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Last session: {lastSessionMinutes} minutes
        </div>
      )}
    </div>
  );
}