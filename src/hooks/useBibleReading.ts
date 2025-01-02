import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { addDays, isSameDay, parseISO } from "date-fns";

export const useBibleReading = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [readingGoal, setReadingGoal] = useState<number>(30);
  const [todayProgress, setTodayProgress] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // Fetch reading goal
        const { data: goalData, error: goalError } = await supabase
          .from("bible_reading_goals")
          .select("daily_minutes")
          .eq("user_id", user.id)
          .maybeSingle();

        if (goalError) throw goalError;

        // If no goal exists, create a default one
        if (!goalData) {
          const { data: newGoal, error: createError } = await supabase
            .from("bible_reading_goals")
            .insert({
              user_id: user.id,
              daily_minutes: 30,
            })
            .select("daily_minutes")
            .single();

          if (createError) throw createError;
          setReadingGoal(newGoal.daily_minutes);
        } else {
          setReadingGoal(goalData.daily_minutes);
        }

        // Fetch today's progress
        const today = new Date();
        const { data: sessionsData } = await supabase
          .from("bible_reading_sessions")
          .select("duration_seconds, started_at")
          .eq("user_id", user.id)
          .gte("started_at", today.toISOString().split("T")[0]);

        if (sessionsData) {
          const totalMinutes = sessionsData.reduce(
            (acc, session) => acc + session.duration_seconds / 60,
            0
          );
          setTodayProgress(totalMinutes);
        }

        // Calculate streak
        const { data: streakData } = await supabase
          .from("bible_reading_sessions")
          .select("started_at")
          .eq("user_id", user.id)
          .order("started_at", { ascending: false });

        if (streakData && streakData.length > 0) {
          let currentStreak = 0;
          let maxStreak = 0;
          let currentDate = new Date();

          for (let i = 0; i < streakData.length; i++) {
            const sessionDate = parseISO(streakData[i].started_at);
            
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

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching Bible reading data:", error);
        toast({
          title: "Error",
          description: "Failed to load Bible reading data",
          variant: "destructive",
        });
      }
    };

    fetchData();

    // Subscribe to real-time updates
    const channel = supabase
      .channel("bible-reading-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bible_reading_sessions",
        },
        (payload) => {
          console.log("Real-time update:", payload);
          // Refresh data when changes occur
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

  const updateTodayProgress = (minutes: number) => {
    console.log("Updating today's progress:", minutes);
    setTodayProgress(minutes);
  };

  return {
    isLoading,
    readingGoal,
    todayProgress,
    streak,
    bestStreak,
    updateTodayProgress,
  };
};
