import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { addDays, isSameDay, parseISO } from "date-fns";

export const useReadingStreak = () => {
  const { user } = useAuth();
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  useEffect(() => {
    if (!user) return;

    const calculateStreak = async () => {
      const { data: sessions } = await supabase
        .from("bible_reading_sessions")
        .select("started_at")
        .eq("user_id", user.id)
        .order("started_at", { ascending: false });

      if (sessions && sessions.length > 0) {
        let currentStreak = 0;
        let maxStreak = 0;
        let currentDate = new Date();

        for (let i = 0; i < sessions.length; i++) {
          const sessionDate = parseISO(sessions[i].started_at);
          
          if (isSameDay(currentDate, sessionDate) || 
              isSameDay(addDays(currentDate, -1), sessionDate)) {
            currentStreak++;
            currentDate = sessionDate;
            maxStreak = Math.max(maxStreak, currentStreak);
          } else {
            break;
          }
        }

        setStreak(currentStreak);
        setBestStreak(maxStreak);
      }
    };

    calculateStreak();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('streak-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bible_reading_sessions',
          filter: `user_id=eq.${user.id}`,
        },
        () => calculateStreak()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { streak, bestStreak };
};