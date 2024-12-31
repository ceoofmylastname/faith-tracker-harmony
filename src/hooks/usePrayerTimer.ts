import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

export const usePrayerTimer = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const { toast } = useToast();

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
    setIsRunning(true);
    setStartTime(new Date());
  };

  const stopTimer = async () => {
    setIsRunning(false);
    
    if (startTime) {
      const endTime = new Date();
      try {
        const { error } = await supabase
          .from('prayer_sessions')
          .insert({
            duration_seconds: time,
            started_at: startTime.toISOString(),
            ended_at: endTime.toISOString()
          });

        if (error) throw error;

        toast({
          title: "Prayer session saved",
          description: `You prayed for ${Math.floor(time / 60)} minutes and ${time % 60} seconds`,
        });
      } catch (error) {
        console.error('Error saving prayer session:', error);
        toast({
          title: "Error saving prayer session",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    }

    setTime(0);
    setStartTime(null);
  };

  return {
    isRunning,
    time,
    startTimer,
    stopTimer
  };
};