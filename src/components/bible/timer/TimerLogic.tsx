import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useBibleReading } from "@/hooks/useBibleReading";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

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
      
      const finalMinutes = Math.ceil(timer / 60);
      onLastSessionMinutesChange(finalMinutes);
      console.log("Timer stopped, final minutes:", finalMinutes);
      
      // Update the cumulative reading progress
      if (user) {
        const firstDayOfMonth = new Date();
        firstDayOfMonth.setDate(1);
        firstDayOfMonth.setHours(0, 0, 0, 0);

        // Get existing cumulative data
        const { data: existingData } = await supabase
          .from('bible_reading_cumulative')
          .select('current_month_minutes')
          .eq('user_id', user.id)
          .maybeSingle();

        if (existingData) {
          // Update existing record
          await supabase
            .from('bible_reading_cumulative')
            .update({
              current_month_minutes: existingData.current_month_minutes + finalMinutes,
              last_reset_date: firstDayOfMonth.toISOString()
            })
            .eq('user_id', user.id);
        } else {
          // Create new record
          await supabase
            .from('bible_reading_cumulative')
            .insert({
              user_id: user.id,
              current_month_minutes: finalMinutes,
              total_minutes: finalMinutes,
              last_reset_date: firstDayOfMonth.toISOString()
            });
        }
      }
      
      onProgressUpdate(finalMinutes);
      await endReadingSession(sessionId, timer);
      onIsReadingChange(false);
      setTimer(0);
      onTimerChange(0);
      setSessionId(null);

      toast({
        title: "Reading Session Completed",
        description: `You've read for ${finalMinutes} minutes. Great job!`,
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

  return { handleStartTimer, handleStopTimer };
}