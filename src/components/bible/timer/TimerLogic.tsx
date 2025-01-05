import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useBibleReading } from "@/hooks/useBibleReading";
import { useAuth } from "@/contexts/AuthContext";
import { useTimer } from "@/hooks/bible/useTimer";
import { 
  updateReadingSession, 
  updateReadingProgress, 
  updateCumulativeProgress 
} from "@/lib/bible/sessionUtils";

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
  const { user } = useAuth();
  const { timer, startTimer, stopTimer } = useTimer();
  const [sessionId, setSessionId] = useState<string | null>(null);

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
        console.log("Started new reading session:", session);
        setSessionId(session.id);
        onIsReadingChange(true);
        startTimer();
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
    if (sessionId) {
      const finalSeconds = stopTimer();
      const finalMinutes = Math.floor(finalSeconds / 60);
      onLastSessionMinutesChange(finalMinutes);
      
      try {
        await updateReadingSession(sessionId, finalMinutes);
        await updateReadingProgress(user?.id, selectedBook, parseInt(selectedChapter), finalMinutes);
        await updateCumulativeProgress(user?.id, finalMinutes);
        
        onProgressUpdate(finalMinutes);
        await endReadingSession(sessionId, finalMinutes);
        
        toast({
          title: "Reading Session Completed",
          description: `You've read for ${finalMinutes} minutes. Great job!`,
        });
      } catch (error) {
        console.error('Error updating reading progress:', error);
        toast({
          title: "Error",
          description: "Failed to update reading progress",
          variant: "destructive",
        });
      } finally {
        onIsReadingChange(false);
        onTimerChange(0);
        setSessionId(null);
      }
    }
  };

  // Update parent timer state whenever our local timer changes
  useState(() => {
    onTimerChange(timer);
  });

  return { handleStartTimer, handleStopTimer };
}