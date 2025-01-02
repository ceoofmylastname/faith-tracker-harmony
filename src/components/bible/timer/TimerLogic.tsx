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

  const updateCumulativeProgress = async (minutes: number) => {
    if (!user) return;

    try {
      // First, try to get existing cumulative progress
      const { data: existingProgress } = await supabase
        .from('bible_reading_cumulative')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      if (existingProgress) {
        // Check if we need to reset monthly progress
        const lastResetDate = new Date(existingProgress.last_reset_date);
        const shouldResetMonthly = lastResetDate < firstDayOfMonth;

        const { error } = await supabase
          .from('bible_reading_cumulative')
          .update({
            total_minutes: existingProgress.total_minutes + minutes,
            current_month_minutes: shouldResetMonthly ? minutes : existingProgress.current_month_minutes + minutes,
            last_reset_date: shouldResetMonthly ? firstDayOfMonth.toISOString() : existingProgress.last_reset_date
          })
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Create new progress record
        const { error } = await supabase
          .from('bible_reading_cumulative')
          .insert({
            user_id: user.id,
            total_minutes: minutes,
            current_month_minutes: minutes,
            last_reset_date: firstDayOfMonth.toISOString()
          });

        if (error) throw error;
      }

      // Update the local state through the callback
      onProgressUpdate(minutes);
      console.log('Updated cumulative progress:', { minutes });
    } catch (error) {
      console.error('Error updating cumulative progress:', error);
      toast({
        title: "Error",
        description: "Failed to update reading progress",
        variant: "destructive",
      });
    }
  };

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
      
      await Promise.all([
        endReadingSession(sessionId, timer),
        updateCumulativeProgress(finalMinutes)
      ]);

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