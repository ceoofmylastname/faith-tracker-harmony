import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useBibleReading } from "@/hooks/useBibleReading";

interface TimerLogicProps {
  selectedBook: string;
  selectedChapter: string;
  onProgressUpdate: (minutes: number) => void;
  onTimerChange: (timer: number) => void;
  onIsReadingChange: (isReading: boolean) => void;
  onLastSessionMinutesChange: (minutes: number | null) => void;
}

export function TimerLogic({
  selectedBook,
  selectedChapter,
  onProgressUpdate,
  onTimerChange,
  onIsReadingChange,
  onLastSessionMinutesChange,
}: TimerLogicProps) {
  const { toast } = useToast();
  const { startReadingSession, endReadingSession } = useBibleReading();
  
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
        onIsReadingChange(true);
        const interval = setInterval(() => {
          setTimer(prev => {
            const newValue = prev + 1;
            onTimerChange(newValue);
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
      onLastSessionMinutesChange(finalMinutes);
      console.log("Timer stopped, final minutes:", finalMinutes);
      onProgressUpdate(finalMinutes);
      
      await endReadingSession(sessionId, timer);
      onIsReadingChange(false);
      setTimer(0);
      onTimerChange(0);
      setSessionId(null);
    }
  };

  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  return { handleStartTimer, handleStopTimer };
}