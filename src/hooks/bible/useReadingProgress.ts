import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

export const useReadingProgress = () => {
  const { user } = useAuth();
  const [todayProgress, setTodayProgress] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    const fetchTodayProgress = async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data: sessions, error } = await supabase
        .from('bible_reading_sessions')
        .select('duration_seconds')
        .eq('user_id', user.id)
        .gte('started_at', today);

      if (error) {
        console.error('Error fetching today\'s progress:', error);
        return;
      }

      if (sessions) {
        const totalMinutes = sessions.reduce(
          (acc, session) => acc + Math.ceil(session.duration_seconds / 60),
          0
        );
        setTodayProgress(totalMinutes);
      }
    };

    fetchTodayProgress();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('bible-reading-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bible_reading_sessions',
          filter: `user_id=eq.${user.id}`,
        },
        () => fetchTodayProgress()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const updateTodayProgress = (minutes: number) => {
    console.log("Updating today's progress:", minutes);
    setTodayProgress(minutes);
  };

  return { todayProgress, updateTodayProgress };
};