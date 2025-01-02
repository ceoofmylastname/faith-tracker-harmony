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
      // Get cumulative progress for the current month
      const { data: cumulativeData, error: cumulativeError } = await supabase
        .from('bible_reading_cumulative')
        .select('current_month_minutes')
        .eq('user_id', user.id)
        .maybeSingle();

      if (cumulativeError) {
        console.error('Error fetching cumulative progress:', cumulativeError);
        return;
      }

      if (cumulativeData) {
        setTodayProgress(cumulativeData.current_month_minutes || 0);
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
          table: 'bible_reading_cumulative',
          filter: `user_id=eq.${user.id}`,
        },
        (payload: { new: { current_month_minutes?: number } }) => {
          if (payload.new && typeof payload.new.current_month_minutes === 'number') {
            setTodayProgress(payload.new.current_month_minutes);
          }
        }
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