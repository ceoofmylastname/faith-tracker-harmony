import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const usePrayerTimer = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning]);

  const startTimer = () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to track prayer time",
        variant: "destructive",
      });
      return;
    }
    setIsRunning(true);
    setStartTime(new Date());
  };

  const stopTimer = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save prayer time",
        variant: "destructive",
      });
      return;
    }

    setIsRunning(false);
    
    if (startTime) {
      const endTime = new Date();
      try {
        const { error } = await supabase
          .from('prayer_sessions')
          .insert({
            duration_seconds: time,
            started_at: startTime.toISOString(),
            ended_at: endTime.toISOString(),
            user_id: user.id
          });

        if (error) throw error;

        toast({
          title: "Prayer session saved",
          description: `You prayed for ${Math.floor(time / 60)} minutes and ${time % 60} seconds`,
        });

        // Reset timer after saving
        setTime(0);
        setStartTime(null);
        
        return true;
      } catch (error: any) {
        console.error('Error saving prayer session:', error);
        toast({
          title: "Error saving prayer session",
          description: "Please try again later",
          variant: "destructive",
        });
        return false;
      }
    }
  };

  return {
    isRunning,
    time,
    startTimer,
    stopTimer
  };
};